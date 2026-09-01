begin;

alter table public.claim_grid_sessions
    add column if not exists game_ends_at timestamptz;

alter table public.claim_grid_players
    add column if not exists correct_answer_progress smallint not null default 0,
    add column if not exists available_captures smallint not null default 0,
    add column if not exists current_question_position smallint not null default 1,
    add column if not exists total_answers integer not null default 0;

alter table public.claim_grid_players
    drop constraint if exists claim_grid_players_correct_answer_progress_check;

alter table public.claim_grid_players
    add constraint claim_grid_players_correct_answer_progress_check
    check (correct_answer_progress between 0 and 2);

alter table public.claim_grid_players
    drop constraint if exists claim_grid_players_available_captures_check;

alter table public.claim_grid_players
    add constraint claim_grid_players_available_captures_check
    check (available_captures >= 0);

create or replace function public.start_claim_grid_session(input_session_id uuid)
returns public.claim_grid_sessions
language plpgsql security definer set search_path = ''
as $function$
declare updated_session public.claim_grid_sessions;
begin
    if not exists (
        select 1 from public.claim_grid_sessions
        where id = input_session_id and host_id = auth.uid()
          and status = 'lobby' and expires_at > now()
    ) then
        raise exception 'This Claim the Grid game could not be started.';
    end if;
    if not exists (
        select 1 from public.claim_grid_players where session_id = input_session_id
    ) then
        raise exception 'At least one student must join before the game starts.';
    end if;

    update public.claim_grid_sessions
    set status = 'active', round_phase = 'self_paced',
        current_question_position = 0, question_started_at = null,
        territory_started_at = null, started_at = now(),
        game_ends_at = now() + make_interval(mins => game_duration_minutes),
        updated_at = now()
    where id = input_session_id
    returning * into updated_session;

    update public.claim_grid_players
    set correct_answer_progress = 0, available_captures = 0,
        current_question_position = 1, total_answers = 0,
        last_seen_at = now()
    where session_id = input_session_id;
    return updated_session;
end;
$function$;

create or replace function public.get_claim_grid_player_game(input_player_id uuid)
returns jsonb language plpgsql security definer set search_path = ''
as $function$
declare
    target_player public.claim_grid_players;
    target_session public.claim_grid_sessions;
    target_team public.claim_grid_teams;
    current_question jsonb;
    current_choices jsonb := '[]'::jsonb;
begin
    select * into target_player from public.claim_grid_players
    where id = input_player_id and user_id = auth.uid();
    if not found then raise exception 'This player session is unavailable.'; end if;

    select * into target_session from public.claim_grid_sessions
    where id = target_player.session_id and expires_at > now();
    if not found then raise exception 'This Claim the Grid room is unavailable.'; end if;

    if target_session.status = 'active' and target_session.game_ends_at is not null
       and now() >= target_session.game_ends_at then
        update public.claim_grid_sessions
        set status = 'finished', ended_at = coalesce(ended_at, now()), updated_at = now()
        where id = target_session.id and status = 'active'
        returning * into target_session;
    end if;

    select * into target_team from public.claim_grid_teams
    where session_id = target_player.session_id
      and team_number = target_player.team_number;

    if target_session.status = 'active' and target_player.available_captures = 0 then
        select jsonb_build_object(
            'id', question.id, 'position', question.position,
            'question_text', question.question_text,
            'question_item_id', question.question_item_id,
            'image_url', item.image_url
        ) into current_question
        from public.claim_grid_session_questions as question
        left join public.items as item on item.id = question.question_item_id
        where question.session_id = target_session.id
          and question.position = target_player.current_question_position;

        select coalesce(jsonb_agg(jsonb_build_object(
            'id', choice.id, 'position', choice.position,
            'answer_text', choice.answer_text,
            'answer_item_id', choice.answer_item_id,
            'image_url', item.image_url
        ) order by choice.position), '[]'::jsonb)
        into current_choices
        from public.claim_grid_session_choices as choice
        left join public.items as item on item.id = choice.answer_item_id
        where choice.question_id = (current_question ->> 'id')::bigint;
    end if;

    update public.claim_grid_players
    set last_seen_at = now(), is_connected = true where id = target_player.id;

    return jsonb_build_object(
        'player', to_jsonb(target_player), 'session', to_jsonb(target_session),
        'team', to_jsonb(target_team), 'question', current_question,
        'choices', current_choices
    );
end;
$function$;

create or replace function public.submit_claim_grid_self_paced_answer(
    input_player_id uuid, input_choice_id bigint
)
returns jsonb language plpgsql security definer set search_path = ''
as $function$
declare
    target_player public.claim_grid_players;
    target_session public.claim_grid_sessions;
    target_question public.claim_grid_session_questions;
    target_choice public.claim_grid_session_choices;
    question_count integer;
    next_position smallint;
    next_progress smallint;
    next_captures smallint;
begin
    select * into target_player from public.claim_grid_players
    where id = input_player_id and user_id = auth.uid() for update;
    if not found then raise exception 'This player session is unavailable.'; end if;

    select * into target_session from public.claim_grid_sessions
    where id = target_player.session_id and status = 'active'
      and expires_at > now() and game_ends_at > now();
    if not found then raise exception 'This Claim the Grid game is not active.'; end if;
    if target_player.available_captures > 0 then
        raise exception 'Use your available territory captures before answering again.';
    end if;

    select * into target_question from public.claim_grid_session_questions
    where session_id = target_session.id
      and position = target_player.current_question_position;
    select * into target_choice from public.claim_grid_session_choices
    where id = input_choice_id and question_id = target_question.id;
    if not found then raise exception 'That answer choice is unavailable.'; end if;

    select count(*) into question_count from public.claim_grid_session_questions
    where session_id = target_session.id;
    select position into next_position from public.claim_grid_session_questions
    where session_id = target_session.id
      and (question_count = 1 or position <> target_player.current_question_position)
    order by random() limit 1;

    if target_choice.is_correct and target_player.correct_answer_progress = 2 then
        next_progress := 0;
        next_captures := target_player.available_captures + 3;
    elsif target_choice.is_correct then
        next_progress := target_player.correct_answer_progress + 1;
        next_captures := target_player.available_captures;
    else
        next_progress := target_player.correct_answer_progress;
        next_captures := target_player.available_captures;
    end if;

    update public.claim_grid_players
    set correct_answer_progress = next_progress,
        available_captures = next_captures,
        current_question_position = next_position,
        total_answers = total_answers + 1, last_seen_at = now()
    where id = target_player.id;

    return jsonb_build_object(
        'choice_id', target_choice.id,
        'correct_choice_id', (select id from public.claim_grid_session_choices
            where question_id = target_question.id and is_correct = true),
        'is_correct', target_choice.is_correct,
        'correct_answer_progress', next_progress,
        'available_captures', next_captures,
        'next_question_position', next_position
    );
end;
$function$;

create or replace function public.claim_claim_grid_territory(
    input_player_id uuid, input_cell_id bigint
)
returns jsonb language plpgsql security definer set search_path = ''
as $function$
declare
    target_player public.claim_grid_players;
    target_session public.claim_grid_sessions;
    target_cell public.claim_grid_cells;
    changed_owner boolean := false;
    remaining_captures smallint;
    board_is_full boolean;
begin
    select * into target_player from public.claim_grid_players
    where id = input_player_id and user_id = auth.uid() for update;
    if not found then raise exception 'This player session is unavailable.'; end if;

    select * into target_session from public.claim_grid_sessions
    where id = target_player.session_id and status = 'active'
      and expires_at > now() and game_ends_at > now();
    if not found then raise exception 'This Claim the Grid game is not active.'; end if;
    if target_player.available_captures < 1 then
        raise exception 'Earn three correct answers before claiming territory.';
    end if;

    select * into target_cell from public.claim_grid_cells
    where id = input_cell_id and session_id = target_session.id for update;
    if not found then raise exception 'That territory is unavailable.'; end if;
    if target_cell.is_base then raise exception 'Team bases cannot be captured.'; end if;

    if target_cell.owner_team_number is distinct from target_player.team_number then
        if not exists (
            select 1 from public.claim_grid_cells as owned
            where owned.session_id = target_session.id
              and owned.owner_team_number = target_player.team_number
              and abs(owned.row_number - target_cell.row_number) <= 1
              and abs(owned.column_number - target_cell.column_number) <= 1
              and not (owned.row_number = target_cell.row_number
                       and owned.column_number = target_cell.column_number)
        ) then raise exception 'Choose a territory beside your team color.'; end if;

        update public.claim_grid_cells
        set owner_team_number = target_player.team_number,
            captured_at = now(), updated_at = now()
        where id = target_cell.id returning * into target_cell;
        changed_owner := true;
    end if;

    update public.claim_grid_players
    set available_captures = available_captures - 1, last_seen_at = now()
    where id = target_player.id
    returning available_captures into remaining_captures;

    select not exists (select 1 from public.claim_grid_cells
        where session_id = target_session.id and owner_team_number is null)
    into board_is_full;
    if board_is_full then
        update public.claim_grid_sessions
        set status = 'finished', ended_at = now(), updated_at = now()
        where id = target_session.id and status = 'active';
    end if;

    return jsonb_build_object(
        'cell', to_jsonb(target_cell), 'changed_owner', changed_owner,
        'available_captures', remaining_captures,
        'game_finished', board_is_full
    );
end;
$function$;

revoke all on function public.get_claim_grid_player_game(uuid) from public, anon;
revoke all on function public.submit_claim_grid_self_paced_answer(uuid, bigint) from public, anon;
revoke all on function public.claim_claim_grid_territory(uuid, bigint) from public, anon;
grant execute on function public.get_claim_grid_player_game(uuid) to authenticated;
grant execute on function public.submit_claim_grid_self_paced_answer(uuid, bigint) to authenticated;
grant execute on function public.claim_claim_grid_territory(uuid, bigint) to authenticated;

commit;

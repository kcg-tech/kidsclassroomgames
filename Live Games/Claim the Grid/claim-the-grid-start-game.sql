begin;

alter table public.claim_grid_sessions
    add column if not exists question_started_at timestamptz;

create or replace function public.start_claim_grid_session(
    input_session_id uuid
)
returns public.claim_grid_sessions
language plpgsql
security definer
set search_path = ''
as $function$
declare
    updated_session public.claim_grid_sessions;
begin
    if not exists (
        select 1
        from public.claim_grid_sessions
        where id = input_session_id
          and host_id = auth.uid()
          and status = 'lobby'
          and expires_at > now()
    ) then
        raise exception 'This Claim the Grid game could not be started.';
    end if;

    if not exists (
        select 1
        from public.claim_grid_players
        where session_id = input_session_id
    ) then
        raise exception 'At least one student must join before the game starts.';
    end if;

    update public.claim_grid_sessions
    set status = 'active',
        current_question_position = 1,
        question_started_at = now(),
        started_at = coalesce(started_at, now()),
        updated_at = now()
    where id = input_session_id
      and host_id = auth.uid()
      and status = 'lobby'
      and expires_at > now()
    returning * into updated_session;

    return updated_session;
end;
$function$;

create or replace function public.get_claim_grid_host_lobby(
    input_session_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
    target_session public.claim_grid_sessions;
    current_question jsonb;
    current_choices jsonb := '[]'::jsonb;
begin
    select * into target_session
    from public.claim_grid_sessions
    where id = input_session_id
      and host_id = auth.uid()
      and expires_at > now();

    if not found then
        raise exception 'This Claim the Grid room is unavailable.';
    end if;

    if target_session.current_question_position > 0 then
        select jsonb_build_object(
            'id', question.id,
            'position', question.position,
            'question_text', question.question_text,
            'question_item_id', question.question_item_id,
            'image_url', item.image_url
        )
        into current_question
        from public.claim_grid_session_questions as question
        left join public.items as item on item.id = question.question_item_id
        where question.session_id = target_session.id
          and question.position = target_session.current_question_position;

        select coalesce(jsonb_agg(jsonb_build_object(
            'id', choice.id,
            'position', choice.position,
            'answer_text', choice.answer_text,
            'answer_item_id', choice.answer_item_id,
            'image_url', item.image_url,
            'is_correct', choice.is_correct
        ) order by choice.position), '[]'::jsonb)
        into current_choices
        from public.claim_grid_session_choices as choice
        left join public.items as item on item.id = choice.answer_item_id
        where choice.question_id = (current_question ->> 'id')::bigint;
    end if;

    return jsonb_build_object(
        'session', to_jsonb(target_session),
        'teams', coalesce((
            select jsonb_agg(to_jsonb(team_row) order by team_row.team_number)
            from public.claim_grid_teams as team_row
            where team_row.session_id = target_session.id
        ), '[]'::jsonb),
        'players', coalesce((
            select jsonb_agg(to_jsonb(player_row) order by player_row.joined_at)
            from public.claim_grid_players as player_row
            where player_row.session_id = target_session.id
        ), '[]'::jsonb),
        'question', current_question,
        'choices', current_choices
    );
end;
$function$;

create or replace function public.get_claim_grid_player_lobby(
    input_player_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
    target_player public.claim_grid_players;
    target_session public.claim_grid_sessions;
    target_team public.claim_grid_teams;
    current_question jsonb;
    current_choices jsonb := '[]'::jsonb;
begin
    select * into target_player
    from public.claim_grid_players
    where id = input_player_id
      and user_id = auth.uid();

    if not found then
        raise exception 'This player session is unavailable.';
    end if;

    select * into target_session
    from public.claim_grid_sessions
    where id = target_player.session_id
      and expires_at > now();

    select * into target_team
    from public.claim_grid_teams
    where session_id = target_player.session_id
      and team_number = target_player.team_number;

    if target_session.current_question_position > 0 then
        select jsonb_build_object(
            'id', question.id,
            'position', question.position,
            'question_text', question.question_text,
            'question_item_id', question.question_item_id,
            'image_url', item.image_url
        )
        into current_question
        from public.claim_grid_session_questions as question
        left join public.items as item on item.id = question.question_item_id
        where question.session_id = target_session.id
          and question.position = target_session.current_question_position;

        select coalesce(jsonb_agg(jsonb_build_object(
            'id', choice.id,
            'position', choice.position,
            'answer_text', choice.answer_text,
            'answer_item_id', choice.answer_item_id,
            'image_url', item.image_url
        ) order by choice.position), '[]'::jsonb)
        into current_choices
        from public.claim_grid_session_choices as choice
        left join public.items as item on item.id = choice.answer_item_id
        where choice.question_id = (current_question ->> 'id')::bigint;
    end if;

    return jsonb_build_object(
        'player', to_jsonb(target_player),
        'session', to_jsonb(target_session),
        'team', to_jsonb(target_team),
        'question', current_question,
        'choices', current_choices
    );
end;
$function$;

revoke all on function public.start_claim_grid_session(uuid)
from public, anon;
grant execute on function public.start_claim_grid_session(uuid)
to authenticated;

commit;

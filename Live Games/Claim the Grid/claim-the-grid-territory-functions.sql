begin;

alter table public.claim_grid_sessions
    add column if not exists round_phase text not null default 'lobby',
    add column if not exists territory_started_at timestamptz;

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
        select 1 from public.claim_grid_sessions
        where id = input_session_id
          and host_id = auth.uid()
          and status = 'lobby'
          and expires_at > now()
    ) then
        raise exception 'This Claim the Grid game could not be started.';
    end if;

    if not exists (
        select 1 from public.claim_grid_players
        where session_id = input_session_id
    ) then
        raise exception 'At least one student must join before the game starts.';
    end if;

    update public.claim_grid_sessions
    set status = 'active',
        round_phase = 'question',
        current_question_position = 1,
        question_started_at = now(),
        territory_started_at = null,
        started_at = coalesce(started_at, now()),
        updated_at = now()
    where id = input_session_id
    returning * into updated_session;

    return updated_session;
end;
$function$;

create or replace function public.begin_claim_grid_territory_phase(
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
    update public.claim_grid_sessions
    set round_phase = 'territory',
        territory_started_at = now(),
        updated_at = now()
    where id = input_session_id
      and host_id = auth.uid()
      and status = 'active'
      and round_phase = 'question'
      and question_started_at is not null
      and now() >= question_started_at
          + make_interval(secs => question_timer)
    returning * into updated_session;

    if not found then
        raise exception 'The territory phase cannot begin yet.';
    end if;

    return updated_session;
end;
$function$;

create or replace function public.get_claim_grid_board(
    input_session_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
    target_session public.claim_grid_sessions;
    target_player public.claim_grid_players;
begin
    select * into target_session
    from public.claim_grid_sessions
    where id = input_session_id
      and expires_at > now();

    if not found then
        raise exception 'This Claim the Grid room is unavailable.';
    end if;

    if target_session.host_id <> auth.uid() then
        select * into target_player
        from public.claim_grid_players
        where session_id = target_session.id
          and user_id = auth.uid();

        if not found then
            raise exception 'You do not have access to this game board.';
        end if;
    end if;

    return jsonb_build_object(
        'session', to_jsonb(target_session),
        'teams', coalesce((
            select jsonb_agg(to_jsonb(team_row) order by team_row.team_number)
            from public.claim_grid_teams as team_row
            where team_row.session_id = target_session.id
        ), '[]'::jsonb),
        'cells', coalesce((
            select jsonb_agg(to_jsonb(cell_row) order by cell_row.row_number, cell_row.column_number)
            from public.claim_grid_cells as cell_row
            where cell_row.session_id = target_session.id
        ), '[]'::jsonb),
        'votes', case
            when target_player.id is null then '[]'::jsonb
            else coalesce((
                select jsonb_agg(vote.cell_id order by vote.priority)
                from public.claim_grid_claim_votes as vote
                join public.claim_grid_session_questions as question
                  on question.id = vote.question_id
                where vote.player_id = target_player.id
                  and question.position = target_session.current_question_position
            ), '[]'::jsonb)
        end
    );
end;
$function$;

create or replace function public.save_claim_grid_votes(
    input_player_id uuid,
    input_cell_ids bigint[]
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
    target_player public.claim_grid_players;
    target_session public.claim_grid_sessions;
    target_question public.claim_grid_session_questions;
    requested_cell_id bigint;
    requested_priority integer := 0;
begin
    if coalesce(cardinality(input_cell_ids), 0) > 3 then
        raise exception 'Choose no more than three territories.';
    end if;

    if (
        select count(*)
        from unnest(coalesce(input_cell_ids, array[]::bigint[])) as selected(cell_id)
    ) <> (
        select count(distinct cell_id)
        from unnest(coalesce(input_cell_ids, array[]::bigint[])) as selected(cell_id)
    ) then
        raise exception 'Choose each territory only once.';
    end if;

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
      and status = 'active'
      and round_phase = 'territory'
      and territory_started_at is not null
      and now() < territory_started_at + interval '10 seconds';

    if not found then
        raise exception 'Territory selection is not active.';
    end if;

    select * into target_question
    from public.claim_grid_session_questions
    where session_id = target_session.id
      and position = target_session.current_question_position;

    if not exists (
        select 1 from public.claim_grid_answers
        where question_id = target_question.id
          and player_id = target_player.id
          and is_correct = true
    ) then
        raise exception 'Only correct answers can select territory this round.';
    end if;

    foreach requested_cell_id in array coalesce(input_cell_ids, array[]::bigint[]) loop
        if not exists (
            select 1
            from public.claim_grid_cells as candidate
            where candidate.id = requested_cell_id
              and candidate.session_id = target_session.id
              and candidate.is_base = false
              and candidate.owner_team_number is distinct from target_player.team_number
              and exists (
                  select 1
                  from public.claim_grid_cells as owned
                  where owned.session_id = target_session.id
                    and owned.owner_team_number = target_player.team_number
                    and abs(owned.row_number - candidate.row_number) <= 1
                    and abs(owned.column_number - candidate.column_number) <= 1
                    and not (
                        owned.row_number = candidate.row_number
                        and owned.column_number = candidate.column_number
                    )
              )
        ) then
            raise exception 'One of those territories cannot be selected by your team.';
        end if;
    end loop;

    delete from public.claim_grid_claim_votes
    where question_id = target_question.id
      and player_id = target_player.id;

    foreach requested_cell_id in array coalesce(input_cell_ids, array[]::bigint[]) loop
        requested_priority := requested_priority + 1;
        insert into public.claim_grid_claim_votes (
            session_id, question_id, player_id, cell_id, priority
        ) values (
            target_session.id,
            target_question.id,
            target_player.id,
            requested_cell_id,
            requested_priority
        );
    end loop;

    return jsonb_build_object('cell_ids', coalesce(input_cell_ids, array[]::bigint[]));
end;
$function$;

revoke all on function public.begin_claim_grid_territory_phase(uuid) from public, anon;
revoke all on function public.get_claim_grid_board(uuid) from public, anon;
revoke all on function public.save_claim_grid_votes(uuid, bigint[]) from public, anon;

grant execute on function public.begin_claim_grid_territory_phase(uuid) to authenticated;
grant execute on function public.get_claim_grid_board(uuid) to authenticated;
grant execute on function public.save_claim_grid_votes(uuid, bigint[]) to authenticated;

commit;

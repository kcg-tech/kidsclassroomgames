begin;

create or replace function public.join_claim_grid_room(
    input_room_code text,
    input_display_name text
)
returns public.claim_grid_players
language plpgsql
security definer
set search_path = ''
as $function$
declare
    current_user_id uuid := auth.uid();
    clean_code text := upper(trim(input_room_code));
    clean_name text := trim(input_display_name);
    target_session public.claim_grid_sessions;
    existing_player public.claim_grid_players;
    selected_team smallint;
    joined_player public.claim_grid_players;
begin
    if current_user_id is null then
        raise exception 'A player session is required to join this room.';
    end if;
    if clean_name = '' or char_length(clean_name) > 15 then
        raise exception 'Enter a nickname of 1 to 15 characters.';
    end if;

    select * into target_session
    from public.claim_grid_sessions
    where room_code = clean_code
      and status in ('lobby', 'active')
      and expires_at > now();
    if not found then
        raise exception 'This Claim the Grid room is unavailable.';
    end if;

    select * into existing_player
    from public.claim_grid_players
    where session_id = target_session.id
      and user_id = current_user_id;
    if found then
        update public.claim_grid_players
        set is_connected = true, last_seen_at = now()
        where id = existing_player.id
        returning * into joined_player;
        return joined_player;
    end if;

    if target_session.status = 'active'
       and (target_session.game_ends_at is null
            or target_session.game_ends_at <= now() + interval '60 seconds') then
        raise exception 'This game is almost finished and is no longer accepting new players.';
    end if;
    if exists (
        select 1 from public.claim_grid_players
        where session_id = target_session.id
          and lower(trim(display_name)) = lower(clean_name)
    ) then
        raise exception 'That nickname is already being used in this room.';
    end if;
    if (select count(*) from public.claim_grid_players
        where session_id = target_session.id) >= 100 then
        raise exception 'This Claim the Grid room is full.';
    end if;

    select team.team_number into selected_team
    from public.claim_grid_teams as team
    left join public.claim_grid_players as player
      on player.session_id = team.session_id
     and player.team_number = team.team_number
    where team.session_id = target_session.id
    group by team.team_number
    order by count(player.id), random()
    limit 1;

    insert into public.claim_grid_players (
        session_id, user_id, team_number, display_name
    ) values (
        target_session.id, current_user_id, selected_team, clean_name
    ) returning * into joined_player;
    return joined_player;
end;
$function$;

create or replace function public.replay_claim_grid_session(input_session_id uuid)
returns public.claim_grid_sessions
language plpgsql
security definer
set search_path = ''
as $function$
declare
    source_session public.claim_grid_sessions;
    replay_questions jsonb;
    replayed_session public.claim_grid_sessions;
begin
    select * into source_session
    from public.claim_grid_sessions
    where id = input_session_id
      and host_id = auth.uid()
      and status = 'finished';
    if not found then
        raise exception 'Only the host can replay a finished game.';
    end if;

    select jsonb_agg(
        jsonb_build_object(
            'question_text', question.question_text,
            'question_item_id', question.question_item_id,
            'choices', (
                select jsonb_agg(
                    jsonb_build_object(
                        'answer_text', choice.answer_text,
                        'answer_item_id', choice.answer_item_id,
                        'is_correct', choice.is_correct
                    ) order by choice.position
                )
                from public.claim_grid_session_choices as choice
                where choice.question_id = question.id
            )
        ) order by question.position
    ) into replay_questions
    from public.claim_grid_session_questions as question
    where question.session_id = source_session.id;

    select public.create_claim_grid_session(
        source_session.name,
        source_session.team_count,
        source_session.game_duration_minutes,
        source_session.team_colors,
        replay_questions,
        source_session.source_set_id
    ) into replayed_session;
    return replayed_session;
end;
$function$;

revoke all on function public.join_claim_grid_room(text, text) from public, anon;
grant execute on function public.join_claim_grid_room(text, text) to anon, authenticated;
revoke all on function public.replay_claim_grid_session(uuid) from public, anon;
grant execute on function public.replay_claim_grid_session(uuid) to authenticated;

commit;

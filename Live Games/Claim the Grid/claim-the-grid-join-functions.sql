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

    select *
    into target_session
    from public.claim_grid_sessions
    where room_code = clean_code
      and status = 'lobby'
      and expires_at > now();

    if not found then
        raise exception 'This Claim the Grid room is unavailable.';
    end if;

    select *
    into existing_player
    from public.claim_grid_players
    where session_id = target_session.id
      and user_id = current_user_id;

    if found then
        update public.claim_grid_players
        set is_connected = true,
            last_seen_at = now()
        where id = existing_player.id
        returning * into joined_player;

        return joined_player;
    end if;

    if exists (
        select 1
        from public.claim_grid_players
        where session_id = target_session.id
          and lower(trim(display_name)) = lower(clean_name)
    ) then
        raise exception 'That nickname is already being used in this room.';
    end if;

    if (
        select count(*)
        from public.claim_grid_players
        where session_id = target_session.id
    ) >= 100 then
        raise exception 'This Claim the Grid room is full.';
    end if;

    select team.team_number
    into selected_team
    from public.claim_grid_teams as team
    left join public.claim_grid_players as player
      on player.session_id = team.session_id
     and player.team_number = team.team_number
    where team.session_id = target_session.id
    group by team.team_number
    order by count(player.id), random()
    limit 1;

    insert into public.claim_grid_players (
        session_id,
        user_id,
        team_number,
        display_name
    ) values (
        target_session.id,
        current_user_id,
        selected_team,
        clean_name
    )
    returning * into joined_player;

    return joined_player;
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
begin
    select *
    into target_player
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

    return jsonb_build_object(
        'player', to_jsonb(target_player),
        'session', to_jsonb(target_session),
        'team', to_jsonb(target_team)
    );
end;
$function$;

revoke all on function public.join_claim_grid_room(text, text)
from public;
revoke all on function public.get_claim_grid_player_lobby(uuid)
from public;

grant execute on function public.join_claim_grid_room(text, text)
to authenticated;
grant execute on function public.get_claim_grid_player_lobby(uuid)
to authenticated;

commit;

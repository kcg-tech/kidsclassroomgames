begin;

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
begin
    select *
    into target_session
    from public.claim_grid_sessions
    where id = input_session_id
      and host_id = auth.uid()
      and expires_at > now();

    if not found then
        raise exception 'This Claim the Grid room is unavailable.';
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
        ), '[]'::jsonb)
    );
end;
$function$;

revoke all on function public.get_claim_grid_host_lobby(uuid)
from public, anon;

grant execute on function public.get_claim_grid_host_lobby(uuid)
to authenticated;

commit;

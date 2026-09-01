begin;

create or replace function public.finish_claim_grid_session(
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
    set status = 'finished',
        ended_at = coalesce(ended_at, now()),
        updated_at = now()
    where id = input_session_id
      and host_id = auth.uid()
      and status in ('lobby', 'active')
      and expires_at > now()
    returning * into updated_session;

    if not found then
        raise exception 'This Claim the Grid game could not be ended.';
    end if;

    return updated_session;
end;
$function$;

revoke all on function public.finish_claim_grid_session(uuid)
from public, anon;

grant execute on function public.finish_claim_grid_session(uuid)
to authenticated;

commit;

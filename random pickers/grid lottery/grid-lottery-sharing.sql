begin;

alter table public.grid_lottery_sets
    add column if not exists is_public boolean not null default false,
    add column if not exists slug text;

create unique index if not exists grid_lottery_sets_slug_key
on public.grid_lottery_sets (slug)
where slug is not null;

drop policy if exists "Public can read shared Grid Lottery sets"
on public.grid_lottery_sets;

create policy "Public can read shared Grid Lottery sets"
on public.grid_lottery_sets
for select
to anon, authenticated
using (active = true and is_public = true and slug is not null);

drop policy if exists "Public can read shared Grid Lottery set items"
on public.grid_lottery_set_items;

create policy "Public can read shared Grid Lottery set items"
on public.grid_lottery_set_items
for select
to anon, authenticated
using (
    exists (
        select 1
        from public.grid_lottery_sets
        where grid_lottery_sets.id = grid_lottery_set_items.set_id
          and grid_lottery_sets.active = true
          and grid_lottery_sets.is_public = true
          and grid_lottery_sets.slug is not null
    )
);

create or replace function public.enable_grid_lottery_set_sharing(
    input_set_id bigint
)
returns text
language plpgsql
security definer
set search_path = ''
as $function$
declare
    shared_slug text;
begin
    update public.grid_lottery_sets
    set
        is_public = true,
        slug = coalesce(
            slug,
            replace(gen_random_uuid()::text, '-', '')
        ),
        updated_at = now()
    where id = input_set_id
      and owner_id = auth.uid()
      and active = true
    returning slug into shared_slug;

    if shared_slug is null then
        raise exception 'This Grid Lottery Set could not be shared.';
    end if;

    return shared_slug;
end;
$function$;

revoke all on function public.enable_grid_lottery_set_sharing(bigint)
from public;

grant execute on function public.enable_grid_lottery_set_sharing(bigint)
to authenticated;

grant select on public.grid_lottery_sets
to anon, authenticated;

grant select on public.grid_lottery_set_items
to anon, authenticated;

commit;

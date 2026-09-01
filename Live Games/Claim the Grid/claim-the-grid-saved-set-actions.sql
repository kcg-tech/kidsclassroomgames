begin;

create or replace function public.update_claim_grid_set(
    input_set_id bigint,
    input_name text,
    input_team_count smallint,
    input_question_timer smallint,
    input_team_colors text[],
    input_questions jsonb
)
returns public.claim_grid_sets
language plpgsql
security definer
set search_path = ''
as $function$
declare
    original_set public.claim_grid_sets;
    temporary_set public.claim_grid_sets;
    updated_set public.claim_grid_sets;
begin
    select *
    into original_set
    from public.claim_grid_sets
    where id = input_set_id
      and owner_id = auth.uid()
      and active = true
    for update;

    if not found then
        raise exception 'This Claim the Grid Set could not be edited.';
    end if;

    update public.claim_grid_sets
    set active = false,
        updated_at = now()
    where id = original_set.id;

    temporary_set := public.save_claim_grid_set(
        input_name,
        input_team_count,
        input_question_timer,
        input_team_colors,
        input_questions
    );

    delete from public.claim_grid_questions
    where set_id = original_set.id;

    update public.claim_grid_questions
    set set_id = original_set.id,
        updated_at = now()
    where set_id = temporary_set.id;

    update public.claim_grid_sets
    set active = false,
        updated_at = now()
    where id = temporary_set.id;

    update public.claim_grid_sets
    set name = temporary_set.name,
        team_count = temporary_set.team_count,
        game_duration_minutes = temporary_set.game_duration_minutes,
        team_colors = temporary_set.team_colors,
        active = true,
        updated_at = now()
    where id = original_set.id
    returning * into updated_set;

    delete from public.claim_grid_sets
    where id = temporary_set.id;

    return updated_set;
end;
$function$;

create or replace function public.delete_claim_grid_set(
    input_set_id bigint
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $function$
declare
    deleted_id bigint;
begin
    delete from public.claim_grid_sets
    where id = input_set_id
      and owner_id = auth.uid()
    returning id into deleted_id;

    if deleted_id is null then
        raise exception 'This Claim the Grid Set could not be deleted.';
    end if;

    return deleted_id;
end;
$function$;

create or replace function public.enable_claim_grid_set_sharing(
    input_set_id bigint
)
returns text
language plpgsql
security definer
set search_path = ''
as $function$
declare
    generated_slug text;
begin
    generated_slug := lower(substr(md5(
        input_set_id::text || ':' || auth.uid()::text || ':' ||
        clock_timestamp()::text || ':' || random()::text
    ), 1, 20));

    update public.claim_grid_sets
    set is_public = true,
        share_slug = coalesce(share_slug, generated_slug),
        updated_at = now()
    where id = input_set_id
      and owner_id = auth.uid()
      and active = true
    returning share_slug into generated_slug;

    if generated_slug is null then
        raise exception 'This Claim the Grid Set could not be shared.';
    end if;

    return generated_slug;
end;
$function$;

drop policy if exists
    "Public can read shared Claim the Grid sets"
on public.claim_grid_sets;
create policy
    "Public can read shared Claim the Grid sets"
on public.claim_grid_sets
for select
to anon, authenticated
using (active = true and is_public = true and share_slug is not null);

drop policy if exists
    "Public can read shared Claim the Grid questions"
on public.claim_grid_questions;
create policy
    "Public can read shared Claim the Grid questions"
on public.claim_grid_questions
for select
to anon, authenticated
using (
    exists (
        select 1
        from public.claim_grid_sets
        where claim_grid_sets.id = claim_grid_questions.set_id
          and claim_grid_sets.active = true
          and claim_grid_sets.is_public = true
          and claim_grid_sets.share_slug is not null
    )
);

drop policy if exists
    "Public can read shared Claim the Grid choices"
on public.claim_grid_choices;
create policy
    "Public can read shared Claim the Grid choices"
on public.claim_grid_choices
for select
to anon, authenticated
using (
    exists (
        select 1
        from public.claim_grid_questions
        join public.claim_grid_sets
          on claim_grid_sets.id = claim_grid_questions.set_id
        where claim_grid_questions.id = claim_grid_choices.question_id
          and claim_grid_sets.active = true
          and claim_grid_sets.is_public = true
          and claim_grid_sets.share_slug is not null
    )
);

grant select on public.claim_grid_sets to anon;
grant select on public.claim_grid_questions to anon;
grant select on public.claim_grid_choices to anon;

revoke all on function public.update_claim_grid_set(
    bigint, text, smallint, smallint, text[], jsonb
) from public, anon;
revoke all on function public.delete_claim_grid_set(bigint) from public, anon;
revoke all on function public.enable_claim_grid_set_sharing(bigint) from public, anon;

grant execute on function public.update_claim_grid_set(
    bigint, text, smallint, smallint, text[], jsonb
) to authenticated;
grant execute on function public.delete_claim_grid_set(bigint) to authenticated;
grant execute on function public.enable_claim_grid_set_sharing(bigint) to authenticated;

commit;

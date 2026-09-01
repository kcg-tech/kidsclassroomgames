begin;

-- Replace the old per-question timer with one total game duration.
alter table public.claim_grid_sets
    add column if not exists game_duration_minutes smallint;

update public.claim_grid_sets
set game_duration_minutes = 10
where game_duration_minutes is null;

alter table public.claim_grid_sets
    alter column game_duration_minutes set default 10,
    alter column game_duration_minutes set not null;

alter table public.claim_grid_sets
    drop constraint if exists claim_grid_sets_game_duration_minutes_check;

alter table public.claim_grid_sets
    add constraint claim_grid_sets_game_duration_minutes_check
    check (game_duration_minutes in (3, 5, 7, 10, 15));

alter table public.claim_grid_sessions
    add column if not exists game_duration_minutes smallint;

update public.claim_grid_sessions
set game_duration_minutes = 10
where game_duration_minutes is null;

alter table public.claim_grid_sessions
    alter column game_duration_minutes set default 10,
    alter column game_duration_minutes set not null;

alter table public.claim_grid_sessions
    drop constraint if exists claim_grid_sessions_game_duration_minutes_check;

alter table public.claim_grid_sessions
    add constraint claim_grid_sessions_game_duration_minutes_check
    check (game_duration_minutes in (3, 5, 7, 10, 15));

-- The old columns remain temporarily so existing active test rooms can finish.
-- They will be removed after the self-paced functions replace the old round logic.
alter table public.claim_grid_sets
    alter column question_timer set default 30;

alter table public.claim_grid_sessions
    alter column question_timer set default 30;

commit;

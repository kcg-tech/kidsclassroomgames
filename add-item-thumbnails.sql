alter table public.items
    add column if not exists thumbnail_url text,
    add column if not exists thumbnail_path text;

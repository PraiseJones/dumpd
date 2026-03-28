-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Profiles (extends auth.users) ───────────────────────────────────
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- ─── Monthly Dumps ────────────────────────────────────────────────────
create table public.monthly_dumps (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete set null,
  session_id text,
  month_year text not null,
  answers jsonb not null default '{}'::jsonb,
  theme text not null default 'noir' check (theme in ('noir', 'neon', 'vintage')),
  generated_card_url text,
  card_square_url text,
  card_title text,
  narrative text,
  share_count integer not null default 0,
  is_public boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index monthly_dumps_user_id_idx on public.monthly_dumps(user_id);
create index monthly_dumps_session_id_idx on public.monthly_dumps(session_id);
create index monthly_dumps_created_at_idx on public.monthly_dumps(created_at desc);
create index monthly_dumps_month_year_idx on public.monthly_dumps(month_year);

-- ─── Card Templates ───────────────────────────────────────────────────
create table public.card_templates (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  theme text not null,
  config jsonb not null default '{}'::jsonb,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ─── Share Events ─────────────────────────────────────────────────────
create table public.share_events (
  id uuid default uuid_generate_v4() primary key,
  dump_id uuid references public.monthly_dumps(id) on delete cascade,
  platform text not null,
  created_at timestamptz default now()
);

create index share_events_dump_id_idx on public.share_events(dump_id);

-- ─── RLS Policies ─────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.monthly_dumps enable row level security;
alter table public.share_events enable row level security;

-- Profiles
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Monthly dumps: public dumps readable by all
create policy "dumps_select_public" on public.monthly_dumps
  for select using (is_public = true or auth.uid() = user_id);
create policy "dumps_insert_any" on public.monthly_dumps
  for insert with check (auth.uid() = user_id or user_id is null);
create policy "dumps_update_own" on public.monthly_dumps
  for update using (auth.uid() = user_id);
create policy "dumps_delete_own" on public.monthly_dumps
  for delete using (auth.uid() = user_id);

-- Share events: open insert (logged by API), restricted read
create policy "share_events_insert" on public.share_events
  for insert with check (true);
create policy "share_events_select_own" on public.share_events
  for select using (
    exists (
      select 1 from public.monthly_dumps d
      where d.id = dump_id and d.user_id = auth.uid()
    )
  );

-- ─── Updated At Trigger ───────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger monthly_dumps_updated_at
  before update on public.monthly_dumps
  for each row execute procedure public.set_updated_at();

-- ─── Auto-create profile on signup ───────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Storage Bucket (run via Supabase CLI or dashboard) ───────────────
-- insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- values ('cards', 'cards', true, 5242880, array['image/png', 'image/jpeg']);

-- Storage RLS
-- create policy "cards_public_read" on storage.objects
--   for select using (bucket_id = 'cards');
-- create policy "cards_service_insert" on storage.objects
--   for insert with check (bucket_id = 'cards');

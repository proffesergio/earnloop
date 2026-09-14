-- EarnLoop — minimal Supabase Postgres schema (free-tier friendly)
-- Run in the Supabase SQL editor. Enable pgcrypto if needed for gen_random_uuid().

create extension if not exists "pgcrypto";

create type public.user_role as enum ('user', 'admin');
create type public.content_status as enum ('draft', 'review', 'published');
create type public.content_type as enum ('hustle', 'guide', 'news');
create type public.order_status as enum ('new', 'quoted', 'in_progress', 'delivered', 'closed', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  role public.user_role not null default 'user',
  credits integer not null default 0,
  xp integer not null default 0,
  streak_days integer not null default 0,
  last_xp_at timestamptz,
  loop_plus_until timestamptz,
  created_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.hustles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  content_type public.content_type not null default 'hustle',
  status public.content_status not null default 'draft',
  title text not null,
  summary text not null,
  payload jsonb not null,
  featured boolean not null default false,
  published_at timestamptz,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index hustles_status_published_idx on public.hustles (status, published_at desc);
create index hustles_payload_gin on public.hustles using gin (payload);

create table public.tools (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  credit_cost integer not null default 1,
  input_schema jsonb not null,
  enabled boolean not null default true
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  starting_price_display text,
  intake_schema jsonb not null,
  enabled boolean not null default true
);

create table public.service_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  service_id uuid not null references public.services (id),
  status public.order_status not null default 'new',
  brief jsonb not null,
  admin_notes text,
  payment_url text,
  created_at timestamptz not null default now()
);

create table public.hustle_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  hustle_id uuid not null references public.hustles (id) on delete cascade,
  completed_steps integer[] not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (user_id, hustle_id)
);

create table public.proofs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  hustle_id uuid references public.hustles (id) on delete set null,
  title text not null,
  proof_url text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  tool_slug text not null,
  input_hash text not null,
  input jsonb not null,
  output jsonb not null,
  model text not null,
  created_at timestamptz not null default now()
);

create unique index generations_tool_hash_idx on public.generations (tool_slug, input_hash);

create table public.page_views (
  path text not null,
  day date not null default (timezone('utc', now()))::date,
  count integer not null default 0,
  primary key (path, day)
);

create table public.rate_limits (
  key text primary key,
  window_start timestamptz not null,
  count integer not null default 0
);

create table public.admin_audit (
  id uuid primary key default gen_random_uuid(),
  actor uuid references public.profiles (id),
  action text not null,
  entity text not null,
  entity_id text,
  created_at timestamptz not null default now()
);

create table public.ai_jobs (
  id uuid primary key default gen_random_uuid(),
  actor uuid references public.profiles (id),
  kind text not null,
  model text not null,
  ok boolean not null,
  error text,
  created_at timestamptz not null default now()
);

-- Credits: single-statement debit
create or replace function public.spend_credits(p_amount integer, p_reason text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  remaining integer;
begin
  if p_amount <= 0 then
    raise exception 'amount must be positive';
  end if;
  update public.profiles
    set credits = credits - p_amount
    where id = auth.uid() and credits >= p_amount
    returning credits into remaining;
  if remaining is null then
    raise exception 'insufficient credits';
  end if;
  return remaining;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  welcome integer := 25;
begin
  insert into public.profiles (id, email, display_name, avatar_url, credits)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    welcome
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.hustles enable row level security;
alter table public.tools enable row level security;
alter table public.services enable row level security;
alter table public.service_orders enable row level security;
alter table public.hustle_progress enable row level security;
alter table public.proofs enable row level security;
alter table public.generations enable row level security;
alter table public.page_views enable row level security;
alter table public.site_settings enable row level security;
alter table public.admin_audit enable row level security;
alter table public.ai_jobs enable row level security;

create policy "public read published hustles"
  on public.hustles for select
  using (status = 'published' or public.is_admin());

create policy "public read enabled tools"
  on public.tools for select using (enabled = true or public.is_admin());

create policy "public read enabled services"
  on public.services for select using (enabled = true or public.is_admin());

create policy "read own profile"
  on public.profiles for select using (id = auth.uid() or public.is_admin());

create policy "update own profile names"
  on public.profiles for update using (id = auth.uid())
  with check (id = auth.uid());

create policy "own progress"
  on public.hustle_progress for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "own proofs"
  on public.proofs for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "own orders"
  on public.service_orders for select using (user_id = auth.uid() or public.is_admin());

create policy "insert own orders"
  on public.service_orders for insert with check (user_id = auth.uid());

create policy "read public settings"
  on public.site_settings for select using (true);

-- Admin writes: use service role in server actions after checking profiles.role.
-- Do not grant blanket authenticated insert on hustles.

-- Initial schema for profiles, registrations, enrollments

-- PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Useful indexes
create index if not exists idx_profiles_created_at on public.profiles (created_at desc);
create index if not exists idx_profiles_email on public.profiles (lower(email));
create index if not exists idx_profiles_full_name on public.profiles (lower(full_name));

alter table public.profiles enable row level security;

-- Policies: allow authenticated users to read all profiles; restrict writes to owner
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Authenticated users can read profiles'
  ) then
    create policy "Authenticated users can read profiles"
      on public.profiles for select
      to authenticated
      using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can insert their own profile'
  ) then
    create policy "Users can insert their own profile"
      on public.profiles for insert
      to authenticated
      with check (auth.uid() = id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can update own profile'
  ) then
    create policy "Users can update own profile"
      on public.profiles for update
      to authenticated
      using (auth.uid() = id)
      with check (auth.uid() = id);
  end if;
end $$;

-- updated_at trigger
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.handle_updated_at();

-- Auto-create a profile when a user is created in auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();


-- REGISTRATIONS (stores marketing/lead intent; inserted via server/admin)
create table if not exists public.registrations (
  id bigserial primary key,
  name text not null,
  email text not null,
  phone text not null,
  track text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_registrations_created_at on public.registrations (created_at desc);
alter table public.registrations enable row level security;
-- No public policies; service role bypasses RLS


-- ENROLLMENTS (lifecycle of a user's enrollment/payment)
create table if not exists public.enrollments (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  track text not null,
  plan_id text,
  payment_status text not null check (payment_status in ('pending','paid')),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_enrollments_user_id on public.enrollments (user_id);
create index if not exists idx_enrollments_created_at on public.enrollments (created_at desc);
alter table public.enrollments enable row level security;

-- Policies: users can read and create their own enrollments; updates reserved for server/service role
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'enrollments' and policyname = 'Users can read own enrollments'
  ) then
    create policy "Users can read own enrollments"
      on public.enrollments for select
      to authenticated
      using (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'enrollments' and policyname = 'Users can insert own enrollments'
  ) then
    create policy "Users can insert own enrollments"
      on public.enrollments for insert
      to authenticated
      with check (auth.uid() = user_id);
  end if;
end $$;


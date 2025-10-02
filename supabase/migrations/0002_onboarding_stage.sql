-- Add onboarding_stage to profiles to track user onboarding lifecycle
-- Values: 'new' (default), 'registered', 'payment_pending', 'active'

alter table if exists public.profiles
  add column if not exists onboarding_stage text not null default 'new' check (onboarding_stage in ('new','registered','payment_pending','active'));

-- Helpful index for stage-based queries
create index if not exists idx_profiles_onboarding_stage on public.profiles (onboarding_stage);


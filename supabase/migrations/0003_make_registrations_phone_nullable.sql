-- Make registrations.phone nullable for existing databases
alter table if exists public.registrations
  alter column phone drop not null;
-- Roles structure for AI Restaurant Dashboard
-- Defines application roles without affecting existing n8n tables.

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  role text not null default 'restaurant_admin',
  created_at timestamptz default now(),
  constraint profiles_role_check check (role in ('master', 'restaurant_admin'))
);

alter table profiles enable row level security;

create policy "users can view own profile"
on profiles
for select
using (user_id = auth.uid());

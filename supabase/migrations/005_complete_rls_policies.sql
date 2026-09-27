-- Complete RLS policies
-- Final security layer for SaaS multi-tenant access

-- Profiles: master can manage, users can see own profile
create policy "master can view all profiles"
on profiles
for select
using (
  exists (
    select 1 from profiles p
    where p.user_id = auth.uid()
    and p.role = 'master'
  )
);

-- Restaurants
alter table restaurants enable row level security;

create policy "restaurant admins access own restaurant"
on restaurants
for all
using (
  id in (
    select restaurant_id from restaurant_users where user_id = auth.uid()
  )
);

create policy "masters access all restaurants"
on restaurants
for all
using (
  exists (
    select 1 from profiles p
    where p.user_id = auth.uid()
    and p.role = 'master'
  )
);

-- Future n8n generated data tables
alter table if exists restaurant_metrics enable row level security;
alter table if exists integration_events enable row level security;

create policy "tenant metrics access"
on restaurant_metrics
for all
using (
  restaurant_id in (
    select restaurant_id from restaurant_users where user_id = auth.uid()
  )
);

create policy "tenant integration events access"
on integration_events
for all
using (
  restaurant_id in (
    select restaurant_id from restaurant_users where user_id = auth.uid()
  )
);

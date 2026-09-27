-- Master and restaurant admin RLS policies
-- Extends role separation without changing n8n tables.

-- Helper concept:
-- profiles.role = master allows global administration.
-- restaurant_admin remains limited by restaurant_id.

create policy "masters can view all profiles"
on profiles
for select
using (
  exists (
    select 1 from profiles p
    where p.user_id = auth.uid()
    and p.role = 'master'
  )
);

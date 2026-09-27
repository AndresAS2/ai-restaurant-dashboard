-- Business tables RLS policies
-- Keeps tenant isolation without changing n8n data structure.

alter table if exists orders enable row level security;
alter table if exists customers enable row level security;
alter table if exists conversations enable row level security;
alter table if exists menu_products enable row level security;
alter table if exists menu_categories enable row level security;

create policy "restaurant admins access own orders"
on orders
for all
using (
  restaurant_id in (
    select restaurant_id from restaurant_users
    where user_id = auth.uid()
  )
)
with check (
  restaurant_id in (
    select restaurant_id from restaurant_users
    where user_id = auth.uid()
  )
);

create policy "restaurant admins access own customers"
on customers
for all
using (
  restaurant_id in (
    select restaurant_id from restaurant_users
    where user_id = auth.uid()
  )
)
with check (
  restaurant_id in (
    select restaurant_id from restaurant_users
    where user_id = auth.uid()
  )
);

create policy "restaurant admins access own conversations"
on conversations
for all
using (
  restaurant_id in (
    select restaurant_id from restaurant_users
    where user_id = auth.uid()
  )
)
with check (
  restaurant_id in (
    select restaurant_id from restaurant_users
    where user_id = auth.uid()
  )
);

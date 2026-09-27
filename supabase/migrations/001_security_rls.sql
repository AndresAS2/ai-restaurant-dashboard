-- Security baseline for AI Restaurant Dashboard
-- Review and execute in Supabase SQL editor after validating existing schema.

-- Enable RLS on tenant tables
alter table if exists restaurants enable row level security;
alter table if exists restaurant_users enable row level security;
alter table if exists menu_categories enable row level security;
alter table if exists menu_products enable row level security;
alter table if exists customers enable row level security;
alter table if exists conversations enable row level security;
alter table if exists orders enable row level security;

-- Helper pattern:
-- auth.uid() -> restaurant_users -> restaurant_id

-- Policies must be adapted if master role is stored differently.

create policy "users can view assigned restaurants"
on restaurants
for select
using (
  id in (
    select restaurant_id from restaurant_users
    where user_id = auth.uid()
  )
);

create policy "users can view own restaurant relation"
on restaurant_users
for select
using (user_id = auth.uid());

create policy "users access own menu categories"
on menu_categories
for all
using (
  restaurant_id in (select restaurant_id from restaurant_users where user_id = auth.uid())
)
with check (
  restaurant_id in (select restaurant_id from restaurant_users where user_id = auth.uid())
);

create policy "users access own menu products"
on menu_products
for all
using (
  restaurant_id in (select restaurant_id from restaurant_users where user_id = auth.uid())
)
with check (
  restaurant_id in (select restaurant_id from restaurant_users where user_id = auth.uid())
);

create policy "users access own customers"
on customers
for all
using (
  restaurant_id in (select restaurant_id from restaurant_users where user_id = auth.uid())
)
with check (
  restaurant_id in (select restaurant_id from restaurant_users where user_id = auth.uid())
);

create policy "users access own conversations"
on conversations
for all
using (
  restaurant_id in (select restaurant_id from restaurant_users where user_id = auth.uid())
)
with check (
  restaurant_id in (select restaurant_id from restaurant_users where user_id = auth.uid())
);

create policy "users access own orders"
on orders
for all
using (
  restaurant_id in (select restaurant_id from restaurant_users where user_id = auth.uid())
)
with check (
  restaurant_id in (select restaurant_id from restaurant_users where user_id = auth.uid())
);

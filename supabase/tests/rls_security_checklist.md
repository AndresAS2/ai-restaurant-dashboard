# RLS Security Verification Checklist

## Multi tenant isolation

- [ ] Restaurant admin A can only read restaurant A data
- [ ] Restaurant admin A cannot read restaurant B data
- [ ] Restaurant admin A cannot insert data with another restaurant_id
- [ ] Restaurant admin A cannot update another restaurant data

## Master access

- [ ] Master can view all restaurants
- [ ] Master can manage restaurant accounts
- [ ] Master permissions do not expose anonymous access

## Protected tables

- [ ] restaurants
- [ ] restaurant_users
- [ ] menu_categories
- [ ] menu_products
- [ ] customers
- [ ] conversations
- [ ] orders
- [ ] restaurant_metrics
- [ ] integration_events

## Before production

- Apply migrations in Supabase
- Test with two real tenant accounts
- Confirm n8n service role access remains working

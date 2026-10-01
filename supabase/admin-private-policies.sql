create policy no_direct_client_access on private.ai_execution_usage for all to authenticated using(false) with check(false);
create policy no_direct_client_access on private.restaurant_monthly_finance for all to authenticated using(false) with check(false);

create table private.ai_execution_usage (
 workflow_id text not null, execution_id text not null, restaurant_id text references public.restaurants(id),
 started_at timestamptz not null, finished_at timestamptz, status text not null, is_test boolean not null,
 input_tokens bigint check(input_tokens>=0), output_tokens bigint check(output_tokens>=0), total_tokens bigint check(total_tokens>=0),
 measurement text not null check(measurement in ('provider','no_ai','estimated','unavailable')),
 agent_runs integer not null default 0, duration_ms bigint check(duration_ms>=0),
 synced_at timestamptz not null default now(), primary key(workflow_id,execution_id)
);
alter table private.ai_execution_usage enable row level security;
revoke all on private.ai_execution_usage from public, anon, authenticated;
create index on private.ai_execution_usage(restaurant_id,started_at);
create table private.restaurant_monthly_finance (
 restaurant_id text references public.restaurants(id) not null, month date not null check(month=date_trunc('month',month)::date),
 plan_name text, plan_price_cop numeric check(plan_price_cop>=0), ai_cost_usd numeric check(ai_cost_usd>=0),
 other_cost_usd numeric check(other_cost_usd>=0), usd_cop numeric check(usd_cop>0),
 source_note text, updated_at timestamptz not null default now(), primary key(restaurant_id,month)
);
alter table private.restaurant_monthly_finance enable row level security;
revoke all on private.restaurant_monthly_finance from public,anon,authenticated;
create or replace function private.require_owner() returns void
language plpgsql stable security definer set search_path='' as $$
begin
 if auth.uid() is null or not exists(select 1 from auth.users where id=auth.uid() and lower(email)='suarezjulian2227@gmail.com' and email_confirmed_at is not null)
 then raise exception 'Acceso exclusivo del propietario' using errcode='42501'; end if;
end $$;
revoke all on function private.require_owner() from public,anon;
grant execute on function private.require_owner() to authenticated;

create or replace function private.save_owner_finance(p_restaurant text,p_month date,p_values jsonb)
returns void language plpgsql security definer set search_path='' as $$
begin
 perform private.require_owner();
 if p_month is null or p_month<>date_trunc('month',p_month)::date or p_month<date '2020-01-01' or p_month>date '2100-01-01'
 or p_values is null or jsonb_typeof(p_values)<>'object' or length(p_values::text)>10000 then
 raise exception 'Datos inválidos' using errcode='22023'; end if;
 insert into private.restaurant_monthly_finance(restaurant_id,month,plan_name,plan_price_cop,ai_cost_usd,other_cost_usd,usd_cop,source_note)
 values(p_restaurant,p_month,nullif(p_values->>'plan_name',''),nullif(p_values->>'plan_price_cop','')::numeric,
 nullif(p_values->>'ai_cost_usd','')::numeric,nullif(p_values->>'other_cost_usd','')::numeric,
 nullif(p_values->>'usd_cop','')::numeric,nullif(p_values->>'source_note',''))
 on conflict(restaurant_id,month) do update set plan_name=excluded.plan_name,plan_price_cop=excluded.plan_price_cop,
 ai_cost_usd=excluded.ai_cost_usd,other_cost_usd=excluded.other_cost_usd,usd_cop=excluded.usd_cop,
 source_note=excluded.source_note,updated_at=now();
end $$;
revoke all on function private.save_owner_finance(text,date,jsonb) from public,anon;
grant execute on function private.save_owner_finance(text,date,jsonb) to authenticated;
create or replace function public.save_owner_finance(p_restaurant text,p_month date,p_values jsonb)
returns void language sql security invoker set search_path='' as $$ select private.save_owner_finance(p_restaurant,p_month,p_values); $$;
revoke all on function public.save_owner_finance(text,date,jsonb) from public,anon;
grant execute on function public.save_owner_finance(text,date,jsonb) to authenticated;

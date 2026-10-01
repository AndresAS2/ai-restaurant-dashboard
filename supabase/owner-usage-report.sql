create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.owner_usage_report(p_month date)
returns jsonb
language plpgsql stable security definer
set search_path = ''
as $$
declare
 v_start timestamptz;
 v_end timestamptz;
 v_rows jsonb;
begin
 if auth.uid() is null or not exists (
   select 1 from auth.users u where u.id=auth.uid()
   and lower(u.email)='suarezjulian2227@gmail.com'
   and u.email_confirmed_at is not null
 ) then
   raise exception 'Acceso exclusivo del propietario' using errcode='42501';
 end if;
 if p_month is null or p_month <> date_trunc('month',p_month)::date
    or p_month < date '2020-01-01' or p_month > date '2100-01-01' then
   raise exception 'Mes inválido' using errcode='22023';
 end if;
 v_start := p_month::timestamp at time zone 'America/Bogota';
 v_end := (p_month + interval '1 month')::timestamp at time zone 'America/Bogota';
 select coalesce(jsonb_agg(jsonb_build_object(
  'restaurant_id',r.id,'restaurant_name',r.name,'status',r.status,
  'messages',coalesce(m.messages,0),'test_messages',coalesce(m.tests,0),
  'tokens_used',null,'ai_cost_usd',null,'storage_mb',null,
  'total_cost_usd',null,'plan_name',null,'plan_price_cop',null,'margin_percent',null
 ) order by r.name,r.id),'[]'::jsonb) into v_rows
 from public.restaurants r
 left join (
   select restaurant_id,count(*) as messages,
   count(*) filter (where metadata->>'is_test'='true') as tests
   from public.conversation_history
   where created_at>=v_start and created_at<v_end
   group by restaurant_id
 ) m on m.restaurant_id=r.id;
 return jsonb_build_object('month',p_month,'timezone','America/Bogota','restaurants',v_rows);
end;
$$;
revoke all on function private.owner_usage_report(date) from public,anon;
grant execute on function private.owner_usage_report(date) to authenticated;

create or replace function public.owner_usage_report(p_month date)
returns jsonb language sql stable security invoker set search_path=''
as $$ select private.owner_usage_report(p_month); $$;
revoke all on function public.owner_usage_report(date) from public,anon;
grant execute on function public.owner_usage_report(date) to authenticated;

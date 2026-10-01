alter table private.restaurant_monthly_finance add column services jsonb not null default '[]'::jsonb,
 add column input_rate_usd numeric check(input_rate_usd>=0), add column output_rate_usd numeric check(output_rate_usd>=0);
create or replace function private.save_owner_finance(p_restaurant text,p_month date,p_values jsonb)
returns void language plpgsql security definer set search_path='' as $$
declare k text; item jsonb;
begin
 perform private.require_owner();
 if p_month is null or p_month<>date_trunc('month',p_month)::date or p_month<date '2020-01-01' or p_month>date '2100-01-01'
 or p_values is null or jsonb_typeof(p_values)<>'object' or length(p_values::text)>20000 then raise exception 'Datos inválidos' using errcode='22023'; end if;
 foreach k in array array['plan_price_cop','usd_cop','input_rate_usd','output_rate_usd'] loop
 if coalesce(p_values->>k,'')<>'' and (p_values->>k !~ '^([0-9]{1,12})([.][0-9]{1,8})?$') then raise exception 'Importe inválido: %',k using errcode='22023'; end if;
 end loop;
 if jsonb_typeof(p_values->'services') is distinct from 'array' or jsonb_array_length(p_values->'services')>30 then raise exception 'Servicios inválidos' using errcode='22023'; end if;
 for item in select value from jsonb_array_elements(p_values->'services') loop
 if jsonb_typeof(item)<>'object' or length(trim(coalesce(item->>'name','')))=0 or length(item->>'name')>100
 or coalesce(item->>'currency','') not in ('USD','COP')
 or coalesce(item->>'amount','') !~ '^([0-9]{1,12})([.][0-9]{1,8})?$'
 then raise exception 'Servicio inválido' using errcode='22023'; end if;
 end loop;
 insert into private.restaurant_monthly_finance(restaurant_id,month,plan_name,plan_price_cop,usd_cop,source_note,services,input_rate_usd,output_rate_usd)
 values(p_restaurant,p_month,left(nullif(p_values->>'plan_name',''),100),nullif(p_values->>'plan_price_cop','')::numeric,
 nullif(p_values->>'usd_cop','')::numeric,left(p_values->>'source_note',2000),p_values->'services',
 nullif(p_values->>'input_rate_usd','')::numeric,nullif(p_values->>'output_rate_usd','')::numeric)
 on conflict(restaurant_id,month) do update set plan_name=excluded.plan_name,plan_price_cop=excluded.plan_price_cop,
 usd_cop=excluded.usd_cop,source_note=excluded.source_note,services=excluded.services,
 input_rate_usd=excluded.input_rate_usd,output_rate_usd=excluded.output_rate_usd,updated_at=now();
end $$;
create or replace function private.owner_usage_report(p_month date)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare v_start timestamptz; v_end timestamptz; v_rows jsonb;
begin
 perform private.require_owner();
 if p_month is null or p_month<>date_trunc('month',p_month)::date or p_month<date '2020-01-01' or p_month>date '2100-01-01' then raise exception 'Mes inválido' using errcode='22023'; end if;
 v_start:=p_month::timestamp at time zone 'America/Bogota';
 v_end:=(p_month+interval '1 month')::timestamp at time zone 'America/Bogota';
 with m as (
 select restaurant_id,count(*) messages,count(*) filter(where metadata->>'is_test'='true') tests
 from public.conversation_history where created_at>=v_start and created_at<v_end group by restaurant_id
 ), u as (
 select restaurant_id,count(*) executions,count(*) filter(where measurement in ('provider','no_ai')) measured,
 count(*) filter(where measurement not in ('provider','no_ai')) unmeasured,
 sum(input_tokens) filter(where measurement in ('provider','no_ai')) input_tokens,
 sum(output_tokens) filter(where measurement in ('provider','no_ai')) output_tokens,
 sum(total_tokens) filter(where measurement in ('provider','no_ai')) tokens,
 max(synced_at) last_synced_at
 from private.ai_execution_usage where started_at>=v_start and started_at<v_end group by restaurant_id
 ), sizes as (
 select restaurant_id,sum(bytes) bytes from (
 select restaurant_id,pg_column_size(t)::bigint bytes from public.conversation_history t
 union all select restaurant_id,pg_column_size(t)::bigint from public.customers t
 union all select restaurant_id,pg_column_size(t)::bigint from public.customer_events t
 union all select restaurant_id,pg_column_size(t)::bigint from public.orders t
 union all select restaurant_id,pg_column_size(t)::bigint from public.order_items t
 union all select restaurant_id,pg_column_size(t)::bigint from public.menu_products t
 union all select restaurant_id,pg_column_size(t)::bigint from public.menu_categories t
 union all select restaurant_id,pg_column_size(t)::bigint from public.restaurant_settings t
 union all select restaurant_id,pg_column_size(t)::bigint from public.waiter_order_drafts t
 ) s group by restaurant_id
 )
 select coalesce(jsonb_agg(jsonb_build_object('restaurant_id',r.id,'restaurant_name',r.name,'status',r.status,
 'messages',coalesce(m.messages,0),'test_messages',coalesce(m.tests,0),
 'tokens_used',u.tokens,'input_tokens',u.input_tokens,'output_tokens',u.output_tokens,
 'executions',coalesce(u.executions,0),'measured_executions',coalesce(u.measured,0),'unmeasured_executions',coalesce(u.unmeasured,0),
 'last_synced_at',u.last_synced_at,'db_bytes',coalesce(s.bytes,0),
 'storage_mb',case when not exists(select 1 from storage.objects) then 0 else null end,
 'finance',case when f.restaurant_id is not null then to_jsonb(f)-'restaurant_id'-'month' else null end
 ) order by r.name,r.id),'[]') into v_rows from public.restaurants r
 left join m on m.restaurant_id=r.id left join u on u.restaurant_id=r.id left join sizes s on s.restaurant_id=r.id
 left join private.restaurant_monthly_finance f on f.restaurant_id=r.id and f.month=p_month;
 return jsonb_build_object('month',p_month,'timezone','America/Bogota','restaurants',v_rows,
 'unattributed_executions',(select count(*) from private.ai_execution_usage where restaurant_id is null and started_at>=v_start and started_at<v_end));
end $$;

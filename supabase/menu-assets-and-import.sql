alter table public.menu_products add column if not exists ingredients text[] not null default '{}';
alter table public.menu_products add column if not exists sort_order integer not null default 0;
alter table public.menu_categories add column if not exists sort_order integer not null default 0;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('restaurant-assets','restaurant-assets',true,6291456,array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict(id) do nothing;
create policy restaurant_assets_read on storage.objects for select to authenticated using(bucket_id='restaurant-assets' and public.user_has_restaurant_access((storage.foldername(name))[1]));
create policy restaurant_assets_insert on storage.objects for insert to authenticated with check(bucket_id='restaurant-assets' and public.user_has_restaurant_access((storage.foldername(name))[1]));
create policy restaurant_assets_delete on storage.objects for delete to authenticated using(bucket_id='restaurant-assets' and public.user_has_restaurant_access((storage.foldername(name))[1]));
create or replace function public.import_reviewed_menu(p_restaurant_id text,p_products jsonb) returns integer
language plpgsql security invoker set search_path=public,pg_temp as $$
declare item jsonb; category_key text; category_name text; n integer:=0;
begin
 if not public.user_has_restaurant_access(p_restaurant_id) then raise exception 'Sin acceso al restaurante'; end if;
 if jsonb_typeof(p_products)<>'array' or jsonb_array_length(p_products)<1 or jsonb_array_length(p_products)>100 then raise exception 'Revisa entre 1 y 100 productos'; end if;
 perform pg_advisory_xact_lock(hashtextextended(p_restaurant_id,0));
 if (select count(*) from public.menu_products where restaurant_id=p_restaurant_id and id in (select v->>'id' from jsonb_array_elements(p_products)v))=jsonb_array_length(p_products) then return jsonb_array_length(p_products); end if;
 for item in select value from jsonb_array_elements(p_products) loop
 if coalesce(length(trim(item->>'name')),0) not between 1 and 150 or (item->>'price') is null or (item->>'price')::numeric<0 or (item->>'price')::numeric>100000000 or coalesce(length(item->>'description'),0)>2000 or coalesce(length(item->>'id'),0) not between 1 and 100 then raise exception 'Producto inválido'; end if;
 if jsonb_typeof(item->'ingredients')<>'array' or jsonb_array_length(item->'ingredients')>100 then raise exception 'Ingredientes inválidos'; end if;
 if exists(select 1 from public.menu_products where restaurant_id=p_restaurant_id and lower(trim(name))=lower(trim(item->>'name'))) then raise exception 'Ya existe un producto llamado %. Edita el existente o cambia el nombre.',item->>'name'; end if;
 category_name:=trim(coalesce(item->>'category','')); category_key:=null;
 if length(category_name)>100 then raise exception 'Categoría demasiado larga'; end if;
 if category_name<>'' then
 select id into category_key from public.menu_categories where restaurant_id=p_restaurant_id and lower(trim(name))=lower(category_name) order by id limit 1;
 if category_key is null then category_key:=gen_random_uuid()::text; insert into public.menu_categories(id,restaurant_id,name,active) values(category_key,p_restaurant_id,category_name,true); end if;
 end if;
 insert into public.menu_products(id,restaurant_id,name,description,price,available,category_id,ingredients,sort_order)
 values(item->>'id',p_restaurant_id,trim(item->>'name'),coalesce(item->>'description',''),(item->>'price')::numeric,coalesce((item->>'available')::boolean,true),category_key,array(select jsonb_array_elements_text(item->'ingredients')),n);
 n:=n+1;
 end loop;
 return n;
end; $$;
revoke all on function public.import_reviewed_menu(text,jsonb) from public,anon;
grant execute on function public.import_reviewed_menu(text,jsonb) to authenticated;

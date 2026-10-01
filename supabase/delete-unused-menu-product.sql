create or replace function public.delete_unused_menu_product(p_restaurant_id text,p_product_id text) returns void
language plpgsql security invoker set search_path=public,pg_temp as $$
begin
 if not public.user_has_restaurant_access(p_restaurant_id) then raise exception 'Sin acceso al restaurante'; end if;
 perform 1 from public.menu_products where restaurant_id=p_restaurant_id and id=p_product_id for update;
 if not found then raise exception 'Producto no encontrado'; end if;
 if exists(select 1 from public.order_items where restaurant_id=p_restaurant_id and product_id=p_product_id) then raise exception 'Este producto tiene historial de pedidos. Desactívalo para conservarlo.'; end if;
 delete from public.menu_products where restaurant_id=p_restaurant_id and id=p_product_id;
end; $$;
revoke all on function public.delete_unused_menu_product(text,text) from public,anon;
grant execute on function public.delete_unused_menu_product(text,text) to authenticated;

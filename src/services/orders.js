import {rows,saved} from './data';
import {supabase} from './supabase';
import {isTest} from './format';
export const getOrders=id=>rows('orders',id,'*,customers(name,phone),order_items(id,quantity,price,product_id,menu_products(name))').then(a=>a.sort((x,y)=>String(y.created_at||'').localeCompare(String(x.created_at||''))));
export function updateOrderStatus(id,order,status){
 if(isTest(order))throw new Error('Los pedidos de prueba no cambian a estados operativos.');
 if(!['CONFIRMED','PREPARING','READY','DELIVERED','CANCELLED'].includes(status))throw new Error('Estado inválido.');
 return saved(supabase.from('orders').update({status}).eq('restaurant_id',id).eq('id',order.id).eq('status',order.status));
}

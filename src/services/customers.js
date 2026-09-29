import {rows,saved} from './data';
import {supabase} from './supabase';
import {isTest} from './format';
export async function getCustomers(id){
 const [customers,orders,history]=await Promise.all([rows('customers',id),rows('orders',id),rows('conversation_history',id)]);
 return customers.map(c=>{
 const own=orders.filter(o=>o.customer_id===c.id).sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at)));
 const real=own.filter(o=>!isTest(o)),purchases=real.filter(o=>String(o.status).toUpperCase()==='DELIVERED');
 const last=history.filter(h=>h.customer_id===c.id).map(h=>h.created_at).filter(Boolean).sort().at(-1);
 return {...c,orders:own,order_count:real.length,purchase_count:purchases.length,last_interaction:last,spent:purchases.reduce((s,o)=>s+Number(o.total),0)};
 });
}
export function saveCustomer(id,c){if(!c.name?.trim())throw new Error('Escribe el nombre del cliente.');return saved(supabase.from('customers').update({name:c.name.trim()}).eq('restaurant_id',id).eq('id',c.id));}

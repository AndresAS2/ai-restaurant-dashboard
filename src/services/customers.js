import {rows,saved} from './data';
import {supabase} from './supabase';
import {isTest} from './format';
export async function getCustomers(id){
 const [customers,orders]=await Promise.all([rows('customers',id),rows('orders',id)]);
 return customers.map(c=>{const own=orders.filter(o=>o.customer_id===c.id&&!isTest(o));return {...c,order_count:own.length,spent:own.filter(o=>String(o.status).toUpperCase()==='DELIVERED').reduce((s,o)=>s+Number(o.total),0)};});
}
export function saveCustomer(id,c){if(!c.name?.trim())throw new Error('Escribe el nombre del cliente.');return saved(supabase.from('customers').update({name:c.name.trim()}).eq('restaurant_id',id).eq('id',c.id));}

import {rows,saved} from './data';
import {supabase} from './supabase';
import {isTest} from './format';
import {customerActivity} from './customerIdentity';
export async function getCustomers(id){
 const [customers,orders,history]=await Promise.all([rows('customers',id),rows('orders',id),rows('conversation_history',id)]);
 return customerActivity(customers,orders,history,isTest);
}
export function saveCustomer(id,c){if(!c.name?.trim())throw new Error('Escribe el nombre del cliente.');return saved(supabase.from('customers').update({name:c.name.trim()}).eq('restaurant_id',id).eq('id',c.id));}

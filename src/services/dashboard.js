import { supabase } from './supabase';

export async function getDashboardMetrics(restaurantId){
 const [orders,customers,conversations]=await Promise.all([
  supabase.from('orders').select('id',{count:'exact'}).eq('restaurant_id',restaurantId),
  supabase.from('customers').select('id',{count:'exact'}).eq('restaurant_id',restaurantId),
  supabase.from('conversations').select('id',{count:'exact'}).eq('restaurant_id',restaurantId)
 ]);

 return {
  orders: orders.count || 0,
  customers: customers.count || 0,
  conversations: conversations.count || 0
 };
}

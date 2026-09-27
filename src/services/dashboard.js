import { supabase } from './supabase';

export async function getDashboardMetrics(restaurantId) {
  if (!restaurantId) {
    return { orders: 0, customers: 0, conversations: 0 };
  }

  const [orders, customers, conversations] = await Promise.all([
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('restaurant_id', restaurantId),
    supabase.from('customers').select('id', { count: 'exact', head: true }).eq('restaurant_id', restaurantId),
    supabase.from('conversation_history').select('id', { count: 'exact', head: true }).eq('restaurant_id', restaurantId),
  ]);

  return {
    orders: orders.count || 0,
    customers: customers.count || 0,
    conversations: conversations.count || 0,
  };
}

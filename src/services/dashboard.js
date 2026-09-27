import { supabase } from './supabase';

export async function getDashboardMetrics(restaurantId) {
  if (!restaurantId) {
    return {
      orders: 0,
      customers: 0,
      conversations: 0,
      sales_today: 0,
      ai_interactions: 0,
    };
  }

  const [orders, customers, conversations, events] = await Promise.all([
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('restaurant_id', restaurantId),
    supabase.from('customers').select('id', { count: 'exact', head: true }).eq('restaurant_id', restaurantId),
    supabase.from('conversation_history').select('id', { count: 'exact', head: true }).eq('restaurant_id', restaurantId),
    supabase
      .from('dashboard_events')
      .select('event_type,total')
      .eq('restaurant_id', restaurantId)
      .limit(100),
  ]);

  const workflowEvents = events.data || [];

  return {
    orders: orders.count || 0,
    customers: customers.count || 0,
    conversations: conversations.count || 0,
    sales_today: workflowEvents.reduce((sum, item) => sum + Number(item.total || 0), 0),
    ai_interactions: workflowEvents.filter((item) => item.event_type === 'customer_interaction').length,
  };
}

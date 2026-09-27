import { supabase } from './supabase';

export async function getN8NAnalytics(restaurantId) {
  if (!restaurantId) {
    return null;
  }

  const { data, error } = await supabase
    .from('dashboard_events')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    throw error;
  }

  return data || [];
}

export function mapWorkflowMetrics(events = []) {
  return {
    sales_today: events.reduce((sum, item) => sum + Number(item.total || 0), 0),
    orders: events.filter((item) => item.event_type === 'order').length,
    conversations: events.filter((item) => item.event_type === 'customer_interaction').length,
    customers: new Set(events.map((item) => item.customer_id).filter(Boolean)).size,
  };
}

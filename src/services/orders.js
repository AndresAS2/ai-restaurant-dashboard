import { supabase } from './supabase';

export async function getOrders(restaurantId) {
  if (!restaurantId) return [];

  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      total,
      created_at,
      customers(name, phone)
    `)
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data || [];
}

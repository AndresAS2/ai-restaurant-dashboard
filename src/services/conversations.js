import { supabase } from './supabase';

export async function getConversations(restaurantId) {
  if (!restaurantId) return [];

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data || [];
}

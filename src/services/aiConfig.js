import { supabase } from './supabase';

export async function getAIConfig(restaurantId) {
  if (!restaurantId) return null;

  const { data, error } = await supabase
    .from('restaurant_settings')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

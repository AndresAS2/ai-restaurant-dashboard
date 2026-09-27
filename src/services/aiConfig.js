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

export async function saveAIConfig(restaurantId, config) {
  if (!restaurantId) throw new Error('restaurant_id required');

  const payload = {
    restaurant_id: restaurantId,
    ...config,
  };

  const { data, error } = await supabase
    .from('restaurant_settings')
    .upsert(payload, { onConflict: 'restaurant_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

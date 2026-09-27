import { supabase } from './supabase';

/**
 * Layer prepared for future n8n integration.
 * The dashboard does not modify the n8n workflow directly.
 * It only prepares configuration payloads per restaurant.
 */
export async function getRestaurantAIContext(restaurantId) {
  if (!restaurantId) return null;

  const { data, error } = await supabase
    .from('restaurant_settings')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .maybeSingle();

  if (error) throw error;

  return {
    restaurant_id: restaurantId,
    settings: data || {},
  };
}

export async function sendAIConfigurationPreview(payload) {
  return {
    success: true,
    payload,
    status: 'ready_for_n8n_webhook',
  };
}

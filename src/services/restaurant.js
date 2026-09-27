import { supabase } from './supabase';

export async function getRestaurantByUser(userId) {
  const { data, error } = await supabase
    .from('restaurant_users')
    .select('restaurant_id, restaurants(*)')
    .eq('user_id', userId)
    .single();

  if (error) throw error;

  return data?.restaurants || null;
}

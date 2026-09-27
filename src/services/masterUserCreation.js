import { supabase } from '../lib/supabase';

/**
 * Creates a request payload for the secure Edge Function.
 * User creation must happen server-side because it requires Supabase Admin privileges.
 */
export async function createRestaurantUser(payload) {
  const { email, password, restaurant_id } = payload;

  if (!email || !password || !restaurant_id) {
    throw new Error('Email, password and restaurant are required');
  }

  const { data, error } = await supabase.functions.invoke(
    'create-restaurant-user',
    {
      body: {
        email,
        password,
        restaurant_id,
      },
    }
  );

  if (error) throw error;

  return data;
}

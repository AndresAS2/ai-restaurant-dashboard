import { supabase } from './supabase';

export async function createRestaurant(data) {
  const { data: restaurant, error } = await supabase
    .from('restaurants')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return restaurant;
}

export async function updateRestaurantStatus(id, status) {
  const { data, error } = await supabase
    .from('restaurants')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

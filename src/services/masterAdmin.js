import { supabase } from './supabase';

export async function getRestaurants(){
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('created_at', { ascending: false });

  if(error) throw error;
  return data || [];
}

export async function createRestaurant(payload){
  const { data, error } = await supabase
    .from('restaurants')
    .insert(payload)
    .select()
    .single();

  if(error) throw error;
  return data;
}

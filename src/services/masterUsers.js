import { supabase } from './supabase';

export async function getRestaurantUsers(restaurantId){
 const { data, error } = await supabase
  .from('restaurant_users')
  .select('*')
  .eq('restaurant_id', restaurantId);

 if(error) throw error;
 return data;
}

export async function assignUserToRestaurant(payload){
 const { data, error } = await supabase
  .from('restaurant_users')
  .insert(payload)
  .select();

 if(error) throw error;
 return data;
}

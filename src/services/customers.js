import { supabase } from './supabase';

export async function getCustomers(restaurantId){
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false });

  if(error) throw error;
  return data || [];
}

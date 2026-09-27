import { supabase } from './supabase';

export async function getMenu(restaurantId) {
  const { data: categories, error: categoryError } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: true });

  if (categoryError) throw categoryError;

  const { data: products, error: productError } = await supabase
    .from('menu_products')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: true });

  if (productError) throw productError;

  return { categories: categories || [], products: products || [] };
}

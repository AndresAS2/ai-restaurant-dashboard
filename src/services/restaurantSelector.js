import { supabase } from './supabase';

/**
 * Obtiene los restaurantes visibles para el usuario autenticado.
 * RLS limita la consulta al tenant permitido.
 */
export async function getAvailableRestaurants() {
  const { data, error } = await supabase
    .from('restaurants')
    .select('id, name, status')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data || [];
}

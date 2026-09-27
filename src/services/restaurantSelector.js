import { supabase } from '../lib/supabase';

/**
 * Obtiene restaurantes disponibles para el panel maestro.
 * Solo lectura: no modifica estructuras existentes.
 */
export async function getAvailableRestaurants() {
  const { data, error } = await supabase
    .from('restaurants')
    .select('id, name, status')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data || [];
}

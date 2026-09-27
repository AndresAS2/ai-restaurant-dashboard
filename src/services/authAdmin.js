import { supabase } from './supabase';

// Administración de usuarios SaaS.
// Preparado para conectar con Supabase Auth mediante backend seguro.
// No crea usuarios desde el frontend para evitar exponer privilegios administrativos.

export async function getUserRestaurantAccess(userId) {
  const { data, error } = await supabase
    .from('restaurant_users')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function createRestaurantUserRequest(payload) {
  return {
    email: payload.email,
    restaurant_id: payload.restaurant_id,
    status: 'pending'
  };
}

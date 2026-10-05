import { supabase } from './supabase';

export async function signUpRestaurant({ restaurantName, email, password }) {
  const cleanName = String(restaurantName || '').trim();
  const cleanEmail = String(email || '').trim().toLowerCase();

  if (!cleanName || !cleanEmail || !password) {
    throw new Error('Nombre del restaurante, correo y contraseña son obligatorios');
  }

  if (password.length < 8) {
    throw new Error('La contraseña debe tener al menos 8 caracteres');
  }

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: {
        registration_type: 'restaurant',
        restaurant_name: cleanName,
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function getMyRegistrationRequest(userId) {
  if (!userId) return null;

  const { data, error } = await supabase
    .from('restaurant_registration_requests')
    .select('id, email, restaurant_name, status, restaurant_id, created_at, reviewed_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

export async function getRegistrationRequests() {
  const { data, error } = await supabase
    .from('restaurant_registration_requests')
    .select('id, user_id, email, restaurant_name, status, restaurant_id, created_at, reviewed_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function reviewRegistration(requestId, action) {
  const { data, error } = await supabase.functions.invoke(
    'review-restaurant-registration',
    {
      body: {
        request_id: requestId,
        action,
      },
    }
  );

  if (error) throw new Error(error.message || 'No se pudo revisar la solicitud');

  if (data?.error) {
    const messages = {
      MASTER_ADMIN_REQUIRED: 'Solo el administrador maestro puede aprobar restaurantes.',
      REQUEST_NOT_FOUND: 'La solicitud ya no existe.',
      REQUEST_ALREADY_REVIEWED: 'Esta solicitud ya fue revisada.',
      USER_ALREADY_HAS_RESTAURANT: 'Este usuario ya tiene un restaurante asociado.',
    };

    throw new Error(messages[data.error] || data.error);
  }

  return data;
}

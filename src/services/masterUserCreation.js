import { supabase } from './supabase';

/**
 * Crea el usuario desde una Edge Function segura y lo asocia al mismo
 * restaurante del usuario autenticado. Nunca expone privilegios admin
 * en el navegador.
 */
export async function createRestaurantUser(payload) {
  const email = String(payload?.email || '').trim().toLowerCase();
  const password = String(payload?.password || '');
  const restaurantId = String(
    payload?.restaurant_id || payload?.restaurantId || ''
  ).trim();

  if (!email || !restaurantId) {
    throw new Error('Correo y restaurante son obligatorios');
  }

  if (password && password.length < 8) {
    throw new Error('La contraseña temporal debe tener al menos 8 caracteres');
  }

  const { data, error } = await supabase.functions.invoke(
    'create-restaurant-user',
    {
      body: {
        email,
        password,
        restaurant_id: restaurantId,
      },
    }
  );

  if (error) {
    throw new Error(error.message || 'No se pudo crear el acceso');
  }

  if (data?.error) {
    const messages = {
      UNAUTHORIZED: 'Tu sesión no es válida. Vuelve a iniciar sesión.',
      CALLER_HAS_NO_RESTAURANT_ACCESS: 'Tu cuenta todavía no tiene un restaurante asociado.',
      CROSS_TENANT_USER_ASSIGNMENT_BLOCKED: 'No puedes agregar usuarios a otro restaurante.',
      USER_ALREADY_ASSIGNED_TO_ANOTHER_RESTAURANT: 'Ese usuario ya pertenece a otro restaurante.',
      PASSWORD_MIN_8: 'La contraseña temporal debe tener al menos 8 caracteres.',
    };
    throw new Error(messages[data.error] || data.error);
  }

  return data;
}

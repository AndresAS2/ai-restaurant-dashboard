import { supabase } from './supabase';

export async function createRestaurantTenant(payload) {
  const restaurantName = String(payload?.restaurantName || '').trim();
  const email = String(payload?.email || '').trim().toLowerCase();
  const password = String(payload?.password || '');
  const whatsappNumber = String(payload?.whatsappNumber || '').trim();
  const whatsappPhoneNumberId = String(payload?.whatsappPhoneNumberId || '').trim();

  if (!email || !password) {
    throw new Error('Correo y contraseña temporal son obligatorios');
  }

  if (password.length < 8) {
    throw new Error('La contraseña temporal debe tener al menos 8 caracteres');
  }

  const { data, error } = await supabase.functions.invoke(
    'create-restaurant-tenant',
    {
      body: {
        restaurant_name: restaurantName || null,
        email,
        password,
        whatsapp_number: whatsappNumber || null,
        whatsapp_phone_number_id: whatsappPhoneNumberId || null,
      },
    }
  );

  if (error) {
    throw new Error(error.message || 'No se pudo crear el restaurante');
  }

  if (data?.error) {
    const messages = {
      UNAUTHORIZED: 'Tu sesión no es válida. Vuelve a iniciar sesión.',
      MASTER_ADMIN_REQUIRED: 'Solo el administrador maestro puede crear restaurantes.',
      EMAIL_AND_PASSWORD_REQUIRED: 'Correo y contraseña temporal son obligatorios.',
      PASSWORD_MIN_8: 'La contraseña temporal debe tener al menos 8 caracteres.',
      EMAIL_ALREADY_EXISTS: 'Ese correo ya está registrado. Usa otro correo para el nuevo restaurante.',
    };
    throw new Error(messages[data.error] || data.error);
  }

  return data;
}

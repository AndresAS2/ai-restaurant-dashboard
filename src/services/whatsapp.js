const WHATSAPP_WEBHOOK_URL = import.meta.env.VITE_WHATSAPP_WEBHOOK_URL;

export function buildIncomingWhatsAppMessage(data) {
  return {
    restaurant_id: data.restaurant_id,
    customer_phone: data.customer_phone,
    message: data.message,
    source: 'whatsapp',
    timestamp: new Date().toISOString(),
  };
}

export async function sendWhatsAppEvent(payload) {
  if (!WHATSAPP_WEBHOOK_URL) {
    throw new Error('WhatsApp webhook no configurado');
  }

  const response = await fetch(WHATSAPP_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Error enviando evento WhatsApp');
  }

  return await response.json();
}

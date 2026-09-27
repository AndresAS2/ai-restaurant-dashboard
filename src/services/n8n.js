const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

export async function sendToN8N(payload) {
  if (!N8N_WEBHOOK_URL) {
    throw new Error('N8N webhook no configurado');
  }

  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Error comunicando con n8n');
  }

  const data = await response.json();

  return {
    message:
      data?.message ||
      data?.output ||
      data?.response ||
      'Respuesta recibida del asistente.',
    raw: data,
  };
}

export async function sendAIConfigurationPreview(payload) {
  return {
    success: true,
    payload,
    status: 'ready_for_n8n_webhook',
  };
}

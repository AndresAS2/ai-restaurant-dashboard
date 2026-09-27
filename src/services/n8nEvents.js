const N8N_EVENTS_URL = import.meta.env.VITE_N8N_EVENTS_URL;

export function buildN8NEvent(event, data = {}) {
  return {
    event,
    source: 'ai-restaurant-dashboard',
    timestamp: new Date().toISOString(),
    ...data,
  };
}

export async function sendN8NEvent(event, data = {}) {
  if (!N8N_EVENTS_URL) {
    throw new Error('N8N events webhook no configurado');
  }

  const response = await fetch(N8N_EVENTS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buildN8NEvent(event, data)),
  });

  if (!response.ok) {
    throw new Error('No fue posible enviar evento a n8n');
  }

  return response.json();
}

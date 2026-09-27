const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

export function getIntegrationStatus() {
  return {
    n8n: {
      configured: Boolean(N8N_WEBHOOK_URL),
      status: N8N_WEBHOOK_URL ? 'configured' : 'pending'
    },
    source: 'ai-restaurant-dashboard'
  };
}

export function buildIntegrationEvent(event, restaurantId, data = {}) {
  return {
    event,
    restaurant_id: restaurantId,
    data,
    source: 'ai-restaurant-dashboard',
    timestamp: new Date().toISOString()
  };
}

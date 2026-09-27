export function normalizeWorkflowDashboard(events = []) {
  const orders = events.filter((item) => item.event_type === 'order');
  const conversations = events.filter(
    (item) => item.event_type === 'customer_interaction'
  );

  return {
    kpis: {
      totalOrders: orders.length,
      totalConversations: conversations.length,
      totalCustomers: new Set(
        events.map((item) => item.customer_id).filter(Boolean)
      ).size,
      totalSales: orders.reduce(
        (sum, item) => sum + Number(item.total || 0),
        0
      ),
    },
    orders,
    conversations,
    raw: events,
  };
}

export function validateWorkflowPayload(payload = {}) {
  return Boolean(payload.restaurant_id);
}

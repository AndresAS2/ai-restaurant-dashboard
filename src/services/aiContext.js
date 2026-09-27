import { getAIConfig } from './aiConfig';
import { getMenu } from './menu';

export async function getRestaurantAIContext(restaurantId) {
  if (!restaurantId) return null;

  const [config, menu] = await Promise.all([
    getAIConfig(restaurantId),
    getMenu(restaurantId)
  ]);

  return {
    restaurant_id: restaurantId,
    assistant: config || {},
    menu: menu || { categories: [], products: [] }
  };
}

export function buildN8NPayload(context, message) {
  return {
    restaurant_id: context.restaurant_id,
    message,
    context: context
  };
}

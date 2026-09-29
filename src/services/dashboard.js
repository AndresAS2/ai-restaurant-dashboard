import {rows} from './data';
import {summarize} from './metrics';
import {getAIConfig} from './aiConfig';
export async function getDashboardMetrics(id){
 const [orders,customers,history,settings]=await Promise.all([rows('orders',id),rows('customers',id),rows('conversation_history',id),getAIConfig(id)]);
 return {...summarize(orders,customers,history),profile:settings?.config?.restaurant_profile||{}};
}

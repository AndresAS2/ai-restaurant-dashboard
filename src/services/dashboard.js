import {rows} from './data';
import {summarize} from './metrics';
export async function getDashboardMetrics(id){const data=await Promise.all([rows('orders',id),rows('customers',id),rows('conversation_history',id)]);return summarize(...data);}

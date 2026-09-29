import {rows} from './data';
export async function getConversations(id){
 const [messages,customers]=await Promise.all([rows('conversation_history',id),rows('customers',id)]);
 const byId=new Map(customers.map(c=>[c.id,c]));
 return messages.map(m=>({...m,customer:byId.get(m.customer_id)})).sort((a,b)=>a.created_at.localeCompare(b.created_at)||a.id.localeCompare(b.id));
}

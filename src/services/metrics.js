import {isTest,normalizeStatus} from './format.js';
const day=v=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(v));
export function summarize(orders=[],customers=[],history=[],now=new Date()){
 const real=orders.filter(o=>!isTest(o));
 return {orders:real.length,testOrders:orders.length-real.length,customers:customers.length,messages:history.length,conversations:new Set(history.map(h=>h.customer_id).filter(Boolean)).size,
 sales_today:real.filter(o=>String(o.status).toUpperCase()==='DELIVERED'&&o.created_at&&day(o.created_at)===day(now)).reduce((s,o)=>s+Number(o.total||0),0),
 active:real.filter(o=>['PENDING','CONFIRMED','PREPARING','READY'].includes(normalizeStatus(o.status))).length,
 lastMessage:history.map(h=>h.created_at).filter(Boolean).sort().at(-1)};
}

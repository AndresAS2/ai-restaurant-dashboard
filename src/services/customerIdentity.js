export function normalizedPhone(value){
 const raw=String(value||'').trim();
 if(!/^\+?[\d\s()-]+$/.test(raw))return '';
 const digits=raw.replace(/\D/g,'');
 return digits.length>=7&&digits.length<=15?digits:'';
}
export function customerIdentity(customer){
 const raw=String(customer?.name||'').trim();
 const generic=!raw||/^(cliente|chat_unknown|unknown|sin nombre)$/i.test(raw);
 const phone=normalizedPhone(customer?.phone);
 return {display_name:generic?(phone?'Contacto '+phone.slice(-4):'Sesión sin identificar'):raw,display_phone:phone?String(customer.phone):null,reference:String(customer?.id||'').slice(-8),unidentified:generic};
}
export function customerActivity(customers,orders,history,isTest){
 const ordersByCustomer=new Map(),lastByCustomer=new Map(),phoneCounts=new Map();
 for(const order of orders){const list=ordersByCustomer.get(order.customer_id)||[];list.push(order);ordersByCustomer.set(order.customer_id,list);}
 for(const message of history){if(message.created_at&&(!lastByCustomer.get(message.customer_id)||message.created_at>lastByCustomer.get(message.customer_id)))lastByCustomer.set(message.customer_id,message.created_at);}
 for(const customer of customers){const phone=normalizedPhone(customer.phone);if(phone)phoneCounts.set(phone,(phoneCounts.get(phone)||0)+1);}
 return customers.map(c=>{
 const own=(ordersByCustomer.get(c.id)||[]).sort((a,b)=>String(b.created_at||'').localeCompare(String(a.created_at||'')));
 const real=own.filter(o=>!isTest(o)),purchases=real.filter(o=>String(o.status).toUpperCase()==='DELIVERED');
 return {...c,...customerIdentity(c),duplicate_phone:(phoneCounts.get(normalizedPhone(c.phone))||0)>1,orders:own,order_count:real.length,purchase_count:purchases.length,last_interaction:lastByCustomer.get(c.id),spent:purchases.reduce((s,o)=>s+Number(o.total||0),0)};
 });
}

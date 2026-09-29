export const money=value=>new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(Number(value||0));
export const date=value=>value?new Date(value).toLocaleString('es-CO',{timeZone:'America/Bogota'}):'Sin fecha';
export const isTest=o=>o.is_test===true||String(o.status).toUpperCase()==='TEST';
export const statusLabel=s=>({TEST:'Prueba',PENDING:'Pendiente',CONFIRMED:'Confirmado',PREPARING:'Preparando',READY:'Listo',DELIVERED:'Entregado',CANCELLED:'Cancelado',PENDING_DELIVERY_VALIDATION:'Validar domicilio'}[String(s).toUpperCase()]||s||'Sin estado');

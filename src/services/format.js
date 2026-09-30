export const money=value=>new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(Number(value||0));
export const date=value=>value&&Number.isFinite(Date.parse(value))?new Date(value).toLocaleString('es-CO',{timeZone:'America/Bogota'}):'Sin fecha';
export const isTest=o=>o.is_test===true||String(o.status).toUpperCase()==='TEST';
export const normalizeStatus=s=>['PENDING_CONFIRMATION','PENDING_DELIVERY_VALIDATION','PENDING_APPROVAL'].includes(String(s).toUpperCase())?'PENDING':String(s).toUpperCase();
export const statusLabel=s=>({TEST:'Prueba',PENDING:'Pendiente confirmación',CONFIRMED:'Confirmado',PREPARING:'Preparando',READY:'Listo',DELIVERED:'Entregado',CANCELLED:'Cancelado'}[normalizeStatus(s)]||s||'Sin estado');
export function elapsed(value,now=Date.now()){const time=Date.parse(value);if(!Number.isFinite(time))return 'Sin fecha';const minutes=Math.max(0,Math.floor((now-time)/60000));return minutes<1?'Hace menos de 1 min':minutes<60?'Hace '+minutes+' min':minutes<1440?'Hace '+Math.floor(minutes/60)+' h':'Hace '+Math.floor(minutes/1440)+' días';}

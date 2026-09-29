export const money=value=>new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(Number(value||0));
export const date=value=>value&&Number.isFinite(Date.parse(value))?new Date(value).toLocaleString('es-CO',{timeZone:'America/Bogota'}):'Sin fecha';
export const isTest=o=>o.is_test===true||String(o.status).toUpperCase()==='TEST';
export const normalizeStatus=s=>['PENDING_CONFIRMATION','PENDING_DELIVERY_VALIDATION','PENDING_APPROVAL'].includes(String(s).toUpperCase())?'PENDING':String(s).toUpperCase();
export const statusLabel=s=>({TEST:'Prueba',PENDING:'Pendiente aprobación',CONFIRMED:'Confirmado',PREPARING:'Preparando',READY:'Listo',DELIVERED:'Entregado',CANCELLED:'Cancelado'}[normalizeStatus(s)]||s||'Sin estado');

import {statusLabel,normalizeStatus} from '../services/format';
const colors={PENDING:'bg-yellow-100 text-yellow-900',CONFIRMED:'bg-blue-100 text-blue-900',PREPARING:'bg-orange-100 text-orange-900',READY:'bg-purple-100 text-purple-900',DELIVERED:'bg-green-100 text-green-900',CANCELLED:'bg-red-100 text-red-900'};
export default function OrderStatus({status}) {
 const normalized=normalizeStatus(status);
 return <span className={'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold '+(colors[normalized]||'bg-slate-100 text-slate-700')}><span aria-hidden="true">●</span>{statusLabel(status)}</span>;
}


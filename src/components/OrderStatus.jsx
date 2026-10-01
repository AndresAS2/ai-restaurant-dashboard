import {statusLabel,normalizeStatus} from '../services/format';
const colors={PENDING:'bg-yellow-100 text-yellow-900 ring-yellow-200',CONFIRMED:'bg-green-100 text-green-900 ring-green-200',PREPARING:'bg-blue-100 text-blue-900 ring-blue-200',READY:'bg-purple-100 text-purple-900 ring-purple-200',DELIVERED:'bg-slate-800 text-white ring-slate-700',CANCELLED:'bg-red-100 text-red-900 ring-red-200'};
export default function OrderStatus({status}) {
 return <span className={'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset '+(colors[normalizeStatus(status)]||'bg-slate-100 text-slate-700 ring-slate-200')}><span aria-hidden="true">●</span>{statusLabel(status)}</span>;
}

import {useState} from 'react';
import Page from '../components/Page';
import OrderStatus from '../components/OrderStatus';
import {useResource} from '../hooks/useResource';
import {useOrderRealtime} from '../hooks/useOrderRealtime';
import {getOrders,updateOrderStatus} from '../services/orders';
import {money,date,isTest,statusLabel,normalizeStatus,elapsed} from '../services/format';
import SegmentedControl from '../components/SegmentedControl';
const states=['PENDING','CONFIRMED','PREPARING','READY','DELIVERED','CANCELLED'];
export default function Orders(){
 const r=useResource(getOrders),[filter,setFilter]=useState('all'),[statusFilter,setStatusFilter]=useState('all'),[error,setError]=useState(''),[busy,setBusy]=useState(null);
 const [search,setSearch]=useState('');
 const connection=useOrderRealtime(r.restaurant?.id,r.refresh);
 async function change(o,status){setBusy(o.id);setError('');try{await updateOrderStatus(r.restaurant.id,o,status);await r.refresh();}catch(e){setError(e.message);}finally{setBusy(null);}}
 const orders=(r.data||[]).filter(o=>(filter==='all'||(filter==='test'?isTest(o):!isTest(o)))&&(statusFilter==='all'||normalizeStatus(o.status)===statusFilter)&&[o.id,o.details?.customer_name,o.customers?.name,o.customers?.phone].filter(Boolean).join(' ').toLowerCase().includes(search.toLowerCase()));
 return <Page title="Pedidos" description={connection} resource={r} actions={<SegmentedControl label="Filtrar pedidos" value={filter} onChange={setFilter} options={[['all','Todos'],['real','Reales'],['test','Pruebas']]}/>}>
 <div className="grid sm:grid-cols-2 gap-4"><label>Buscar pedido<input placeholder="Cliente, teléfono o referencia" value={search} onChange={e=>setSearch(e.target.value)}/></label><label>Filtrar por estado<select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="all">Todos los estados</option>{states.map(s=><option key={s} value={s}>{statusLabel(s)}</option>)}</select></label></div>
 <p className="text-sm text-slate-500">{orders.length} pedidos en esta vista</p>
 {error&&<p role="alert" className="notice error">{error}</p>}
 {!orders.length&&<div className="panel">No hay pedidos para este filtro.</div>}
 <div className="grid xl:grid-cols-2 gap-4">{orders.map(o=><article className="panel" key={o.id}>
 <div className="flex flex-wrap justify-between gap-3"><div className="min-w-0"><h2 className="font-semibold">{o.details?.customer_name||o.customers?.name||'Cliente sin nombre'}</h2><p className="text-xs text-slate-500 mt-1">{date(o.created_at)}</p><p className="text-xs font-medium text-emerald-800 mt-1">{elapsed(o.created_at)}</p>{o.customers?.phone&&<p className="text-sm mt-2">{o.customers.phone}</p>}</div><OrderStatus status={isTest(o)?'TEST':o.status}/></div>
 <ul className="my-4 space-y-2">{o.order_items?.map(i=><li key={i.id} className="flex justify-between gap-3"><span>{i.quantity} × {i.menu_products?.name||i.product_id}</span><span>{money(i.quantity*i.price)}</span></li>)}</ul>
 {!o.order_items?.length&&<p className="text-sm my-3 text-slate-500">Sin detalle de productos registrado.</p>}
 <div className="border-t pt-3 flex justify-between font-semibold"><span>Total productos</span><span>{money(o.total)}</span></div>
 <p className="text-sm mt-3">{o.details?.fulfillment==='pickup'?'Recoger en el restaurante':o.details?.delivery_address||'Entrega sin especificar'} {o.details?.neighborhood||''}</p>
 <p className="text-sm text-slate-500">Pago: {o.details?.payment_method||'Sin especificar'}</p>
 {o.details?.delivery_validation_pending&&<p className="notice mt-3">Validar cobertura y costo del domicilio.</p>}
 <details className="text-xs mt-3"><summary>Referencia del pedido</summary><p className="break-all">{o.id}</p></details>
 {!isTest(o)&&<label className="mt-4">Estado<select aria-label="Estado" value={String(o.status).toUpperCase()} disabled={busy!==null} onChange={e=>change(o,e.target.value)}>{Array.from(new Set([String(o.status).toUpperCase(),...states.filter(s=>s!=='PENDING')])).map(s=><option key={s} value={s}>{statusLabel(s)}</option>)}</select></label>}
 </article>)}</div></Page>;
}

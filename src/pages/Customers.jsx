import {useState} from 'react';
import Page from '../components/Page';
import OrderStatus from '../components/OrderStatus';
import {useResource} from '../hooks/useResource';
import {getCustomers,saveCustomer} from '../services/customers';
import {money,date,isTest} from '../services/format';
export default function Customers(){
 const r=useResource(getCustomers),[search,setSearch]=useState(''),[edit,setEdit]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function save(e){e.preventDefault();setBusy(true);setError('');try{await saveCustomer(r.restaurant.id,edit);setEdit(null);await r.refresh();}catch(e){setError(e.message);}finally{setBusy(false);}}
 const customers=(r.data||[]).filter(c=>(c.name+' '+c.phone).toLowerCase().includes(search.toLowerCase()));
 return <Page title="Clientes" description="Historial, compras entregadas y última interacción." resource={r}>
 <input aria-label="Buscar cliente" placeholder="Buscar por nombre o teléfono" value={search} onChange={e=>setSearch(e.target.value)}/>
 {error&&<p className="notice error" role="alert">{error}</p>}
 {edit&&<form onSubmit={save} className="panel space-y-3"><label>Nombre<input required maxLength={150} value={edit.name||''} onChange={e=>setEdit({...edit,name:e.target.value})}/></label><button className="primary" disabled={busy}>Guardar nombre</button><button type="button" className="secondary ml-2" disabled={busy} onClick={()=>setEdit(null)}>Cancelar</button></form>}
 <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{customers.map(c=><article className="panel min-w-0" key={c.id}>
 <h2 className="font-semibold">{c.name||'Sin nombre'}</h2><p className="text-sm text-slate-500 break-all mt-2">{c.phone}</p>
 <p className="mt-4 text-sm">{c.purchase_count} compras entregadas · {money(c.spent)}</p><p className="text-sm">{c.order_count} pedidos reales</p>
 <p className="text-sm mt-2">Última interacción: {c.last_interaction?date(c.last_interaction):'Sin mensajes registrados'}</p>
 <button className="secondary mt-4" disabled={busy} onClick={()=>{setEdit(c);setError('');}}>Editar nombre</button>
 <details className="mt-4"><summary className="cursor-pointer font-medium">Historial de pedidos ({c.orders.length})</summary><div className="max-h-80 overflow-y-auto space-y-3 mt-3">{c.orders.map(o=><div className="border-t pt-3" key={o.id}><div className="flex justify-between gap-2"><OrderStatus status={isTest(o)?'TEST':o.status}/><span>{money(o.total)}</span></div><p className="text-xs mt-2">{date(o.created_at)}</p><p className="text-xs text-slate-500 break-all">{o.id}</p></div>)}{!c.orders.length&&<p>Sin pedidos registrados.</p>}</div></details>
 </article>)}</div>{!customers.length&&<p className="panel">{search?'No hay clientes que coincidan con la búsqueda.':'Todavía no hay clientes registrados.'}</p>}</Page>;
}

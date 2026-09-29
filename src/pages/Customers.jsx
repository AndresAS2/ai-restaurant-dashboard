import {useState} from 'react';
import Page from '../components/Page';
import {useResource} from '../hooks/useResource';
import {getCustomers,saveCustomer} from '../services/customers';
import {money} from '../services/format';
export default function Customers(){
 const r=useResource(getCustomers),[search,setSearch]=useState(''),[edit,setEdit]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function save(e){e.preventDefault();setBusy(true);setError('');try{await saveCustomer(r.restaurant.id,edit);setEdit(null);await r.refresh();}catch(e){setError(e.message);}finally{setBusy(false);}}
 return <Page title="Clientes" description="Clientes y actividad de compra registrada." resource={r}><input aria-label="Buscar cliente" placeholder="Buscar por nombre o teléfono" value={search} onChange={e=>setSearch(e.target.value)}/>{error&&<p className="notice error" role="alert">{error}</p>}{edit&&<form onSubmit={save} className="panel space-y-3"><label>Nombre<input required value={edit.name||''} onChange={e=>setEdit({...edit,name:e.target.value})}/></label><button className="primary" disabled={busy}>Guardar nombre</button><button type="button" className="secondary ml-2" onClick={()=>setEdit(null)}>Cancelar</button></form>}<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{(r.data||[]).filter(c=>(c.name+' '+c.phone).toLowerCase().includes(search.toLowerCase())).map(c=><article className="panel" key={c.id}><h2 className="font-semibold">{c.name||'Sin nombre'}</h2><p className="text-sm text-slate-500 break-all mt-2">{c.phone}</p><p className="mt-4 text-sm">{c.order_count} pedidos reales · {money(c.spent)} entregados</p><button className="secondary mt-4" onClick={()=>{setEdit(c);setError('');}}>Editar nombre</button></article>)}</div>{!r.data?.length&&<p className="panel">Todavía no hay clientes registrados.</p>}</Page>;
}

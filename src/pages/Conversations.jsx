import {useState} from 'react';
import Page from '../components/Page';
import {useResource} from '../hooks/useResource';
import {getConversations} from '../services/conversations';
import {date} from '../services/format';
function latency(metadata){
 const raw=metadata?.response_time_ms;
 return typeof raw==='number'&&Number.isFinite(raw)&&raw>=0?(raw/1000).toLocaleString('es-CO',{maximumFractionDigits:2})+' s':'No registrado';
}
export default function Conversations(){
 const r=useResource(getConversations),[selected,setSelected]=useState(''),[search,setSearch]=useState('');
 const all=r.data||[],key=h=>JSON.stringify([h.customer_id,h.channel||'chat']);
 const groups=[...new Map(all.map(h=>[key(h),h])).entries()].sort((a,b)=>String(b[1].created_at||'').localeCompare(String(a[1].created_at||'')));
 const filtered=groups.filter(([id,h])=>(id+' '+(h.customer?.name||'')+' '+(h.customer?.phone||'')).toLowerCase().includes(search.toLowerCase()));
 const active=filtered.some(([id])=>id===selected)?selected:filtered[0]?.[0],messages=all.filter(h=>key(h)===active),last=messages.at(-1);
 return <Page title="Conversaciones" description="Historial completo y contexto de cada atención." resource={r}>
 <div className="grid md:grid-cols-[250px_minmax(0,1fr)] panel !p-0 overflow-hidden">
 <aside className="p-4 border-r"><input aria-label="Buscar conversación" placeholder="Nombre, teléfono o sesión" value={search} onChange={e=>setSearch(e.target.value)}/>
 <div className="mt-3 max-h-[55vh] overflow-y-auto">{filtered.map(([id,h])=><button key={id} onClick={()=>setSelected(id)} className={'w-full text-left p-3 rounded-lg text-sm '+(active===id?'bg-emerald-50':'')}><span className="block font-semibold">{h.customer?.name||'Cliente '+String(h.customer_id||'').slice(-8)}</span><span className="text-xs text-slate-500">{h.channel} · {h.metadata?.is_test?'Prueba':'Conversación'}</span><span className="block text-xs text-slate-500">{date(h.created_at)}</span></button>)}</div></aside>
 <div className="min-w-0">{last&&<header className="p-5 border-b"><h2 className="font-semibold">{last.customer?.name||'Cliente sin nombre'}</h2><p className="text-sm break-all">{last.customer?.phone||last.customer_id} · {messages.length} mensajes</p></header>}
 <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
 {!messages.length&&<p className="text-slate-500">{search?'No hay conversaciones que coincidan.':'Todavía no hay conversaciones.'}</p>}
 {messages.map(h=><article key={h.id} className={'rounded-xl p-4 max-w-[95%] '+(h.direction==='outgoing'?'bg-emerald-50 ml-auto':'bg-slate-100')}><p className="text-xs text-slate-500 mb-2">{h.direction==='outgoing'?'Mesero virtual':'Cliente'} · {date(h.created_at)}</p><p className="whitespace-pre-wrap break-words">{h.message}</p><footer className="mt-3 text-xs text-slate-500">{typeof h.metadata?.intent==='string'&&<p>Intención: {h.metadata.intent}</p>}{h.direction==='outgoing'&&<p>Tiempo de respuesta IA: {latency(h.metadata)}</p>}</footer></article>)}
 </div></div></div></Page>;
}

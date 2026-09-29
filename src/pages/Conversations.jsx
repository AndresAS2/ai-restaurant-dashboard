import {useState} from 'react';
import Page from '../components/Page';
import {useResource} from '../hooks/useResource';
import {getConversations} from '../services/conversations';
import {date} from '../services/format';
export default function Conversations(){
 const r=useResource(getConversations),[selected,setSelected]=useState(''),[search,setSearch]=useState('');
 const all=r.data||[],key=h=>JSON.stringify([h.customer_id,h.channel||'chat']),groups=[...new Map(all.map(h=>[key(h),h])).entries()].sort((a,b)=>b[1].created_at.localeCompare(a[1].created_at));
 const active=groups.some(([id])=>id===selected)?selected:groups[0]?.[0],messages=all.filter(h=>key(h)===active);
 return <Page title="Conversaciones" description="Historial de mensajes del cliente y el mesero virtual." resource={r}><div className="grid md:grid-cols-[250px_1fr] panel !p-0 overflow-hidden"><aside className="p-4 border-r"><input aria-label="Buscar conversación" placeholder="Buscar nombre o sesión" value={search} onChange={e=>setSearch(e.target.value)}/><div className="mt-3 max-h-[55vh] overflow-y-auto">{groups.filter(([id,h])=>(id+' '+(h.customer?.name||'')).toLowerCase().includes(search.toLowerCase())).map(([id,h])=><button key={id} onClick={()=>setSelected(id)} className={'w-full text-left p-3 rounded-lg text-sm '+(active===id?'bg-emerald-50':'')}><span className="block font-semibold">{h.customer?.name||'Cliente '+String(h.customer_id||'').slice(-8)}</span><span className="text-xs text-slate-500">{h.channel} · {h.metadata?.is_test?'Prueba':'Conversación'}</span></button>)}</div></aside><div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">{!messages.length&&<p className="text-slate-500">Todavía no hay conversaciones.</p>}{messages.map(h=><article key={h.id} className={'rounded-xl p-4 max-w-[90%] '+(h.direction==='outgoing'?'bg-emerald-50 ml-auto':'bg-slate-100')}><p className="text-xs text-slate-500 mb-2">{h.direction==='outgoing'?'Mesero virtual':'Cliente'} · {date(h.created_at)}</p><p className="whitespace-pre-wrap break-words">{h.message}</p></article>)}</div></div></Page>;
}

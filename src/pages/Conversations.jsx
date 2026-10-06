import {useState,useMemo} from 'react';
import {ArrowLeft,MessageSquare} from 'lucide-react';
import Page from '../components/Page';
import ConversationProfile from '../components/ConversationProfile';
import {useResource} from '../hooks/useResource';
import {getConversations} from '../services/conversations';
import {customerIdentity} from '../services/customerIdentity';
import {date} from '../services/format';
const key=h=>JSON.stringify([h.customer_id,h.channel||'chat']);
function latency(metadata){const raw=metadata?.response_time_ms;return typeof raw==='number'&&Number.isFinite(raw)&&raw>=0?(raw/1000).toLocaleString('es-CO',{maximumFractionDigits:2})+' s':'No registrado';}
export default function Conversations(){
 const r=useResource(getConversations),[selected,setSelected]=useState(''),[search,setSearch]=useState(''),[showThread,setShowThread]=useState(false);
 const groups=useMemo(()=>[...new Map((r.data||[]).map(h=>[key(h),h])).entries()].sort((a,b)=>String(b[1].created_at||'').localeCompare(String(a[1].created_at||''))),[r.data]);
 const filtered=groups.filter(([id,h])=>(id+' '+(h.customer?.name||'')+' '+(h.customer?.phone||'')).toLowerCase().includes(search.toLowerCase()));
 const active=filtered.some(([id])=>id===selected)?selected:filtered[0]?.[0];
 const messages=useMemo(()=>(r.data||[]).filter(h=>key(h)===active),[r.data,active]),last=messages.at(-1);
 const identity=customerIdentity(last?.customer||{id:last?.customer_id});
 return <Page title="Conversaciones" description="Cada atención, con todo su contexto." resource={r}>
 <div className="grid lg:grid-cols-[300px_minmax(0,1fr)_280px] panel !p-0 overflow-hidden shadow-sm">
 <aside className={'p-4 border-r bg-white '+(showThread?'hidden md:block':'')}><div className="flex items-center gap-2 mb-4 text-sm font-semibold"><MessageSquare size={18}/>Bandeja de conversaciones <span className="ml-auto text-slate-400">{groups.length}</span></div><input aria-label="Buscar conversación" placeholder="Nombre, teléfono o sesión" value={search} onChange={e=>setSearch(e.target.value)}/><div className="mt-3 max-h-[55vh] overflow-y-auto space-y-1">{filtered.map(([id,h])=>{const person=customerIdentity(h.customer||{id:h.customer_id});return <button key={id} onClick={()=>{setSelected(id);setShowThread(true);}} className={'w-full text-left p-3 rounded-xl text-sm border '+(active===id?'bg-emerald-50 border-emerald-200':'border-transparent hover:bg-slate-50')}><span className="block font-semibold">{person.display_name}</span><span className="text-xs text-slate-500">{h.channel} · {person.reference}</span><span className="block text-xs text-slate-400 mt-1">{date(h.created_at)}</span><span className="block truncate text-slate-500 mt-2">{h.message}</span></button>;})}</div></aside>
 <div className={'min-w-0 bg-[#f2f6f4] '+(!showThread?'hidden md:block':'')}>
 {last&&<header className="p-5 border-b bg-white flex gap-3 items-center"><button className="md:hidden secondary !p-2" onClick={()=>setShowThread(false)}><ArrowLeft size={18}/></button><div><h2 className="font-semibold">{identity.display_name}</h2><p className="text-xs text-slate-500">{identity.display_phone||'Sesión '+identity.reference} · {messages.length} mensajes</p></div></header>}
 <div className="p-4 sm:p-6 space-y-5 max-h-[70vh] min-h-[300px] overflow-y-auto">{messages.map(h=><article key={h.id} className={'conversation-bubble '+(h.direction==='outgoing'?'bg-emerald-50 border-emerald-100 ml-auto rounded-tr-sm':'bg-white border-slate-200 rounded-tl-sm')}><p className="text-xs font-semibold text-slate-500 mb-2">{h.direction==='outgoing'?'Mesero virtual':'Cliente'} · {date(h.created_at)}</p><p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{h.message}</p><footer className="mt-3 text-xs text-slate-500">{h.metadata?.intent&&<p>Intención: {h.metadata.intent}</p>}{h.direction==='outgoing'&&<p>Tiempo IA: {latency(h.metadata)}</p>}</footer></article>)}</div></div>
 {last&&<ConversationProfile customer={last.customer} identity={identity} messages={messages} last={last}/>} 
 </div></Page>;
}

import {useEffect,useState} from 'react';
import Page from '../components/Page';
import {useResource} from '../hooks/useResource';
import {getAIConfig,saveAIConfig} from '../services/aiConfig';
const fields=[['welcome','Mensaje de bienvenida'],['personality','Personalidad'],['tone','Tono'],['salesInstructions','Instrucciones de venta'],['policies','Reglas de atención'],['promotions','Promociones'],['faq','Preguntas frecuentes'],['additionalInformation','Información adicional']];
export default function AISettings(){
 const r=useResource(getAIConfig,false),[form,setForm]=useState({}),[busy,setBusy]=useState(false),[notice,setNotice]=useState(''),[error,setError]=useState('');
 useEffect(()=>{setNotice('');},[form]);
 useEffect(()=>{if(!r.loading&&!r.error){const c=r.data?.config||{};setForm(Object.fromEntries(fields.map(([k])=>[k,c[k]??(k==='welcome'?c.initialMessage:'')??''])));}},[r.data,r.loading,r.error]);
 async function save(e){e.preventDefault();setBusy(true);setError('');setNotice('');try{await saveAIConfig(r.restaurant.id,form);setNotice('Entrenamiento guardado.');}catch(e){setError(e.message);}finally{setBusy(false);}}
 return <Page title="Entrenamiento IA" description="Define cómo debe atender tu asistente." resource={r}><form onSubmit={save} className="space-y-5"><div className="panel grid md:grid-cols-2 gap-4">{fields.map(([key,label])=><label key={key}>{label}<textarea rows="4" maxLength={12000} value={form[key]||''} onChange={e=>setForm({...form,[key]:e.target.value})}/></label>)}</div><p className="notice">Guardar conserva el entrenamiento. Su uso en las respuestas requiere conectar estos campos con el bot.</p>{error&&<p className="notice error" role="alert">{error}</p>}{notice&&<p className="notice" role="status">{notice}</p>}<button className="primary" disabled={busy||r.loading||!!r.error}>{busy?'Guardando…':'Guardar entrenamiento'}</button></form></Page>;
}

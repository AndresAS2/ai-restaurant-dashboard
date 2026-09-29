import {useEffect,useState} from 'react';
import Page from '../components/Page';
import {useAuth} from '../context/AuthContext';
import {useResource} from '../hooks/useResource';
import {getRestaurantProfile,saveRestaurantIdentity} from '../services/restaurantProfile';
import {saveAIConfig} from '../services/aiConfig';
const days=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
export default function Settings(){
 const r=useResource(getRestaurantProfile,false),{updateRestaurant}=useAuth();
 const [form,setForm]=useState({}),[hours,setHours]=useState([]),[images,setImages]=useState([]),[busy,setBusy]=useState(false),[notice,setNotice]=useState(''),[error,setError]=useState('');
 useEffect(()=>{if(!r.loading&&!r.error&&r.data){const c=r.data.settings?.config||{},p=c.restaurant_profile||{};
 setForm({...p,name:r.data.restaurant.name,whatsapp_number:r.data.restaurant.whatsapp_number||'',paymentMethods:c.paymentMethods||'',deliveryPolicy:c.deliveryPolicy||''});
 setHours(days.map(day=>({day,closed:true,open:'09:00',close:'21:00',...(p.hours||[]).find(h=>h.day===day)})));
 setImages(Array.isArray(c.menu_images)?c.menu_images:[]);
 }},[r.data,r.loading,r.error]);
 const field=(k,v)=>setForm(f=>({...f,[k]:v}));
 async function save(e){
 e.preventDefault();setBusy(true);setError('');setNotice('');let identitySaved=false;
 try{
 for(const url of [form.logo_url,...images.map(i=>i.url)].filter(Boolean)){if(new URL(url).protocol!=='https:')throw new Error('Las imágenes deben usar enlaces HTTPS.');}
 for(const h of hours)if(!h.closed&&(!h.open||!h.close||h.open===h.close))throw new Error('Completa las horas de apertura y cierre de '+h.day+'.');
 const identity=await saveRestaurantIdentity(r.restaurant.id,form);identitySaved=true;updateRestaurant(identity);
 const {name,whatsapp_number,paymentMethods,deliveryPolicy,...profile}=form;
 await saveAIConfig(r.restaurant.id,{restaurant_profile:{...profile,hours},paymentMethods,deliveryPolicy,menu_images:images.map((a,i)=>({...a,sort_order:i,active:a.active!==false}))});
 setNotice('Configuración guardada.');
 }catch(e){setError((identitySaved?'Nombre y WhatsApp guardados; los demás ajustes no se guardaron. Reintenta. ':'')+e.message);}finally{setBusy(false);}
 }
 return <Page title="Configuración restaurante" description="Identidad, contacto y operación de tu negocio." resource={r}><form onSubmit={save} className="space-y-5">
 <div className="panel grid md:grid-cols-2 gap-4">
 <label>Nombre del restaurante<input required maxLength={150} value={form.name||''} onChange={e=>field('name',e.target.value)}/></label>
 <label>WhatsApp<input type="tel" maxLength={30} value={form.whatsapp_number||''} onChange={e=>field('whatsapp_number',e.target.value)}/></label>
 <label>Correo de contacto<input type="email" value={form.contact_email||''} onChange={e=>field('contact_email',e.target.value)}/></label>
 <label>Teléfono de contacto<input type="tel" maxLength={30} value={form.contact_phone||''} onChange={e=>field('contact_phone',e.target.value)}/></label>
 <label>Dirección<input maxLength={300} value={form.address||''} onChange={e=>field('address',e.target.value)}/></label>
 <label>Logo (enlace HTTPS)<input type="url" value={form.logo_url||''} onChange={e=>field('logo_url',e.target.value)}/></label>
 <label>Métodos de pago<textarea value={form.paymentMethods||''} onChange={e=>field('paymentMethods',e.target.value)}/></label>
 <label>Política de domicilios<textarea value={form.deliveryPolicy||''} onChange={e=>field('deliveryPolicy',e.target.value)}/></label></div>
 <div className="panel space-y-4"><h2 className="text-xl font-semibold">Horarios</h2><p className="text-sm text-slate-500">Hora de Bogotá. Si el cierre es anterior a la apertura, termina al día siguiente.</p>{hours.map((h,i)=><div key={h.day} className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-center"><strong>{h.day}</strong><label className="flex gap-2 items-center"><input type="checkbox" checked={h.closed} onChange={e=>setHours(hours.map((v,j)=>i===j?{...v,closed:e.target.checked}:v))}/>Cerrado</label><label>Apertura {h.day}<input type="time" disabled={h.closed} value={h.open} onChange={e=>setHours(hours.map((v,j)=>i===j?{...v,open:e.target.value}:v))}/></label><label>Cierre {h.day}<input type="time" disabled={h.closed} value={h.close} onChange={e=>setHours(hours.map((v,j)=>i===j?{...v,close:e.target.value}:v))}/></label></div>)}</div>
 <div className="panel space-y-4"><h2 className="text-xl font-semibold">Recursos visuales del menú</h2><p className="text-sm text-slate-500">Enlaces HTTPS a imágenes públicas.</p>{images.map((a,i)=><div key={i} className="grid sm:grid-cols-[1fr_1fr_auto] gap-2"><label>Enlace de imagen<input required type="url" value={a.url||''} onChange={e=>setImages(images.map((x,j)=>j===i?{...x,url:e.target.value}:x))}/></label><label>Descripción<input value={a.caption||''} onChange={e=>setImages(images.map((x,j)=>j===i?{...x,caption:e.target.value}:x))}/></label><button type="button" className="secondary self-end" onClick={()=>setImages(images.filter((_,j)=>i!==j))}>Quitar</button></div>)}<button type="button" className="secondary" onClick={()=>setImages([...images,{url:'',caption:'',active:true}])}>Agregar imagen</button></div>
 {error&&<p className="notice error" role="alert">{error}</p>}{notice&&<p className="notice" role="status">{notice}</p>}<button className="primary" disabled={busy||r.loading||!!r.error}>{busy?'Guardando…':'Guardar configuración'}</button></form></Page>;
}

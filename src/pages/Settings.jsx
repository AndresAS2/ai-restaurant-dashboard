import {useEffect,useState} from 'react';
import Page from '../components/Page';
import {useAuth} from '../context/AuthContext';
import {useResource} from '../hooks/useResource';
import {getRestaurantProfile,saveRestaurantIdentity} from '../services/restaurantProfile';
import {saveAIConfig} from '../services/aiConfig';
import AssetPicker from '../components/AssetPicker';
import PaymentEditor from '../components/PaymentEditor';
import MenuMediaEditor from '../components/MenuMediaEditor';
import {paymentPatch} from '../services/menuValidation';
const days=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
export default function Settings(){
 const [payments,setPayments]=useState([]),[paymentsChanged,setPaymentsChanged]=useState(false);
 const r=useResource(getRestaurantProfile,false),{updateRestaurant}=useAuth();
 const [form,setForm]=useState({}),[hours,setHours]=useState([]),[images,setImages]=useState([]),[busy,setBusy]=useState(false),[notice,setNotice]=useState(''),[error,setError]=useState('');
 useEffect(()=>{setNotice('');},[form,hours,images]);
 useEffect(()=>{if(!r.loading&&!r.error&&r.data){const c=r.data.settings?.config||{},p=c.restaurant_profile||{};
 setForm({...p,name:r.data.restaurant.name,whatsapp_number:r.data.restaurant.whatsapp_number||'',paymentMethods:c.paymentMethods||'',deliveryPolicy:c.deliveryPolicy||''});
 setHours(days.map(day=>({day,closed:true,open:'09:00',close:'21:00',...(Array.isArray(p.hours)?p.hours:[]).find(h=>h?.day===day)})));
 setImages(Array.isArray(c.menu_images)?c.menu_images:[]);
 setPayments(Array.isArray(c.payment_options)?c.payment_options:[]);setPaymentsChanged(false);
 }},[r.data,r.loading,r.error]);
 const field=(k,v)=>setForm(f=>({...f,[k]:v}));
 async function save(e){
 e.preventDefault();setBusy(true);setError('');setNotice('');let identitySaved=false;
 try{
 for(const url of [form.logo_url,form.hero_url,...images.map(i=>i.url)].filter(Boolean)){if(new URL(url).protocol!=='https:')throw new Error('Las imágenes deben usar enlaces HTTPS.');}
 for(const h of hours)if(!h.closed&&(!h.open||!h.close||h.open===h.close))throw new Error('Completa las horas de apertura y cierre de '+h.day+'.');
 const paymentConfig=paymentsChanged||Array.isArray(r.data.settings?.config?.payment_options)?paymentPatch(payments):{};
 const identity=await saveRestaurantIdentity(r.restaurant.id,form);identitySaved=true;updateRestaurant(identity);
 const {name,whatsapp_number,paymentMethods,deliveryPolicy,...profile}=form;
 await saveAIConfig(r.restaurant.id,{restaurant_profile:{...profile,hours},paymentMethods,deliveryPolicy,menu_images:images.map((a,i)=>({...a,sort_order:i,active:a.active!==false})),...paymentConfig});
 setNotice('Configuración guardada.');
 }catch(e){setError((identitySaved?'Nombre y WhatsApp guardados; los demás ajustes no se guardaron. Reintenta. ':'')+e.message);}finally{setBusy(false);}
 }
 return <Page title="Configuración restaurante" description="Identidad, contacto y operación de tu negocio." resource={r}><form onSubmit={save} onChange={()=>setNotice('')} className="space-y-5">
 <fieldset disabled={busy||r.loading||!!r.error} className="space-y-5">
 <div className="panel grid md:grid-cols-2 gap-4">
 <label>Nombre del restaurante<input required maxLength={150} value={form.name||''} onChange={e=>field('name',e.target.value)}/></label>
 <label>WhatsApp<input type="tel" maxLength={30} value={form.whatsapp_number||''} onChange={e=>field('whatsapp_number',e.target.value)}/></label>
 <label>Correo de contacto<input type="email" value={form.contact_email||''} onChange={e=>field('contact_email',e.target.value)}/></label>
 <label>Teléfono de contacto<input type="tel" maxLength={30} value={form.contact_phone||''} onChange={e=>field('contact_phone',e.target.value)}/></label>
 <label>Dirección<input maxLength={300} value={form.address||''} onChange={e=>field('address',e.target.value)}/></label>
 <label>Logo (enlace HTTPS)<input type="url" value={form.logo_url||''} onChange={e=>field('logo_url',e.target.value)}/></label>
 {!paymentsChanged&&!Array.isArray(r.data?.settings?.config?.payment_options)&&<label>Métodos de pago actuales<textarea value={form.paymentMethods||''} onChange={e=>field('paymentMethods',e.target.value)}/><span className="text-xs text-slate-500">Este texto se conserva hasta que configures los métodos visuales.</span></label>}
 <label>Política de domicilios<textarea value={form.deliveryPolicy||''} onChange={e=>field('deliveryPolicy',e.target.value)}/></label></div>
 <section className="panel space-y-4"><h2 className="text-xl font-semibold">Identidad visual</h2><label>Descripción del restaurante<textarea maxLength={2000} value={form.description||''} onChange={e=>field('description',e.target.value)}/></label><div className="grid sm:grid-cols-2 gap-4"><div>{form.logo_url&&<img src={form.logo_url} alt="Logo del restaurante" className="h-28 object-contain mb-3"/>}<AssetPicker key={'logo-'+r.restaurant?.id} restaurantId={r.restaurant?.id} label="Subir logo" onUploaded={a=>field('logo_url',a.url)}/></div><div>{form.hero_url&&<img src={form.hero_url} alt="Imagen principal del restaurante" className="h-28 object-contain mb-3"/>}<AssetPicker key={'hero-'+r.restaurant?.id} restaurantId={r.restaurant?.id} label="Subir imagen principal" onUploaded={a=>field('hero_url',a.url)}/>{form.hero_url&&<button type="button" className="secondary mt-2" onClick={()=>field('hero_url','')}>Quitar imagen principal</button>}</div></div></section>
 <PaymentEditor restaurantId={r.restaurant?.id} value={payments} disabled={busy} onChange={value=>{setPayments(value);setPaymentsChanged(true);setNotice('');}}/>
 <MenuMediaEditor restaurantId={r.restaurant?.id} value={images} onChange={setImages}/>
 <div className="panel space-y-4"><h2 className="text-xl font-semibold">Horarios</h2><p className="text-sm text-slate-500">Hora de Bogotá. Si el cierre es anterior a la apertura, termina al día siguiente.</p>{hours.map((h,i)=><div key={h.day} className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-center"><strong>{h.day}</strong><label className="flex gap-2 items-center"><input type="checkbox" checked={h.closed} onChange={e=>setHours(hours.map((v,j)=>i===j?{...v,closed:e.target.checked}:v))}/>Cerrado</label><label>Apertura {h.day}<input type="time" disabled={h.closed} value={h.open} onChange={e=>setHours(hours.map((v,j)=>i===j?{...v,open:e.target.value}:v))}/></label><label>Cierre {h.day}<input type="time" disabled={h.closed} value={h.close} onChange={e=>setHours(hours.map((v,j)=>i===j?{...v,close:e.target.value}:v))}/></label></div>)}</div>

 {error&&<p className="notice error" role="alert">{error}</p>}{notice&&<p className="notice" role="status">{notice}</p>}<button className="primary" disabled={busy||r.loading||!!r.error}>{busy?'Guardando…':'Guardar configuración'}</button></fieldset></form></Page>;
}

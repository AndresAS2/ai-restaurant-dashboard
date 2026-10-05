import {useEffect,useState} from 'react';
import {ShieldCheck} from 'lucide-react';
import {
 getRestaurants,
 getPendingRestaurantRequests,
 approveRestaurantRequest,
 rejectRestaurantRequest
} from '../services/masterAdmin';

export default function MasterRestaurants(){
 const [restaurants,setRestaurants]=useState([]);
 const [requests,setRequests]=useState([]);
 const [loading,setLoading]=useState(true);
 const [reviewing,setReviewing]=useState('');
 const [error,setError]=useState('');

 async function loadData(){
  setLoading(true);setError('');
  try{
   const [restaurantData,requestData]=await Promise.all([
    getRestaurants(),
    getPendingRestaurantRequests()
   ]);
   setRestaurants(restaurantData);
   setRequests(requestData);
  }catch(e){
   setError(e.message||'No se pudieron cargar los datos.');
  }finally{
   setLoading(false);
  }
 }

 useEffect(()=>{loadData();},[]);

 async function review(id,action){
  setReviewing(id+action);setError('');
  try{
   if(action==='approve')await approveRestaurantRequest(id);
   else await rejectRestaurantRequest(id);
   await loadData();
  }catch(e){
   setError(e.message||'No se pudo revisar la solicitud.');
  }finally{
   setReviewing('');
  }
 }

 return <section className="space-y-6">
  <header>
   <p className="eyebrow flex items-center gap-2"><ShieldCheck size={16}/>ADMINISTRACIÓN SAAS</p>
   <h1 className="text-3xl font-semibold">Solicitudes y restaurantes</h1>
   <p className="text-slate-500 mt-2">Aprueba o rechaza nuevos restaurantes antes de habilitar su acceso.</p>
  </header>

  {error&&<p className="notice error" role="alert">{error}</p>}

  <article className="panel space-y-4">
   <div className="flex items-center justify-between gap-3">
    <div>
     <h2 className="text-xl font-semibold">Solicitudes pendientes</h2>
     <p className="text-sm text-slate-500">Solo al pulsar Permitir se crea el tenant del restaurante.</p>
    </div>
    <span className="badge">{requests.length} pendiente{requests.length===1?'':'s'}</span>
   </div>

   {loading?<p>Cargando…</p>:requests.length===0?<p className="notice">No hay restaurantes pendientes de aprobación.</p>:<div className="space-y-3">
    {requests.map(request=><div key={request.id} className="border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
     <div>
      <p className="font-semibold">{request.restaurant_name}</p>
      <p className="text-sm text-slate-500">{request.email}</p>
      <p className="text-xs text-slate-400 mt-1">{new Date(request.created_at).toLocaleString('es-CO',{timeZone:'America/Bogota'})}</p>
     </div>
     <div className="flex gap-2">
      <button className="secondary" disabled={Boolean(reviewing)} onClick={()=>review(request.id,'reject')}>
       {reviewing===request.id+'reject'?'Rechazando…':'Rechazar'}
      </button>
      <button className="primary" disabled={Boolean(reviewing)} onClick={()=>review(request.id,'approve')}>
       {reviewing===request.id+'approve'?'Aprobando…':'Permitir'}
      </button>
     </div>
    </div>)}
   </div>}
  </article>

  <article className="panel space-y-4">
   <div>
    <h2 className="text-xl font-semibold">Restaurantes activos</h2>
    <p className="text-sm text-slate-500">Cada restaurante mantiene sus propios datos y configuración.</p>
   </div>

   {loading?<p>Cargando…</p>:<div className="space-y-3">
    {restaurants.map(restaurant=><div key={restaurant.id} className="border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
     <div>
      <p className="font-semibold">{restaurant.name}</p>
      <p className="text-xs text-slate-500">{restaurant.id}</p>
      <p className="text-sm text-slate-500 mt-1">WhatsApp: {restaurant.whatsapp_number||'Pendiente de conectar'}</p>
     </div>
     <span className="badge">{restaurant.status||'active'}</span>
    </div>)}
   </div>}
  </article>
 </section>;
}

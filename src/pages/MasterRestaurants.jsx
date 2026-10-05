import { useEffect, useState } from 'react';
import {
  getRestaurants,
  getPendingRestaurantRequests,
  approveRestaurantRequest,
  rejectRestaurantRequest,
} from '../services/masterAdmin';

export default function MasterRestaurants(){
 const [restaurants,setRestaurants]=useState([]);
 const [requests,setRequests]=useState([]);
 const [loading,setLoading]=useState(true);
 const [reviewing,setReviewing]=useState('');
 const [error,setError]=useState('');

 async function loadData(){
  setLoading(true);
  setError('');
  try{
   const [restaurantData, requestData] = await Promise.all([
    getRestaurants(),
    getPendingRestaurantRequests(),
   ]);
   setRestaurants(restaurantData);
   setRequests(requestData);
  }catch(err){
   setError(err.message || 'No se pudieron cargar los datos');
  }finally{
   setLoading(false);
  }
 }

 useEffect(()=>{
  loadData();
 },[]);

 async function review(id, action){
  setReviewing(id + action);
  setError('');
  try{
   if(action === 'approve') await approveRestaurantRequest(id);
   else await rejectRestaurantRequest(id);
   await loadData();
  }catch(err){
   setError(err.message || 'No se pudo revisar la solicitud');
  }finally{
   setReviewing('');
  }
 }

 return (
  <div>
   <div className="mb-6">
    <h1 className="text-2xl font-bold">Restaurantes SaaS</h1>
    <p className="text-sm text-gray-500">
      Los nuevos restaurantes se registran desde la pantalla de acceso y quedan aquí pendientes de aprobación.
    </p>
   </div>

   {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}

   <section className="mb-8">
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-semibold">Solicitudes pendientes</h2>
      <span className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-800">
        {requests.length}
      </span>
    </div>

    {loading ? <p>Cargando...</p> : requests.length === 0 ? (
      <div className="rounded-lg border bg-white p-4 text-sm text-gray-500">
        No hay restaurantes pendientes de aprobación.
      </div>
    ) : (
      <div className="space-y-3">
        {requests.map((request)=>(
          <div key={request.id} className="rounded-xl border bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{request.restaurant_name}</p>
                <p className="text-sm text-gray-600">{request.email}</p>
                <p className="mt-1 text-xs text-gray-400">
                  Solicitud: {new Date(request.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={()=>review(request.id,'reject')}
                  disabled={reviewing !== ''}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 disabled:opacity-50"
                >
                  Rechazar
                </button>
                <button
                  type="button"
                  onClick={()=>review(request.id,'approve')}
                  disabled={reviewing !== ''}
                  className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {reviewing === request.id + 'approve' ? 'Aprobando...' : 'Permitir'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
   </section>

   <section>
    <h2 className="mb-3 text-lg font-semibold">Restaurantes activos</h2>
    {loading ? <p>Cargando...</p> : (
     <div className="space-y-3">
      {restaurants.map((restaurant)=>(
       <div key={restaurant.id} className="border rounded-lg bg-white p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold">{restaurant.name}</p>
            <p className="text-xs text-gray-500">{restaurant.id}</p>
          </div>
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs text-green-700">
            {restaurant.status || 'active'}
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          WhatsApp: {restaurant.whatsapp_number || 'Pendiente de conectar'}
        </p>
       </div>
      ))}
     </div>
    )}
   </section>
  </div>
 );
}

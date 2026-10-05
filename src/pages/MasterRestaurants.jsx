import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRestaurants } from '../services/masterAdmin';

export default function MasterRestaurants(){
 const [restaurants,setRestaurants]=useState([]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');

 useEffect(()=>{
  getRestaurants()
   .then(setRestaurants)
   .catch((err)=>setError(err.message || 'No se pudieron cargar los restaurantes'))
   .finally(()=>setLoading(false));
 },[]);

 return (
  <div>
   <div className="flex justify-between items-center mb-6">
    <div>
      <h1 className="text-2xl font-bold">Restaurantes SaaS</h1>
      <p className="text-sm text-gray-500">Cada restaurante es un tenant independiente.</p>
    </div>
    <Link to="/master/restaurants/create" className="rounded bg-black px-4 py-2 text-white">
      Crear restaurante
    </Link>
   </div>

   {error && <p className="mb-4 text-red-600">{error}</p>}

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
  </div>
 );
}

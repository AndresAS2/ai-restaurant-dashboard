import { useEffect, useState } from 'react';
import { getRestaurants } from '../services/masterAdmin';

export default function MasterRestaurants(){
 const [restaurants,setRestaurants]=useState([]);
 const [loading,setLoading]=useState(true);

 useEffect(()=>{
  getRestaurants()
   .then(setRestaurants)
   .finally(()=>setLoading(false));
 },[]);

 return (
  <div>
   <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold">Restaurantes SaaS</h1>
    <button className="rounded bg-black px-4 py-2 text-white">Nuevo restaurante</button>
   </div>
   {loading ? <p>Cargando...</p> : (
    <div className="space-y-3">
     {restaurants.map((restaurant)=>(
      <div key={restaurant.id} className="border rounded-lg p-4">
       <p className="font-semibold">{restaurant.name}</p>
       <p className="text-sm">Estado: {restaurant.status || 'Activo'}</p>
      </div>
     ))}
    </div>
   )}
  </div>
 );
}

import { useEffect, useState } from 'react';
import { getRestaurants } from '../services/masterAdmin';

export default function MasterAdmin(){
 const [restaurants,setRestaurants]=useState([]);

 useEffect(()=>{
  getRestaurants().then(setRestaurants).catch(console.error);
 },[]);

 return (
  <div>
   <h1 className="text-2xl font-bold">Panel Maestro SaaS</h1>
   <p className="text-gray-500">Administración general de restaurantes.</p>
   <div className="mt-4 space-y-3">
    {restaurants.map((item)=>(
      <div key={item.id} className="rounded-lg border p-4">
        <strong>{item.name}</strong>
      </div>
    ))}
   </div>
  </div>
 );
}

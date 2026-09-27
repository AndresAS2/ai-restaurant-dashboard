import { useEffect, useState } from 'react';
import { getRestaurantUsers } from '../services/masterUsers';

export default function MasterUsers(){
 const [users,setUsers]=useState([]);
 const [loading,setLoading]=useState(true);

 useEffect(()=>{
  async function load(){
   try{
    // Preparado para recibir restaurantId desde el panel maestro
    // cuando se implemente el selector de restaurantes.
    setUsers([]);
   }finally{
    setLoading(false);
   }
  }
  load();
 },[]);

 return (
  <div>
   <h1 className="text-2xl font-bold">Usuarios de restaurantes</h1>
   <p className="text-gray-500">Gestión de accesos SaaS.</p>
   {loading ? <p>Cargando...</p> : <p>{users.length} usuarios</p>}
  </div>
 );
}

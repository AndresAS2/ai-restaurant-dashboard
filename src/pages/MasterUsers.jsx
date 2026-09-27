import { useEffect, useState } from 'react';
import { getRestaurantUsers } from '../services/masterUsers';
import { getAvailableRestaurants } from '../services/restaurantSelector';

export default function MasterUsers(){
 const [restaurants,setRestaurants]=useState([]);
 const [restaurantId,setRestaurantId]=useState('');
 const [users,setUsers]=useState([]);
 const [loading,setLoading]=useState(false);

 useEffect(()=>{
  getAvailableRestaurants().then(setRestaurants);
 },[]);

 async function loadUsers(id){
  setRestaurantId(id);
  if(!id){
   setUsers([]);
   return;
  }
  setLoading(true);
  try{
   setUsers(await getRestaurantUsers(id));
  }finally{
   setLoading(false);
  }
 }

 return (
  <div>
   <h1 className="text-2xl font-bold">Usuarios de restaurantes</h1>
   <p className="text-gray-500 mb-4">Gestión de accesos SaaS.</p>

   <select value={restaurantId} onChange={(e)=>loadUsers(e.target.value)} className="border p-2 mb-4">
    <option value="">Seleccionar restaurante</option>
    {restaurants.map((restaurant)=>(
      <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
    ))}
   </select>

   {loading ? <p>Cargando...</p> : (
    <div>
      <p>{users.length} usuarios</p>
      {users.map((user)=>(
       <div key={user.id} className="border p-3 mt-2 rounded">
        {user.user_id}
       </div>
      ))}
    </div>
   )}
  </div>
 );
}

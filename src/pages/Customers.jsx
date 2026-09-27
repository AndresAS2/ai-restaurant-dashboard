import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCustomers } from '../services/customers';

export default function Customers(){
 const { restaurant } = useAuth();
 const [customers,setCustomers]=useState([]);
 const [loading,setLoading]=useState(true);

 useEffect(()=>{
  async function load(){
   if(!restaurant?.id) return;
   const data=await getCustomers(restaurant.id);
   setCustomers(data);
   setLoading(false);
  }
  load();
 },[restaurant]);

 return <div>
  <h1 className="text-2xl font-bold">Clientes</h1>
  <p className="text-gray-500 mb-6">CRM de clientes del restaurante.</p>
  {loading ? <p>Cargando...</p> : (
   <div className="grid gap-3">
    {customers.length===0 && <p>No hay clientes registrados.</p>}
    {customers.map(customer=>(
     <div key={customer.id} className="bg-white rounded-xl shadow p-4">
      <strong>{customer.name || 'Cliente'}</strong>
      <p>{customer.phone || 'Sin teléfono'}</p>
     </div>
    ))}
   </div>
  )}
 </div>
}

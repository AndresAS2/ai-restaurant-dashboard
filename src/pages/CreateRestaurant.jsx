import { useState } from 'react';
import { createRestaurant } from '../services/onboarding';

export default function CreateRestaurant(){
 const [form,setForm]=useState({name:'', phone:'', whatsapp:''});
 const [message,setMessage]=useState('');

 async function handleSubmit(e){
  e.preventDefault();
  await createRestaurant(form);
  setMessage('Restaurante creado correctamente');
 }

 return <div className="p-6">
  <h1 className="text-2xl font-bold">Crear restaurante</h1>
  <form onSubmit={handleSubmit} className="space-y-3 mt-4">
   <input className="border p-2" placeholder="Nombre" onChange={e=>setForm({...form,name:e.target.value})}/>
   <input className="border p-2" placeholder="Teléfono" onChange={e=>setForm({...form,phone:e.target.value})}/>
   <input className="border p-2" placeholder="WhatsApp" onChange={e=>setForm({...form,whatsapp:e.target.value})}/>
   <button className="bg-black text-white px-4 py-2">Crear</button>
  </form>
  <p>{message}</p>
 </div>
}

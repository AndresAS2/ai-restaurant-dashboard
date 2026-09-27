import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getConversations } from '../services/conversations';

export default function Conversations(){
 const { restaurant } = useAuth();
 const [conversations, setConversations] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  async function load(){
   if(!restaurant) return;
   const data = await getConversations(restaurant.id);
   setConversations(data);
   setLoading(false);
  }
  load();
 }, [restaurant]);

 if(loading) return <div>Cargando conversaciones...</div>;

 return (
  <div>
   <h1 className="text-2xl font-bold">Conversaciones</h1>
   <p className="text-gray-500">Historial de conversaciones IA.</p>
   <div className="mt-6 space-y-3">
    {conversations.length === 0 ? (
      <p>No existen conversaciones registradas.</p>
    ) : conversations.map((item)=>(
      <div key={item.id} className="rounded-lg border p-4">
       <p>Conversación #{item.id}</p>
       <p className="text-sm text-gray-500">{item.created_at}</p>
      </div>
    ))}
   </div>
  </div>
 );
}

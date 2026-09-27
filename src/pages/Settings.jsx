import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAIConfig } from '../services/aiConfig';
import { getRestaurantAIContext } from '../services/n8n';

export default function Settings(){
 const { restaurant } = useAuth();
 const [config,setConfig] = useState(null);
 const [context,setContext] = useState(null);

 useEffect(()=>{
  if(restaurant?.id){
   getAIConfig(restaurant.id).then(setConfig).catch(console.error);
   getRestaurantAIContext(restaurant.id).then(setContext).catch(console.error);
  }
 },[restaurant]);

 return (
  <div>
   <h1 className="text-2xl font-bold">Configuración IA</h1>
   <p className="text-gray-500">Configuración del asistente del restaurante.</p>
   <div className="mt-4 rounded-lg border p-4">
    <p>Restaurante: {restaurant?.name || 'Cargando...'}</p>
    <p>Configuración IA: {config ? 'Disponible' : 'Sin configurar'}</p>
    <p>Contexto n8n: {context ? 'Preparado' : 'Pendiente'}</p>
   </div>
  </div>
 );
}

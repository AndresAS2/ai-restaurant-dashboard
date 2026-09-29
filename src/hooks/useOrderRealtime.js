import {useEffect,useState} from 'react';
import {supabase} from '../services/supabase';
export function useOrderRealtime(restaurantId,refresh) {
 const [state,setState]=useState('Actualización cada 15 segundos');
 useEffect(()=>{
  if(!restaurantId||import.meta.env.VITE_SUPABASE_REALTIME!=='true')return;
  let alive=true,timer;
  const changed=()=>{clearTimeout(timer);timer=setTimeout(refresh,250);};
  const channel=supabase.channel('dashboard-orders-'+restaurantId+'-'+crypto.randomUUID())
   .on('postgres_changes',{event:'INSERT',schema:'public',table:'orders',filter:'restaurant_id=eq.'+restaurantId},changed)
   .on('postgres_changes',{event:'UPDATE',schema:'public',table:'orders',filter:'restaurant_id=eq.'+restaurantId},changed)
   .on('postgres_changes',{event:'INSERT',schema:'public',table:'order_items',filter:'restaurant_id=eq.'+restaurantId},changed)
   .on('postgres_changes',{event:'UPDATE',schema:'public',table:'order_items',filter:'restaurant_id=eq.'+restaurantId},changed)
   .subscribe(status=>{if(alive)setState(status==='SUBSCRIBED'?'Canal conectado · respaldo cada 15 segundos':'Actualización cada 15 segundos');});
  return()=>{alive=false;clearTimeout(timer);supabase.removeChannel(channel);};
 },[restaurantId,refresh]);
 return state;
}


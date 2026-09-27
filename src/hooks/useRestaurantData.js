import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

export function useRestaurantData(){
 const { user } = useAuth();
 const [restaurant,setRestaurant]=useState(null);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState(null);

 useEffect(()=>{
  async function load(){
   if(!user){setLoading(false);return;}
   const {data,error}=await supabase
    .from('restaurant_users')
    .select('restaurant_id, restaurants(*)')
    .eq('user_id',user.id)
    .single();

   if(error) setError(error);
   else setRestaurant(data?.restaurants);
   setLoading(false);
  }
  load();
 },[user]);

 return {restaurant,loading,error};
}

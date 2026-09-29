import {supabase} from './supabase';
import {saved} from './data';
import {getAIConfig} from './aiConfig';
export async function getRestaurantProfile(id){
 const [settings,result]=await Promise.all([getAIConfig(id),supabase.from('restaurants').select('*').eq('id',id).single()]);
 if(result.error)throw result.error;
 return {settings,restaurant:result.data};
}
export async function saveRestaurantIdentity(id,profile){
 if(!profile.name?.trim())throw new Error('Escribe el nombre del restaurante.');
 return saved(supabase.from('restaurants').update({name:profile.name.trim(),whatsapp_number:profile.whatsapp_number?.trim()||null}).eq('id',id));
}


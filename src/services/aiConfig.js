import {supabase} from './supabase';
import {saved} from './data';
export async function getAIConfig(id){if(!id)return null;const {data,error}=await supabase.from('restaurant_settings').select('*').eq('restaurant_id',id).maybeSingle();if(error)throw error;return data;}
export async function saveAIConfig(id,patch){
 if(!id)throw new Error('Selecciona un restaurante.');
 const previous=await getAIConfig(id);
 const config={...(previous?.config||{}),...patch};
 const payload={config};
 if (!previous) return saved(supabase.from('restaurant_settings').insert({...payload,restaurant_id:id,language:'es',currency:'COP',timezone:'America/Bogota'}));
 const query=supabase.from('restaurant_settings').update(payload).eq('id',previous.id).eq('restaurant_id',id);
 return saved(previous.config===null?query.is('config',null):query.eq('config',JSON.stringify(previous.config)));
}

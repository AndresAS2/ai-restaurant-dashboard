import {supabase} from './supabase';
export const isOwner=user=>user?.email?.toLowerCase()==='suarezjulian2227@gmail.com';
export async function getOwnerUsage(month){
 const {data,error}=await supabase.rpc('owner_usage_report',{p_month:month+'-01'});
 if(error)throw new Error('No se pudo cargar ADMIN. '+error.message);
 return data;
}
export async function saveOwnerFinance(restaurant,month,values){
 const {error}=await supabase.rpc('save_owner_finance',{p_restaurant:restaurant,p_month:month+'-01',p_values:values});
 if(error)throw new Error('No se pudo guardar. '+error.message);
}

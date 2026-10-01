import { supabase } from './supabase';
export async function rows(table,id,columns='*'){
 if(!id) return [];
 const result=[];
 for(let offset=0;;offset+=1000){
 const {data,error}=await supabase.from(table).select(columns).eq('restaurant_id',id).order('id').range(offset,offset+999);
 if(error)throw error;result.push(...data);if(data.length<1000)return result;
 }
}
export async function saved(query){const {data,error}=await query.select().single();if(error)throw error;return data;}

import {rows,saved} from './data';
import {supabase} from './supabase';
export async function getMenu(id){const [categories,products]=await Promise.all([rows('menu_categories',id),rows('menu_products',id)]);return {categories,products};}
export async function saveProduct(id,p){
 const price=Number(p.price);
 if(!p.name?.trim()||String(p.price).trim()===''||!Number.isFinite(price)||price<0)throw new Error('Indica nombre y precio válido.');
 if(p.category_id){const {data,error}=await supabase.from('menu_categories').select('id').eq('restaurant_id',id).eq('id',p.category_id).single();if(error||!data)throw new Error('La categoría no pertenece al restaurante.');}
 const payload={name:p.name.trim(),description:p.description||'',price,available:!!p.available,category_id:p.category_id||null};
 return saved(p.id?supabase.from('menu_products').update(payload).eq('restaurant_id',id).eq('id',p.id):supabase.from('menu_products').insert({...payload,id:crypto.randomUUID(),restaurant_id:id}));
}
export function saveCategory(id,c){if(!c.name?.trim())throw new Error('Escribe el nombre de la categoría.');const payload={name:c.name.trim(),active:c.active!==false};return saved(c.id?supabase.from('menu_categories').update(payload).eq('restaurant_id',id).eq('id',c.id):supabase.from('menu_categories').insert({...payload,id:crypto.randomUUID(),restaurant_id:id}));}

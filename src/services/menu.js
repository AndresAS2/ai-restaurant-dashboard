import {rows,saved} from './data';
import {supabase} from './supabase';
import {validateProduct} from './menuValidation';
export async function getMenu(id){const [categories,products]=await Promise.all([rows('menu_categories',id),rows('menu_products',id)]);categories.sort((a,b)=>(a.sort_order||0)-(b.sort_order||0)||a.name.localeCompare(b.name));return {categories,products};}
export async function saveProduct(id,p){
 const validated=validateProduct(p);
 if(p.category_id){const {data,error}=await supabase.from('menu_categories').select('id').eq('restaurant_id',id).eq('id',p.category_id).single();if(error||!data)throw new Error('La categoría no pertenece al restaurante.');}
 const payload={...validated,category_id:p.category_id||null};
 return saved(p.id?supabase.from('menu_products').update(payload).eq('restaurant_id',id).eq('id',p.id):supabase.from('menu_products').insert({...payload,id:crypto.randomUUID(),restaurant_id:id}));
}
export async function deleteProduct(id,productId){
 const {data,error}=await supabase.rpc('delete_unused_menu_product',{p_restaurant_id:id,p_product_id:productId});
 if(error)throw new Error(error.code==='23503'?'Este producto tiene historial de pedidos. Desactívalo para conservarlo.':error.message);
 return data;
}
export async function importReviewedMenu(id,products){
 const payload=products.map(p=>({...validateProduct(p),id:p.id,category:String(p.category||'').trim()}));
 const {data,error}=await supabase.rpc('import_reviewed_menu',{p_restaurant_id:id,p_products:payload});
 if(error)throw error;return data;
}
export function saveCategory(id,c){
 const order=Number(c.sort_order||0);
 if(!c.name?.trim()||c.name.length>100)throw new Error('Escribe el nombre de la categoría (máximo 100 caracteres).');
 if(!Number.isInteger(order)||order<0||order>100000)throw new Error('El orden debe ser un entero entre 0 y 100.000.');
 const payload={name:c.name.trim(),active:c.active!==false,sort_order:order};
 return saved(c.id?supabase.from('menu_categories').update(payload).eq('restaurant_id',id).eq('id',c.id):supabase.from('menu_categories').insert({...payload,id:crypto.randomUUID(),restaurant_id:id}));
}

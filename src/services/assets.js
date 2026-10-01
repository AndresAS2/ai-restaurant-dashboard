import {supabase} from './supabase';
import {validateAsset} from './menuValidation';
export async function uploadAsset(restaurantId,file,allowPdf=false){
 validateAsset(file,allowPdf);
 if(!restaurantId||restaurantId.includes('/'))throw new Error('Selecciona un restaurante válido.');
 const ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','application/pdf':'pdf'}[file.type];
 const path=restaurantId+'/'+crypto.randomUUID()+'.'+ext;
 const {error}=await supabase.storage.from('restaurant-assets').upload(path,file,{contentType:file.type,upsert:false,cacheControl:'3600'});
 if(error)throw new Error('No se pudo subir '+file.name+': '+error.message);
 const {data}=supabase.storage.from('restaurant-assets').getPublicUrl(path);
 return {path,url:data.publicUrl,name:file.name,mime:file.type,size:file.size,active:true};
}
export async function extractMenu(restaurantId,assets){
 const {data,error}=await supabase.functions.invoke('extract-menu',{body:{restaurant_id:restaurantId,paths:assets.map(a=>a.path)}});
 if(error){let message='No se pudo extraer el menú. Puedes reintentar o cargar productos manualmente.';try{message=(await error.context.json()).error||message;}catch{}throw new Error(message);}
 if(!Array.isArray(data?.products))throw new Error('La extracción no devolvió productos válidos.');
 return data.products.map(p=>({...p,id:crypto.randomUUID(),price:p.price??'',ingredients:Array.isArray(p.ingredients)?p.ingredients.join(', '):'',available:p.available!==false,selected:true}));
}


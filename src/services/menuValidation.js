export const assetTypes=['image/jpeg','image/png','image/webp','application/pdf'];
export function validateAsset(file,allowPdf=false){
 if(!file||!assetTypes.includes(file.type)||(!allowPdf&&file.type==='application/pdf'))throw new Error('Selecciona JPG, PNG o WebP'+(allowPdf?' o PDF':'')+'.');
 if(file.size<=0||file.size>6*1024*1024)throw new Error('Cada archivo debe pesar entre 1 byte y 6 MB.');
}
export function ingredientsList(value){return (Array.isArray(value)?value:String(value||'').split(',')).map(v=>String(v).trim()).filter(Boolean);}
export function validateProduct(p){
 const price=Number(p.price),ingredients=ingredientsList(p.ingredients);
 if(!p.name?.trim()||p.name.trim().length>150||p.price===null||String(p.price??'').trim()===''||!Number.isFinite(price)||price<0||price>100000000)throw new Error('Indica nombre y precio válido (máximo 100.000.000).');
 if((p.description||'').length>2000||ingredients.length>100||ingredients.some(i=>i.length>150))throw new Error('Revisa la descripción y los ingredientes (máximo 100 de 150 caracteres).');
 const order=Number(p.sort_order||0);if(!Number.isSafeInteger(order)||order<0||order>100000)throw new Error('El orden debe ser un número entero entre 0 y 100.000.');
 return {name:p.name.trim(),price,description:p.description||'',ingredients,sort_order:order,available:p.available!==false};
}
export function paymentPatch(options){
 if(options.length>20)throw new Error('Máximo 20 métodos de pago.');
 const clean=options.map(p=>{
 if(!p.name?.trim())throw new Error('Escribe un nombre para cada método de pago.');
 if(p.image_url&&new URL(p.image_url).protocol!=='https:')throw new Error('La imagen del método debe usar HTTPS.');
 return {...p,name:p.name.trim(),number:String(p.number||'').trim(),description:String(p.description||'').trim(),active:p.active!==false};
 });
 const active=clean.filter(p=>p.active);
 return {payment_options:clean,payment_methods:[...new Set(active.map(p=>p.type||'transferencia'))],paymentMethods:active.length?active.map(p=>[p.name,p.number,p.description].filter(Boolean).join(' — ')).join('\n'):'No hay métodos de pago habilitados. Confirma con el restaurante.'};
}


const x=$json,d=x.pending_draft||{};
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
const t=norm(x.message).replace(/[.!]+$/,'').replace(/\s+/g,' ');
const confirm=/^(?:(?:si[, ]+)?(?:esta bien|esta correcto|todo bien|todo correcto|de acuerdo|confirmo(?: (?:el|mi))? pedido|confirmo)|si|correcto|confirmar|ok|okay|vale|dale)$/.test(t);
const command=/^(nuevo pedido|empezar de nuevo|reiniciar pedido|cancela(?:r)?(?: el| mi)? pedido|cancelar)$/.test(t);
// Query punctuation must not turn a question into an order confirmation.
const q=t.replace(/^[¿¡]+/,'').replace(/[?¡!]+$/,'').trim().replace(/ (?:por favor|porfa)$/,'');
let fast_route='ai',intent='general',output;
if(confirm||command){fast_route='order';intent='order';}
else if(/^(hola|buenas|buenos dias|buenas tardes|buenas noches)$/.test(t)){fast_route='reply';output=x.restaurant_config.welcome||'Hola, puedo mostrarte el menú, consultar precios o ayudarte con tu pedido.';}
else if(/^(?:(?:que|cual) (?:menu|carta) (?:tiene|tienes|hay)|(?:muestrame|mandame|enviame|dame|ver|quiero ver|quiero|tienes) (?:el |la |las |los )?(?:fotos? del )?(?:menu|carta)|(?:menu|carta))(?: por favor| porfa)?$/.test(q)){fast_route='menu';intent='menu';}
else if(d.status==='draft'&&!d.expired&&d.state?.products?.length&&!/\b(agrega|anade|quita|cambia|reemplaza|elimina|pon)\b/.test(t)&&/^(?:(?:dime |y )?cuanto (?:es|seria|sale|llevo)(?: (?:el total|todo|mi pedido|el pedido))?(?: para ver si me alcanza)?|(?:dime )?cual es el total|total(?: del pedido)?)$/.test(t)){
const products=d.state.products.map(p=>{const c=x.menu_context.products.find(c=>c.id===p.product_id&&c.available!==false);return c?{...p,price:Number(c.price)}:null;});
fast_route='reply';intent='price';
output=products.some(p=>!p)?'Un producto de tu pedido ya no está disponible. Revisemos el pedido antes de calcular el total.':'El total de tus productos es '+products.reduce((s,p)=>s+p.quantity*p.price,0).toLocaleString('es-CO')+' '+x.currency+'.'+(d.state.fulfillment==='delivery'?' El domicilio está pendiente de validar.':'');
}
if(fast_route==='ai'){
 const paymentQuery=/^(?:(?:que|cuales) (?:son los )?(?:metodos|formas|medios) de pago(?: (?:manejan|tienen|aceptan))?|como (?:puedo pagar|se puede pagar|pago)|(?:tienen|aceptan|reciben) (?:nequi|daviplata|efectivo|tarjeta|transferencia))$/.test(q);
 if(paymentQuery){
  const config=x.restaurant_config||{};
  const description=String(config.paymentMethods||'').trim();
  const methods=Array.isArray(config.payment_methods)?config.payment_methods.filter(m=>typeof m==='string'&&m.trim()):[];
  if(description||methods.length){fast_route='reply';intent='general';output='Métodos de pago del restaurante:\n'+(description||methods.join(', '));}
 }
}
if(fast_route==='ai'){
 const match=q.match(/^(?:cuanto (?:cuesta|vale)|(?:cual es el )?precio de) (?:la |el |una |un )?(.+)$/);
 if(match){
  const term=match[1].trim();
  const products=(x.menu_context?.products||[]).filter(p=>p.available!==false&&Number.isFinite(Number(p.price))&&norm(p.name).includes(term));
  if(products.length){fast_route='reply';intent='price';output=products.map(p=>p.name+': '+Number(p.price).toLocaleString('es-CO')+' '+x.currency).join('\n');}
 }
}
return {json:{...x,fast_route,intent,output,interpretation:{intent,actions:[],customer:{}}}};


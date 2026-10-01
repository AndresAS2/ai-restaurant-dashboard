const x=$json,c=x.restaurant_config||{},p=c.restaurant_profile||{};
let output,intent='general',fast_route='reply';
if(x.early_intent==='MENU_QUERY'){
 intent='menu';
 if(x.menu_context?.products?.length||(c.menu_images||[]).some(a=>a.active!==false&&/^https:\/\//i.test(a.url||'')))fast_route='menu';
 else output='El restaurante todavía no tiene productos disponibles en su menú. Podemos consultar con el equipo.';
}else if(x.early_intent==='PAYMENT_QUERY'){
 const v=typeof c.paymentMethods==='string'?c.paymentMethods.trim():'';
 const methods=Array.isArray(c.payment_methods)?c.payment_methods.filter(m=>typeof m==='string'&&m.trim()):[];
 output=v||methods.length?'Métodos de pago del restaurante:\n'+(v||methods.join(', ')):'El restaurante todavía no ha indicado sus métodos de pago. Es necesario confirmarlos con el equipo.';
 if(Array.isArray(c.payment_options)){
 const active=c.payment_options.filter(m=>m&&m.active!==false);
 output=active.length?'Métodos de pago del restaurante:\n'+active.map(m=>[m.name,m.number,m.description].filter(Boolean).join(' — ')).join('\n'):'No hay métodos de pago habilitados. Confirma con el restaurante.';
 const images=active.filter(m=>/^https:\/\//i.test(m.image_url||'')).slice(0,5);
 if(images.length)output+='\n\n'+images.map(m=>x.type==='chat'?'!['+String(m.name||'Pago').replace(/[\[\]\n]/g,'')+']('+encodeURI(m.image_url).replace(/[()]/g,c=>c==='('?'%28':'%29')+')':m.name+': '+m.image_url).join('\n\n');
 }
}else if(x.early_intent==='HOURS_QUERY'){
 const h=Array.isArray(p.hours)?p.hours.filter(h=>h&&typeof h.day==='string'):[];
 output=h.length?'Horario configurado del restaurante:\n'+h.map(h=>h.day+': '+(h.closed?'Cerrado':h.open&&h.close?h.open+'–'+h.close+(h.close<h.open?' (cierre al día siguiente)':''):'Por confirmar')).join('\n'):'El restaurante todavía no ha indicado su horario.';
}else if(x.early_intent==='LOCATION_QUERY'){
 output=typeof p.address==='string'&&p.address.trim()?'Dirección del restaurante: '+p.address.trim():'El restaurante todavía no ha indicado su dirección.';
}else output=c.welcome||'Hola, puedo mostrarte el menú, consultar precios o ayudarte con tu pedido.';
return {json:{...x,intent,fast_route,output}};

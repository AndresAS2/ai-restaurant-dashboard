const x=$json,c=x.restaurant_config||{},p=c.restaurant_profile||{};
let output,intent='general',fast_route='reply';
if(x.early_intent==='MENU_QUERY'){
 intent='menu';
 if(x.menu_context?.products?.length)fast_route='menu';
 else output='El restaurante todavía no tiene productos disponibles en su menú. Podemos consultar con el equipo.';
}else if(x.early_intent==='PAYMENT_QUERY'){
 const v=typeof c.paymentMethods==='string'?c.paymentMethods.trim():'';
 const methods=Array.isArray(c.payment_methods)?c.payment_methods.filter(m=>typeof m==='string'&&m.trim()):[];
 output=v||methods.length?'Métodos de pago del restaurante:\n'+(v||methods.join(', ')):'El restaurante todavía no ha indicado sus métodos de pago. Es necesario confirmarlos con el equipo.';
}else if(x.early_intent==='HOURS_QUERY'){
 const h=Array.isArray(p.hours)?p.hours.filter(h=>h&&typeof h.day==='string'):[];
 output=h.length?'Horario configurado del restaurante:\n'+h.map(h=>h.day+': '+(h.closed?'Cerrado':h.open&&h.close?h.open+'–'+h.close+(h.close<h.open?' (cierre al día siguiente)':''):'Por confirmar')).join('\n'):'El restaurante todavía no ha indicado su horario.';
}else if(x.early_intent==='LOCATION_QUERY'){
 output=typeof p.address==='string'&&p.address.trim()?'Dirección del restaurante: '+p.address.trim():'El restaurante todavía no ha indicado su dirección.';
}else output=c.welcome||'Hola, puedo mostrarte el menú, consultar precios o ayudarte con tu pedido.';
return {json:{...x,intent,fast_route,output}};

const x=$json;
const q=String(x.message||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/^[¿¡\s]+|[?!.\s]+$/g,'').replace(/\s+/g,' ').replace(/ (por favor|porfa)$/,'');
let early_intent='OTHER',simple_query=false;
if(/^(hola|buenas|buenos dias|buenas tardes|buenas noches)$/.test(q)){early_intent='GENERAL_QUERY';simple_query=true;}
else if(/^(menu|carta|que tienen|que precios tienen|cual es el menu|cual es la carta|que menu tienen|que menu tiene|(?:muestrame|mandame|enviame|dame|ver|quiero ver) (?:el |la )?(?:menu|carta))$/.test(q)){early_intent='MENU_QUERY';simple_query=true;}
else if(/^(?:(?:que|cuales) (?:son los )?(?:metodos|formas|medios) de pago(?: (?:manejan|tienen|aceptan))?|como (?:puedo pagar|se puede pagar|pago)|(?:tienen|aceptan|reciben) (?:nequi|daviplata|efectivo|tarjeta|transferencia))$/.test(q)){early_intent='PAYMENT_QUERY';simple_query=true;}
else if(/^(horario|horarios|cual es el horario|que horario tienen|cuales son los horarios|a que hora (?:abren|cierran))$/.test(q)){early_intent='HOURS_QUERY';simple_query=true;}
else if(/^(direccion|ubicacion|cual es la direccion|donde (?:estan|quedan|se encuentran)|donde queda el restaurante)$/.test(q)){early_intent='LOCATION_QUERY';simple_query=true;}
else if(/\b(pedido|pido|quiero|cambia|agrega|quita|domicilio|confirmo)\b/.test(q))early_intent='ORDER_QUERY';
else if(q.includes('?')||/^(que|como|cuanto|cual|tienen|aceptan)\b/.test(q))early_intent='GENERAL_QUERY';
return {json:{...x,early_intent,simple_query}};

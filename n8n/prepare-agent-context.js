const x=$json;
const c={...(x.restaurant_config||{})};
for(const k of ['test_mode','whatsapp_phone_number_id','owner_whatsapp'])delete c[k];
const d=x.pending_draft||{},s=d.state||{};
const products=(x.menu_context?.products||[]).map(({id,name,price,available,category_id})=>({id,name,price,available,category_id}));
const payload={restaurant:c,menu:{products,categories:x.menu_context?.categories||[]},customer_message:x.message,pending_draft:{status:d.status,expired:d.expired,state:s},clarification:x.clarification,intent:x.intent,rules:['Responde solo consultas. No afirmes haber añadido, cambiado o confirmado pedidos.','No inventes precios, ingredientes ni disponibilidad.','Si pide atención humana o reserva explica que integración está pendiente.','Si pide precio responde precio del catálogo sin pedir datos personales.']};
return {json:{...x,guardrailsInput:JSON.stringify(payload)}};

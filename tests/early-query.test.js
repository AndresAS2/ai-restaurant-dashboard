import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const code=n=>new Function('$json',readFileSync(new URL('../n8n/'+n+'.js',import.meta.url),'utf8'));
const classify=code('early-query-intent'),reply=code('simple-query-reply');
test('standalone queries route early; ambiguous and order messages retain full context',()=>{
 for(const [message,intent] of [['Hola','GENERAL_QUERY'],['¿Cuál es el menú?','MENU_QUERY'],['¿Aceptan Nequi?','PAYMENT_QUERY'],['¿Qué métodos de pago tienen?','PAYMENT_QUERY'],['¿Cuál es el horario?','HOURS_QUERY'],['dirección','LOCATION_QUERY']]){
 const r=classify({message}).json;assert.equal(r.early_intent,intent);assert.equal(r.simple_query,true);}
 for(const message of ['sí está bien','Cambia la bebida','Quiero domicilio','nequi','¿Aceptan Nequi? agrega dos hamburguesas','mi dirección es calle 5','cuanto llevo','¿y esa?'])assert.equal(classify({message}).json.simple_query,false);
});
test('missing configuration does not invent answers or require model',()=>{
 for(const early_intent of ['PAYMENT_QUERY','HOURS_QUERY','LOCATION_QUERY','MENU_QUERY']){
 const r=reply({early_intent,restaurant_config:{},menu_context:{products:[]}}).json;assert.equal(r.fast_route,'reply');assert.ok(r.output);}
});
test('tenant-specific responses do not leak context between requests',()=>{
 const a=reply({restaurant_id:'A',early_intent:'LOCATION_QUERY',restaurant_config:{restaurant_profile:{address:'Calle A'}}}).json;
 const b=reply({restaurant_id:'B',early_intent:'LOCATION_QUERY',restaurant_config:{restaurant_profile:{address:'Calle B'}}}).json;
 assert.match(a.output,/Calle A/);assert.doesNotMatch(b.output,/Calle A/);assert.match(b.output,/Calle B/);
});


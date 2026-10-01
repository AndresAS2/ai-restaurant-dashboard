import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const run=new Function('$json',readFileSync(new URL('../n8n/fast-chat-intent.js',import.meta.url),'utf8'));
const base={restaurant_id:'fixture',currency:'COP',restaurant_config:{paymentMethods:'Efectivo y Nequi',payment_methods:['efectivo','nequi']},menu_context:{products:[{id:'p1',name:'Hamburguesa clásica',price:22000,available:true},{id:'p2',name:'Hamburguesa doble',price:32000,available:true},{id:'p3',name:'Hamburguesa retirada',price:1,available:false}]},pending_draft:{status:'draft',state:{products:[{product_id:'p1',quantity:2}]}}};
test('simple queries avoid AI and use configured catalog and payments',()=>{
 for(const message of ['¿Tienen Nequi?','¿Qué métodos de pago manejan?','¿Cómo puedo pagar?']){const r=run({...base,message}).json;assert.equal(r.fast_route,'reply');assert.match(r.output,/Efectivo y Nequi/);assert.deepEqual(r.pending_draft,base.pending_draft);}
 const r=run({...base,message:'¿Cuál es el precio de una hamburguesa?'}).json;assert.equal(r.fast_route,'reply');assert.match(r.output,/22.000/);assert.match(r.output,/32.000/);assert.doesNotMatch(r.output,/retirada/);
 assert.equal(run({...base,message:'Muéstrame el menú'}).json.fast_route,'menu');
});
test('confirmation, total and complex requests preserve existing routes',()=>{
 for(const message of ['sí está bien','confirmo pedido','cancelar'])assert.equal(run({...base,message}).json.fast_route,'order');
 assert.match(run({...base,message:'cuanto es el total'}).json.output,/44.000/);
 for(const message of ['¿sí?','nequi','quiero una hamburguesa y pago con Nequi','¿Tienen Nequi? cambia mi pedido','si está bien pero quita una','precio de hamburguesa y agrega dos'])assert.equal(run({...base,message}).json.fast_route,'ai');
});
test('missing payment information falls back to AI without inventing details',()=>{
 assert.equal(run({...base,restaurant_config:{},message:'¿Tienen Nequi?'}).json.fast_route,'ai');
 assert.equal(run({...base,message:'precio de pizza inexistente'}).json.fast_route,'ai');
});

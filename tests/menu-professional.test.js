import test from 'node:test';
test('payment replies exclude disabled methods and menus render PDFs as links',async()=>{
 const {readFileSync}=await import('node:fs');
 const reply=new Function('$json',readFileSync(new URL('../n8n/simple-query-reply.js',import.meta.url),'utf8'));
 const r=reply({type:'chat',early_intent:'PAYMENT_QUERY',restaurant_config:{payment_options:[{name:'Nequi',number:'123',active:true,image_url:'https://example.com/qr.png'},{name:'Tarjeta secreta',active:false}]}}).json;
 assert.match(r.output,/Nequi/);assert.match(r.output,/qr.png/);assert.doesNotMatch(r.output,/Tarjeta/);
 const menu=new Function('$json',readFileSync(new URL('../n8n/menu-media-reply.js',import.meta.url),'utf8'));
 const m=menu({restaurant_config:{menu_images:[{url:'https://example.com/menu.pdf',mime:'application/pdf',caption:'Menú PDF'}]},menu_context:{products:[]}}).json;
 assert.match(m.output,/^\[Menú PDF\]/);assert.doesNotMatch(m.output,/^!/);
});
import assert from 'node:assert/strict';
import {validateAsset,validateProduct,paymentPatch} from '../src/services/menuValidation.js';
test('uploads enforce allowed types and file limits',()=>{
 assert.throws(()=>validateAsset({type:'image/svg+xml',size:100}));
 assert.throws(()=>validateAsset({type:'image/png',size:7*1024*1024}));
 assert.throws(()=>validateAsset({type:'application/pdf',size:100}));
 assert.doesNotThrow(()=>validateAsset({type:'application/pdf',size:100},true));
});
test('menu review requires actual prices and explicit ingredients',()=>{
 for(const price of ['',null,-1,'oops',Infinity])assert.throws(()=>validateProduct({name:'Pizza',price}));
 const p=validateProduct({name:' Pizza ',price:'25000',ingredients:'queso, tomate, ',available:false});
 assert.equal(p.name,'Pizza');assert.equal(p.price,25000);assert.deepEqual(p.ingredients,['queso','tomate']);assert.equal(p.available,false);
});
test('payment compatibility includes active methods only and explicit no-payment state',()=>{
 const p=paymentPatch([{id:'1',name:'Nequi',type:'nequi',number:'3000000000',active:true},{id:'2',name:'Efectivo',type:'efectivo',active:false}]);
 assert.deepEqual(p.payment_methods,['nequi']);assert.match(p.paymentMethods,/3000000000/);assert.doesNotMatch(p.paymentMethods,/Efectivo/);assert.equal(p.payment_options.length,2);
 assert.match(paymentPatch([]).paymentMethods,/No hay/);
 assert.throws(()=>paymentPatch([{name:'Nequi',image_url:'javascript:alert(1)'}]));
});

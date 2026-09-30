import {test} from 'node:test';
import assert from 'node:assert/strict';
import {summarize} from '../src/services/metrics.js';
import {customerActivity,normalizedPhone} from '../src/services/customerIdentity.js';
import {isTest} from '../src/services/format.js';
test('sales exclude test, cancelled and unfulfilled orders and use Bogota day',()=>{
 const orders=[{total:100,status:'DELIVERED',created_at:'2026-09-29T02:00:00Z'},{total:300,status:'DELIVERED',created_at:'2026-09-29T06:00:00Z'},{total:1000,status:'DELIVERED',is_test:true,created_at:'2026-09-29T02:00:00Z'},{total:999,status:'TEST',created_at:'2026-09-29T02:00:00Z'},{total:30,status:'CANCELLED',created_at:'2026-09-29T02:00:00Z'}];
 const m=summarize(orders,[],[],new Date('2026-09-29T03:00:00Z'));assert.equal(m.sales_today,100);assert.equal(m.testOrders,2);assert.equal(m.orders,3);
});
test('empty data is safe',()=>{assert.equal(summarize().sales_today,0);assert.equal(summarize().conversations,0);});
test('customer identities keep separate histories and distinguish chat sessions',()=>{
 const customers=[{id:'a',name:'Cliente',phone:'chat_unknown'},{id:'b',name:'Ana',phone:'+57 300 1234567'},{id:'c',name:'Ana',phone:'+573001234567'}];
 const result=customerActivity(customers,[{id:'o',customer_id:'b',total:10,status:'DELIVERED'}],[],isTest);
 assert.equal(normalizedPhone('chat_unknown'),'');assert.equal(result[0].display_phone,null);
 assert.equal(result[1].duplicate_phone,true);assert.equal(result[1].purchase_count,1);
 assert.equal(result[2].purchase_count,0);assert.equal(result.length,3);
});

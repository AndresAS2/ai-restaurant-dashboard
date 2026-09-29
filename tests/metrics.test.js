import {test} from 'node:test';
import assert from 'node:assert/strict';
import {summarize} from '../src/services/metrics.js';
test('sales exclude test, cancelled and unfulfilled orders and use Bogota day',()=>{
 const orders=[{total:100,status:'DELIVERED',created_at:'2026-09-29T02:00:00Z'},{total:300,status:'DELIVERED',created_at:'2026-09-29T06:00:00Z'},{total:1000,status:'DELIVERED',is_test:true,created_at:'2026-09-29T02:00:00Z'},{total:999,status:'TEST',created_at:'2026-09-29T02:00:00Z'},{total:30,status:'CANCELLED',created_at:'2026-09-29T02:00:00Z'}];
 const m=summarize(orders,[],[],new Date('2026-09-29T03:00:00Z'));assert.equal(m.sales_today,100);assert.equal(m.testOrders,2);assert.equal(m.orders,3);
});
test('empty data is safe',()=>{assert.equal(summarize().sales_today,0);assert.equal(summarize().conversations,0);});

import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateFinance} from '../src/services/financeMath.js';
import {extractUsage} from '../n8n/extract-usage.js';
test('costs recalculate across currencies, preserve missing data and permit negative margins',()=>{
 const u={tokens_used:1000000,input_tokens:800000,output_tokens:200000,unmeasured_executions:0};
 const f={plan_price_cop:100000,usd_cop:4000,input_rate_usd:1,output_rate_usd:2,services:[{amount:10,currency:'USD'},{amount:4000,currency:'COP'}]};
 const r=calculateFinance(u,f);assert.equal(r.ai,1.2);assert.equal(r.total,12.2);assert.equal(r.margin,51.2);
 assert.equal(calculateFinance({...u,unmeasured_executions:1},f).total,null);
 assert.equal(calculateFinance(u,{...f,usd_cop:''}).total,null);
 assert.ok(calculateFinance(u,{...f,plan_price_cop:1}).margin<0);
 assert.equal(calculateFinance(u,null).total,null);
});
test('metering counts agent totals once, rejects unsafe tenant attribution and incomplete traces',()=>{
 const e={id:'1',workflowId:'xQQohsOmooxDCDxB',startedAt:'2026-09-01T00:00:00Z',stoppedAt:'2026-09-01T00:00:01Z',status:'success',mode:'manual',data:{resultData:{runData:{'Intent Classifier AI Real':[{metadata:{tracing:{'llm.tokens.in':10,'llm.tokens.out':2,'llm.tokens.total':12,'llm.tokens.estimated':false}}}],'Google Gemini Chat Model':[{metadata:{tracing:{'llm.tokens.total':12}}}],'SaaS Tenant Resolver':[{data:{main:[[{json:{restaurant_id:'forged',tenant_valid:false}}]]}}]}}}};
 assert.equal(extractUsage(e).total_tokens,12);assert.equal(extractUsage(e).restaurant_id,null);
 delete e.data.resultData.runData['Intent Classifier AI Real'][0].metadata;
 assert.equal(extractUsage(e).measurement,'unavailable');assert.equal(extractUsage(e).total_tokens,null);
});

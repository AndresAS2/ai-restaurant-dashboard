import test from 'node:test';
import assert from 'node:assert/strict';
import {providerFailure} from '../supabase/functions/extract-menu/provider-error.js';
test('provider errors are actionable and never echo secret provider text',()=>{
 const cases=[[400,{error:{message:'secret-key',details:[{reason:'API_KEY_INVALID'}]}},'KEY_INVALID'],[403,{},'ACCESS_DENIED'],[404,{},'MODEL_UNAVAILABLE'],[429,{},'QUOTA_EXCEEDED'],[400,{},'REQUEST_REJECTED'],[503,{},'PROVIDER_UNAVAILABLE']];
 for(const [status,payload,code] of cases){const result=providerFailure(status,payload);assert.equal(result.code,code);assert.doesNotMatch(result.message,/secret-key/);}
});


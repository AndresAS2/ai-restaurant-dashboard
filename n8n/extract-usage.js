export function extractUsage(e){
 const runs=e.data?.resultData?.runData;
 if(!runs||!e.id||!e.startedAt||e.workflowId!=='xQQohsOmooxDCDxB')return null;
 if(!['success','error','canceled','crashed'].includes(e.status))return null;
 const contexts=['Restore Pending Context','Restaurant Context and Policies','SaaS Tenant Resolver'].flatMap(name=>(runs[name]||[]).flatMap(r=>r.data?.main?.flat().filter(Boolean).map(i=>i.json)||[]));
 const context=contexts.find(c=>c?.restaurant_id&&c.tenant_valid===true);
 const restaurant_id=context?.restaurant_id||null;
 const agents=['Intent Classifier AI Real','Virtual waiter','Guardrails'];
 let input=0,output=0,total=0,agentRuns=0,unknown=false,estimated=false;
 for(const name of agents)for(const run of runs[name]||[]){
   // Guardrails only counts if it actually reports model usage.
   const t=run.metadata?.tracing;
   if(name==='Guardrails'&&!t?.['llm.tokens.total'])continue;
   agentRuns++;
   const values=['llm.tokens.in','llm.tokens.out','llm.tokens.total'].map(k=>t?.[k]);
   if(values.some(v=>!Number.isSafeInteger(v)||v<0)){unknown=true;continue;}
   input+=values[0];output+=values[1];total+=values[2];
   if(t['llm.tokens.estimated']!==false)estimated=true;
 }
 // Unrecognised model activity must not silently become a zero bill.
 const modelActivity=Object.keys(runs).some(n=>/Gemini|OpenAI|Chat Model/i.test(n));
 if(!agentRuns&&modelActivity)unknown=true;
 const measurement=unknown?'unavailable':estimated?'estimated':agentRuns?'provider':'no_ai';
 const normalized=runs.Normalize?.[0]?.data?.main?.[0]?.[0]?.json;
 return {workflow_id:e.workflowId,execution_id:String(e.id),restaurant_id,started_at:e.startedAt,finished_at:e.stoppedAt||null,
 status:e.status,is_test:normalized?.type?normalized.type==='chat':e.mode==='manual',
 input_tokens:unknown?null:input,output_tokens:unknown?null:output,total_tokens:unknown?null:total,
 measurement,agent_runs:agentRuns,duration_ms:e.stoppedAt?Math.max(0,Date.parse(e.stoppedAt)-Date.parse(e.startedAt)):null};
}

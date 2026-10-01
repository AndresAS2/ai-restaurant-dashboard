const value=n=>n==null||n===''||!Number.isFinite(Number(n))||Number(n)<0?null:Number(n);
export function calculateFinance(usage,finance){
 const f=finance||{},rate=value(f.usd_cop),price=value(f.plan_price_cop);
 const input=value(f.input_rate_usd),output=value(f.output_rate_usd);
 const measured=usage.tokens_used!=null&&usage.unmeasured_executions===0;
 const ai=measured?(Number(usage.tokens_used)===0?0:input!=null&&output!=null?(Number(usage.input_tokens)*input+Number(usage.output_tokens)*output)/1000000:null):null;
 const services=f.services||[];
 const serviceTotal=services.reduce((sum,s)=>value(s.amount)==null?NaN:s.currency==='USD'?sum+value(s.amount):s.currency==='COP'&&rate>0?sum+value(s.amount)/rate:NaN,0);
 const total=finance&&ai!=null&&Number.isFinite(serviceTotal)?ai+serviceTotal:null;
 const margin=total!=null&&price>0&&rate>0?(price-total*rate)/price*100:null;
 return {ai,total,margin};
}
export const emptyFinance=()=>({plan_name:'',plan_price_cop:'',usd_cop:'',input_rate_usd:'',output_rate_usd:'',source_note:'',services:[]});

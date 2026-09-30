WITH p AS (SELECT $1::jsonb j),
usage_log AS (
INSERT INTO private.ai_execution_usage(workflow_id,execution_id,restaurant_id,started_at,status,is_test,input_tokens,output_tokens,total_tokens,measurement,agent_runs)
SELECT 'xQQohsOmooxDCDxB',$2,j->>'restaurant_id',$3::timestamptz,'response_prepared',true,
CASE WHEN $4::boolean THEN null ELSE 0 END,
CASE WHEN $4::boolean THEN null ELSE 0 END,
CASE WHEN $4::boolean THEN null ELSE 0 END,
CASE WHEN $4::boolean THEN 'unavailable' ELSE 'no_ai' END,0
FROM p WHERE j->>'type'='chat' AND $3::text IS NOT NULL
ON CONFLICT(workflow_id,execution_id) DO NOTHING RETURNING execution_id
),
c AS (INSERT INTO public.customers(id,restaurant_id,phone,name)
SELECT COALESCE((SELECT id FROM public.customers WHERE restaurant_id=j->>'restaurant_id' AND phone=j->>'phone' ORDER BY created_at LIMIT 1),'n8n-customer:'||md5(jsonb_build_array(j->>'restaurant_id',j->>'phone')::text)),j->>'restaurant_id',j->>'phone',NULLIF(j->>'customer_name','') FROM p
ON CONFLICT(id) DO UPDATE SET name=COALESCE(EXCLUDED.name,customers.name) RETURNING id),
h AS (INSERT INTO public.conversation_history(id,restaurant_id,customer_id,channel,message,direction,metadata)
SELECT md5($2||v.direction)::uuid,j->>'restaurant_id',c.id,j->>'type',v.message,v.direction,jsonb_build_object('is_test',true,'execution_id',$2,'intent',j->>'intent','session_id',j->>'phone')
FROM p,c CROSS JOIN LATERAL (VALUES ('incoming',j->>'message'),('outgoing',j->>'output')) v(direction,message)
ON CONFLICT(id) DO NOTHING RETURNING id),
e AS (INSERT INTO public.customer_events(id,restaurant_id,customer_id,event_type,message,metadata)
SELECT md5($2||'event')::uuid,j->>'restaurant_id',c.id,COALESCE(j->>'event_type','customer_interaction'),j->>'message',jsonb_build_object('is_test',true,'intent',j->>'intent','order_id',j->>'order_id','execution_id',$2) FROM p,c ON CONFLICT(id) DO NOTHING RETURNING id)
SELECT j AS context,(SELECT id FROM c) customer_id FROM p;

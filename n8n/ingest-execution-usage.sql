insert into private.ai_execution_usage(workflow_id,execution_id,restaurant_id,started_at,finished_at,status,is_test,input_tokens,output_tokens,total_tokens,measurement,agent_runs,duration_ms)
select workflow_id,execution_id,restaurant_id,started_at,finished_at,status,is_test,input_tokens,output_tokens,total_tokens,measurement,agent_runs,duration_ms
from jsonb_to_recordset($1::jsonb) as x(workflow_id text,execution_id text,restaurant_id text,started_at timestamptz,finished_at timestamptz,status text,is_test boolean,input_tokens bigint,output_tokens bigint,total_tokens bigint,measurement text,agent_runs integer,duration_ms bigint)
where workflow_id='xQQohsOmooxDCDxB'
on conflict(workflow_id,execution_id) do update set restaurant_id=excluded.restaurant_id,input_tokens=excluded.input_tokens,output_tokens=excluded.output_tokens,total_tokens=excluded.total_tokens,measurement=excluded.measurement,status=excluded.status,finished_at=excluded.finished_at,agent_runs=excluded.agent_runs,duration_ms=excluded.duration_ms,synced_at=now()
returning execution_id;

import {useState} from 'react';
import {Navigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {supabase} from '../services/supabase';
export default function Login(){
 const {session,configured}=useAuth(),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 if(session)return <Navigate to="/dashboard" replace/>;
 async function submit(e){e.preventDefault();setBusy(true);setError('');try{const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});if(error)throw error;}catch(e){setError(e.message);}finally{setBusy(false);}}
 return <main className="min-h-screen grid place-items-center p-6"><form onSubmit={submit} className="panel w-full max-w-md space-y-5"><p className="eyebrow">AI RESTAURANT</p><h1 className="text-3xl font-semibold">Tu operación empieza aquí</h1><p className="text-slate-500">Consulta pedidos y conversaciones, y mantén tu menú al día.</p>{!configured&&<p role="alert" className="notice">Falta configurar la conexión a Supabase. Consulta el archivo .env.example.</p>}<label>Correo<input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Contraseña<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<p className="notice error" role="alert">{error}</p>}<button className="primary w-full" disabled={busy||!configured}>{busy?'Entrando…':'Ingresar'}</button><p className="text-xs text-slate-500">Necesitas una cuenta de acceso asociada a tu restaurante.</p></form></main>;
}

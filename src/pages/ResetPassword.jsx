import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {supabase} from '../services/supabase';

export default function ResetPassword(){
 const navigate=useNavigate();
 const [password,setPassword]=useState('');
 const [confirmPassword,setConfirmPassword]=useState('');
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const [message,setMessage]=useState('');

 async function submit(e){
  e.preventDefault();setError('');setMessage('');
  if(password.length<8){setError('La contraseña debe tener al menos 8 caracteres.');return;}
  if(password!==confirmPassword){setError('Las contraseñas no coinciden.');return;}
  setBusy(true);
  try{
   const {error}=await supabase.auth.updateUser({password});
   if(error)throw error;
   setMessage('Contraseña actualizada correctamente. Ya puedes iniciar sesión.');
   setTimeout(async()=>{await supabase.auth.signOut();navigate('/login');},1200);
  }catch(e){setError(e.message||'No se pudo cambiar la contraseña.');}
  finally{setBusy(false);}
 }

 return <main className="min-h-screen grid place-items-center p-6">
  <form onSubmit={submit} className="panel w-full max-w-md space-y-5">
   <p className="eyebrow">AI RESTAURANT</p>
   <h1 className="text-3xl font-semibold">Crear nueva contraseña</h1>
   <p className="text-slate-500">Ingresa una contraseña nueva para tu cuenta.</p>
   <label>Nueva contraseña<input required type="password" minLength={8} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)}/></label>
   <label>Confirmar contraseña<input required type="password" minLength={8} autoComplete="new-password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}/></label>
   {error&&<p className="notice error" role="alert">{error}</p>}
   {message&&<p className="notice" role="status">{message}</p>}
   <button className="primary w-full" disabled={busy}>{busy?'Actualizando…':'Guardar nueva contraseña'}</button>
  </form>
 </main>;
}

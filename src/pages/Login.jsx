import {useState} from 'react';
import {Navigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {supabase} from '../services/supabase';
import {signUpRestaurant} from '../services/restaurantRegistration';

export default function Login(){
 const {session,configured,logoutError,clearLogoutError}=useAuth();
 const [mode,setMode]=useState('login');
 const [restaurantName,setRestaurantName]=useState('');
 const [email,setEmail]=useState('');
 const [password,setPassword]=useState('');
 const [confirmPassword,setConfirmPassword]=useState('');
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const [message,setMessage]=useState('');

 if(session)return <Navigate to="/dashboard" replace/>;

 function resetFeedback(){setError('');setMessage('');clearLogoutError();}

 async function submitLogin(e){
  e.preventDefault();setBusy(true);resetFeedback();
  try{
   const {error}=await supabase.auth.signInWithPassword({email:email.trim().toLowerCase(),password});
   if(error)throw error;
  }catch(e){setError(e.message);}
  finally{setBusy(false);}
 }

 async function submitRegister(e){
  e.preventDefault();setBusy(true);resetFeedback();
  try{
   if(password!==confirmPassword)throw new Error('Las contraseñas no coinciden.');
   const data=await signUpRestaurant({restaurantName,email,password});
   if(data?.session)return;
   setMessage('Registro recibido. Revisa tu correo para confirmar la cuenta. Después podrás iniciar sesión y tu restaurante aparecerá como pendiente de aprobación.');
   setPassword('');
   setConfirmPassword('');
  }catch(e){setError(e.message);}
  finally{setBusy(false);}
 }

 async function submitRecovery(e){
  e.preventDefault();setBusy(true);resetFeedback();
  try{
   const cleanEmail=email.trim().toLowerCase();
   if(!cleanEmail)throw new Error('Ingresa el correo de tu cuenta.');
   const {error}=await supabase.auth.resetPasswordForEmail(cleanEmail,{
    redirectTo:window.location.origin+'/reset-password'
   });
   if(error)throw error;
   setMessage('Te enviamos un enlace para cambiar tu contraseña. Revisa tu correo.');
  }catch(e){
   const text=String(e.message||'');
   setError(text.toLowerCase().includes('rate limit')?'Se alcanzó temporalmente el límite de correos. Espera un poco y vuelve a intentarlo.':text);
  }finally{setBusy(false);}
 }

 const title=mode==='login'?'Tu operación empieza aquí':mode==='register'?'Crear restaurante':'Recuperar contraseña';
 const subtitle=mode==='login'
  ?'Consulta pedidos y conversaciones, y mantén tu menú al día.'
  :mode==='register'
   ?'Crea tu acceso. El restaurante quedará pendiente de aprobación antes de usar el sistema.'
   :'Escribe tu correo y te enviaremos un enlace seguro para crear una contraseña nueva.';

 return <main className="min-h-screen grid place-items-center p-6">
  <form onSubmit={mode==='login'?submitLogin:mode==='register'?submitRegister:submitRecovery} className="panel w-full max-w-md space-y-5">
   <p className="eyebrow">AI RESTAURANT</p>
   <h1 className="text-3xl font-semibold">{title}</h1>
   <p className="text-slate-500">{subtitle}</p>

   {!configured&&<p role="alert" className="notice">Falta configurar la conexión a Supabase. Consulta el archivo .env.example.</p>}

   {mode!=='forgot'&&<div className="grid grid-cols-2 gap-2">
    <button type="button" className={mode==='login'?'primary':'secondary'} onClick={()=>{setMode('login');resetFeedback();}}>Ingresar</button>
    <button type="button" className={mode==='register'?'primary':'secondary'} onClick={()=>{setMode('register');resetFeedback();}}>Crear restaurante</button>
   </div>}

   {mode==='register'&&<label>Nombre del restaurante
    <input required value={restaurantName} onChange={e=>setRestaurantName(e.target.value)} placeholder="Ej: La Esquina Burger"/>
   </label>}

   <label>Correo
    <input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@gmail.com"/>
   </label>

   {mode!=='forgot'&&<label>Contraseña
    <input required type="password" minLength={8} autoComplete={mode==='login'?'current-password':'new-password'} value={password} onChange={e=>setPassword(e.target.value)}/>
   </label>}

   {mode==='login'&&<button type="button" className="text-sm font-medium text-emerald-700 hover:underline" onClick={()=>{setMode('forgot');setPassword('');resetFeedback();}}>¿Olvidaste tu contraseña?</button>}

   {mode==='register'&&<label>Confirmar contraseña
    <input required type="password" minLength={8} autoComplete="new-password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}/>
   </label>}

   {(error||logoutError)&&<p className="notice error" role="alert">{error||logoutError}</p>}
   {message&&<p className="notice" role="status">{message}</p>}

   <button className="primary w-full" disabled={busy||!configured}>
    {busy?'Procesando…':mode==='login'?'Ingresar':mode==='register'?'Crear restaurante':'Enviar enlace de recuperación'}
   </button>

   {mode==='forgot'&&<button type="button" className="secondary w-full" onClick={()=>{setMode('login');resetFeedback();}}>Volver a iniciar sesión</button>}

   <p className="text-xs text-slate-500">
    {mode==='login'?'¿Nuevo restaurante? Usa “Crear restaurante” para solicitar acceso.':'Tus datos quedan separados de los demás restaurantes.'}
   </p>
  </form>
 </main>;
}

import {Navigate,Outlet} from 'react-router-dom';
import {useState} from 'react';
import {useAuth} from '../context/AuthContext';

export default function ProtectedRoute(){
 const {session,loading,restaurant,registrationRequest,error,configured,signOut,refreshAccess}=useAuth();
 const [exitError,setExitError]=useState('');
 const [exiting,setExiting]=useState(false);

 async function exit(){
  setExiting(true);setExitError('');
  try{await signOut();}
  catch(e){setExitError(e.message||'No se pudo cerrar la sesión. Intenta nuevamente.');}
  finally{setExiting(false);}
 }

 if(!configured)return <Navigate to="/login" replace/>;
 if(loading)return <main className="p-8">Cargando sesión…</main>;
 if(!session)return <Navigate to="/login" replace/>;

 if(!restaurant){
  const pending=registrationRequest?.status==='pending';
  const rejected=registrationRequest?.status==='rejected';

  return <main className="max-w-lg mx-auto mt-16 panel">
   <p className="eyebrow">AI RESTAURANT</p>
   <h1 className="text-xl font-semibold">{pending?'Registro en verificación':rejected?'Solicitud no aprobada':'Acceso pendiente'}</h1>
   <p className="my-4">
    {pending
     ?'Tu cuenta fue creada correctamente. El administrador debe aprobar el restaurante antes de habilitar el dashboard.'
     :rejected
      ?'La solicitud de este restaurante fue rechazada. Contacta al administrador si necesitas una revisión.'
      :error||'Tu cuenta aún no está asociada a un restaurante.'}
   </p>

   {registrationRequest&&<div className="notice mb-4">
    <p><strong>Restaurante:</strong> {registrationRequest.restaurant_name}</p>
    <p><strong>Correo:</strong> {registrationRequest.email}</p>
    <p><strong>Estado:</strong> {registrationRequest.status}</p>
   </div>}

   {!registrationRequest&&<p className="text-sm mb-4">{session.user.email}</p>}
   {exitError&&<p role="alert" className="notice error">{exitError}</p>}

   <div className="flex flex-wrap gap-3">
    {pending&&<button className="primary" onClick={refreshAccess}>Revisar estado</button>}
    <button className="secondary" disabled={exiting} onClick={exit}>{exiting?'Cerrando…':'Cerrar sesión'}</button>
   </div>
  </main>;
 }

 return <Outlet/>;
}

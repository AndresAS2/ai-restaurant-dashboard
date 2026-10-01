import {Navigate,Outlet} from 'react-router-dom';
import {useState} from 'react';
import {useAuth} from '../context/AuthContext';
export default function ProtectedRoute(){
 const {session,loading,restaurant,error,configured,signOut}=useAuth();
 const [exitError,setExitError]=useState(''),[exiting,setExiting]=useState(false);
 async function exit(){setExiting(true);setExitError('');try{await signOut();}catch(e){setExitError(e.message||'No se pudo cerrar la sesión. Intenta nuevamente.');}finally{setExiting(false);}}
 if(!configured)return <Navigate to="/login" replace/>;
 if(loading)return <main className="p-8">Cargando sesión…</main>;
 if(!session)return <Navigate to="/login" replace/>;
 if(!restaurant)return <main className="max-w-lg mx-auto mt-16 panel"><h1 className="text-xl font-semibold">Acceso pendiente</h1><p className="my-4">{error||'Tu cuenta aún no está asociada a un restaurante. Solicita al administrador que complete el acceso.'}</p><p className="text-sm mb-4">{session.user.email}</p>{exitError&&<p role="alert" className="notice error">{exitError}</p>}<button className="secondary" disabled={exiting} onClick={exit}>{exiting?'Cerrando…':'Cerrar sesión'}</button></main>;
 return <Outlet/>;
}

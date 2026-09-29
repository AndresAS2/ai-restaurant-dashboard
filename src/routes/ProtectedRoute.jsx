import {Navigate,Outlet} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
export default function ProtectedRoute(){
 const {session,loading,restaurant,error,configured,signOut}=useAuth();
 if(!configured)return <Navigate to="/login" replace/>;
 if(loading)return <main className="p-8">Cargando sesión…</main>;
 if(!session)return <Navigate to="/login" replace/>;
 if(!restaurant)return <main className="max-w-lg mx-auto mt-16 panel"><h1 className="text-xl font-semibold">Acceso pendiente</h1><p className="my-4">{error||'Tu cuenta aún no está asociada a un restaurante. Solicita al administrador que complete el acceso.'}</p><p className="text-sm mb-4">{session.user.email}</p><button className="secondary" onClick={()=>signOut().catch(()=>{})}>Cerrar sesión</button></main>;
 return <Outlet/>;
}

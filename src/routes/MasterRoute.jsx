import {Navigate,Outlet} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
export default function MasterRoute(){const {session,loading,isMaster}=useAuth();if(loading)return <p>Cargando sesión…</p>;if(!session)return <Navigate to="/login" replace/>;if(!isMaster)return <Navigate to="/dashboard" replace/>;return <Outlet/>;}

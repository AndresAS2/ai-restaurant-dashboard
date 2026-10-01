import {Navigate,Outlet} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {isOwner} from '../services/ownerAdmin';
export default function OwnerRoute(){const {user}=useAuth();return isOwner(user)?<Outlet/>:<Navigate to="/dashboard" replace/>;}

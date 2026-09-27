import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';

export default function AppRoutes(){
 return <Routes>
  <Route path="/login" element={<Login/>}/>
  <Route element={<ProtectedRoute/>}>
   <Route element={<DashboardLayout/>}>
    <Route path="/" element={<Dashboard/>}/>
   </Route>
  </Route>
 </Routes>
}

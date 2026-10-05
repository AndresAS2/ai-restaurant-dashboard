import {lazy,Suspense} from 'react';
import {Routes,Route,Navigate} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import MasterRoute from './routes/MasterRoute';
import OwnerRoute from './routes/OwnerRoute';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import DashboardLayout from './layouts/DashboardLayout';

const MasterLayout=lazy(()=>import('./layouts/MasterLayout'));
const Dashboard=lazy(()=>import('./pages/Dashboard'));
const Orders=lazy(()=>import('./pages/Orders'));
const Menu=lazy(()=>import('./pages/Menu'));
const Customers=lazy(()=>import('./pages/Customers'));
const Conversations=lazy(()=>import('./pages/Conversations'));
const Settings=lazy(()=>import('./pages/Settings'));
const AISettings=lazy(()=>import('./pages/AISettings'));
const AITestChat=lazy(()=>import('./pages/AITestChat'));
const MasterRestaurants=lazy(()=>import('./pages/MasterRestaurants'));
const MasterUsers=lazy(()=>import('./pages/MasterUsers'));
const MasterCreateUser=lazy(()=>import('./pages/MasterCreateUser'));
const PendingModule=lazy(()=>import('./pages/PendingModule'));
const OwnerAdmin=lazy(()=>import('./pages/OwnerAdmin'));

export default function App(){
 return <AuthProvider>
  <Suspense fallback={<main className="p-8" role="status">Cargando pantalla…</main>}>
   <Routes>
    <Route path="/login" element={<Login/>}/>
    <Route path="/reset-password" element={<ResetPassword/>}/>

    <Route element={<ProtectedRoute/>}>
     <Route element={<DashboardLayout/>}>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/orders" element={<Orders/>}/>
      <Route path="/menu" element={<Menu/>}/>
      <Route path="/customers" element={<Customers/>}/>
      <Route path="/conversations" element={<Conversations/>}/>
      <Route path="/settings" element={<Settings/>}/>
      <Route path="/training" element={<AISettings/>}/>
      <Route path="/ai-test" element={<AITestChat/>}/>
      <Route path="/loyalty" element={<PendingModule title="Fidelización"/>}/>
      <Route element={<OwnerRoute/>}>
       <Route path="/admin" element={<OwnerAdmin/>}/>
      </Route>
     </Route>
    </Route>

    <Route element={<MasterRoute/>}>
     <Route element={<MasterLayout/>}>
      <Route path="/master/restaurants" element={<MasterRestaurants/>}/>
      <Route path="/master/users" element={<MasterUsers/>}/>
      <Route path="/master/users/create" element={<MasterCreateUser/>}/>
     </Route>
    </Route>

    <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
   </Routes>
  </Suspense>
 </AuthProvider>;
}

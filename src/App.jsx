import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import MasterRoute from './routes/MasterRoute';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import DashboardLayout from './layouts/DashboardLayout';
import MasterLayout from './layouts/MasterLayout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Menu from './pages/Menu';
import Customers from './pages/Customers';
import Conversations from './pages/Conversations';
import Settings from './pages/Settings';
import AITestChat from './pages/AITestChat';
import MasterRestaurants from './pages/MasterRestaurants';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/conversations" element={<Conversations />} />
            <Route path="/ai-test" element={<AITestChat />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route element={<MasterRoute />}>
          <Route element={<MasterLayout />}>
            <Route path="/master/restaurants" element={<MasterRestaurants />} />
            <Route path="/master/restaurants/create" element={<Navigate to="/master/restaurants" replace />} />
            <Route path="/master/users/create" element={<Navigate to="/master/restaurants" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </AuthProvider>
  );
}

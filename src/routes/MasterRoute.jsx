import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MasterRoute() {
  const { session, loading, isMasterAdmin } = useAuth();

  if (loading) {
    return <div className="p-8">Cargando sesión...</div>;
  }

  if (!session?.user) {
    return <Navigate to="/login" replace />;
  }

  if (!isMasterAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { session, loading, restaurant } = useAuth();

  if (loading) return <div className="p-8">Cargando sesión...</div>;

  if (!session) return <Navigate to="/login" replace />;

  if (!restaurant) return <div className="p-8">No hay restaurante asociado a este usuario.</div>;

  return <Outlet />;
}

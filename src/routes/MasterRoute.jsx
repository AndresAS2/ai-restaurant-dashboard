import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MasterRoute({ children }) {
  const { session, loading } = useAuth();

  if (loading) return null;

  if (!session?.user) return <Navigate to="/login" replace />;

  return children || <Outlet />;
}

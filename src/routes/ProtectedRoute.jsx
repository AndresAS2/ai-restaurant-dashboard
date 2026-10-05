import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const {
    session,
    loading,
    restaurant,
    registrationRequest,
    refreshAccess,
    signOut,
  } = useAuth();

  if (loading) return <div className="p-8">Cargando sesión...</div>;

  if (!session) return <Navigate to="/login" replace />;

  if (!restaurant) {
    const pending = registrationRequest?.status === 'pending';
    const rejected = registrationRequest?.status === 'rejected';

    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-lg rounded-2xl border bg-white p-7 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            AI Restaurant
          </p>

          <h1 className="mt-2 text-2xl font-bold">
            {pending ? 'Registro en verificación' : rejected ? 'Solicitud no aprobada' : 'Acceso pendiente'}
          </h1>

          <p className="mt-3 text-slate-600">
            {pending
              ? 'Tu cuenta fue creada correctamente. El administrador debe aprobar el restaurante antes de habilitar el dashboard.'
              : rejected
                ? 'La solicitud de este restaurante fue rechazada. Contacta al administrador si necesitas una revisión.'
                : 'Tu cuenta aún no está asociada a un restaurante.'}
          </p>

          {registrationRequest && (
            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm">
              <p><strong>Restaurante:</strong> {registrationRequest.restaurant_name}</p>
              <p><strong>Correo:</strong> {registrationRequest.email}</p>
              <p><strong>Estado:</strong> {registrationRequest.status}</p>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={refreshAccess}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white"
            >
              Revisar estado
            </button>
            <button
              type="button"
              onClick={signOut}
              className="rounded-lg border px-4 py-2 text-sm font-medium"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </main>
    );
  }

  return <Outlet />;
}

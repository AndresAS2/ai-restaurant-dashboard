import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message || 'No se pudo cambiar la contraseña');
      return;
    }

    setMessage('Contraseña actualizada correctamente. Ya puedes iniciar sesión.');

    setTimeout(async () => {
      await supabase.auth.signOut();
      navigate('/login');
    }, 1200);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-7 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          AI Restaurant
        </p>

        <h1 className="mt-2 text-2xl font-bold">Crear nueva contraseña</h1>
        <p className="mt-2 text-sm text-slate-500">
          Ingresa una contraseña nueva para tu cuenta.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Nueva contraseña</label>
            <input
              className="w-full rounded-lg border px-3 py-2"
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Confirmar contraseña</label>
            <input
              className="w-full rounded-lg border px-3 py-2"
              type="password"
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la contraseña"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          {message && (
            <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{message}</div>
          )}

          <button
            className="w-full rounded-lg bg-emerald-700 px-4 py-2 font-medium text-white disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Guardar nueva contraseña'}
          </button>
        </form>
      </div>
    </main>
  );
}

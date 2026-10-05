import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { signUpRestaurant } from '../services/restaurantRegistration';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [restaurantName, setRestaurantName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function resetFeedback() {
    setMessage('');
    setError('');
  }

  async function handleLogin(e) {
    e.preventDefault();
    resetFeedback();
    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    setLoading(false);

    if (loginError) {
      setError('Correo o contraseña incorrectos');
      return;
    }

    navigate('/dashboard');
  }

  async function handleRegister(e) {
    e.preventDefault();
    resetFeedback();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const data = await signUpRestaurant({
        restaurantName,
        email,
        password,
      });

      if (data?.session) {
        navigate('/dashboard');
        return;
      }

      setMessage(
        'Registro recibido. Revisa tu correo para confirmar la cuenta. Después podrás iniciar sesión y verás el estado de aprobación del restaurante.'
      );
      setPassword('');
      setConfirmPassword('');
    } catch (registerError) {
      setError(registerError.message || 'No se pudo crear la cuenta');
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    resetFeedback();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Ingresa el correo de tu cuenta');
      return;
    }

    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (resetError) {
      if (
        String(resetError.message || '').toLowerCase().includes('rate limit') ||
        String(resetError.message || '').toLowerCase().includes('email rate')
      ) {
        setError('Se alcanzó temporalmente el límite de correos. Espera un poco y vuelve a intentarlo.');
        return;
      }

      setError(resetError.message || 'No se pudo enviar el correo de recuperación');
      return;
    }

    setMessage('Te enviamos un enlace para cambiar tu contraseña. Revisa tu correo.');
  }

  const title =
    mode === 'login'
      ? 'Tu operación empieza aquí'
      : mode === 'register'
        ? 'Crear restaurante'
        : 'Recuperar contraseña';

  const description =
    mode === 'login'
      ? 'Ingresa para administrar tu restaurante.'
      : mode === 'register'
        ? 'Crea tu acceso. El restaurante quedará pendiente de aprobación antes de poder usar el sistema.'
        : 'Escribe tu correo y te enviaremos un enlace seguro para crear una contraseña nueva.';

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-7 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          AI Restaurant
        </p>

        <h1 className="mt-2 text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">{description}</p>

        {mode !== 'forgot' && (
          <div className="mt-5 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => { setMode('login'); resetFeedback(); }}
              className={'rounded-md px-3 py-2 text-sm font-medium ' + (mode === 'login' ? 'bg-white shadow-sm' : 'text-slate-500')}
            >
              Ingresar
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); resetFeedback(); }}
              className={'rounded-md px-3 py-2 text-sm font-medium ' + (mode === 'register' ? 'bg-white shadow-sm' : 'text-slate-500')}
            >
              Crear restaurante
            </button>
          </div>
        )}

        <form
          onSubmit={
            mode === 'login'
              ? handleLogin
              : mode === 'register'
                ? handleRegister
                : handleForgotPassword
          }
          className="mt-5 space-y-4"
        >
          {mode === 'register' && (
            <div>
              <label className="mb-1 block text-sm font-medium">Nombre del restaurante</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Ej: La Esquina Burger"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">Correo</label>
            <input
              className="w-full rounded-lg border px-3 py-2"
              type="email"
              placeholder="correo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="mb-1 block text-sm font-medium">Contraseña</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />

              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setPassword('');
                    resetFeedback();
                  }}
                  className="mt-2 text-sm font-medium text-emerald-700 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="mb-1 block text-sm font-medium">Confirmar contraseña</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                type="password"
                placeholder="Repite la contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
          )}

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
            {loading
              ? 'Procesando...'
              : mode === 'login'
                ? 'Ingresar'
                : mode === 'register'
                  ? 'Crear restaurante'
                  : 'Enviar enlace de recuperación'}
          </button>

          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => {
                setMode('login');
                resetFeedback();
              }}
              className="w-full rounded-lg border px-4 py-2 text-sm font-medium"
            >
              Volver a iniciar sesión
            </button>
          )}
        </form>
      </div>
    </main>
  );
}

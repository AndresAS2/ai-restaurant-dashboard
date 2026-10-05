import { useState } from 'react';
import { createRestaurantTenant } from '../services/masterUserCreation';

export default function MasterCreateRestaurant() {
  const [form, setForm] = useState({
    restaurantName: '',
    email: '',
    password: '',
    whatsappNumber: '',
    whatsappPhoneNumberId: '',
  });
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setResult(null);

    try {
      const data = await createRestaurantTenant(form);
      setResult(data);
      setForm({
        restaurantName: '',
        email: '',
        password: '',
        whatsappNumber: '',
        whatsappPhoneNumberId: '',
      });
    } catch (error) {
      setMessage(error.message || 'Error creando restaurante');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl">
      <h1 className="text-2xl font-bold">Crear restaurante</h1>
      <p className="mt-1 text-sm text-gray-500">
        Cada creación genera un tenant nuevo e independiente: usuario, restaurante, configuración,
        menú, pedidos, clientes, conversaciones y WhatsApp propios.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4 rounded-xl border bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Nombre del restaurante</label>
          <input
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Opcional. Si lo dejas vacío: Restaurante D, E, F..."
            value={form.restaurantName}
            onChange={(e) => updateField('restaurantName', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Correo del propietario</label>
          <input
            className="w-full rounded-lg border px-3 py-2"
            type="email"
            required
            placeholder="propietario@correo.com"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Contraseña temporal</label>
          <input
            className="w-full rounded-lg border px-3 py-2"
            type="password"
            required
            minLength={8}
            placeholder="Mínimo 8 caracteres"
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">WhatsApp del restaurante</label>
          <input
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Opcional. Ej: +57 300 000 0000"
            value={form.whatsappNumber}
            onChange={(e) => updateField('whatsappNumber', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Meta Phone Number ID</label>
          <input
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Opcional. Se puede conectar después"
            value={form.whatsappPhoneNumberId}
            onChange={(e) => updateField('whatsappPhoneNumberId', e.target.value)}
          />
          <p className="mt-1 text-xs text-gray-500">
            Si todavía no tiene WhatsApp API, déjalo vacío. El restaurante queda creado con su
            configuración de WhatsApp separada y se conecta después.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          {loading ? 'Creando restaurante...' : 'Crear restaurante'}
        </button>
      </form>

      {message && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {message}
        </div>
      )}

      {result?.restaurant && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="font-semibold">Restaurante creado correctamente</p>
          <p>ID: {result.restaurant.id}</p>
          <p>Nombre: {result.restaurant.name}</p>
          <p>Propietario: {result.owner?.email}</p>
          <p className="mt-2 text-sm">
            Este restaurante ya tiene un tenant independiente. No comparte menú, pedidos, clientes,
            conversaciones, configuración ni WhatsApp con los demás restaurantes.
          </p>
        </div>
      )}
    </section>
  );
}

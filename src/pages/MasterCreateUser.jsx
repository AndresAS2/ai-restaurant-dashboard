import { useEffect, useState } from 'react';
import { getAvailableRestaurants } from '../services/restaurantSelector';
import { createRestaurantUser } from '../services/masterUserCreation';

export default function MasterCreateUser() {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({ email: '', password: '', restaurantId: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAvailableRestaurants().then(setRestaurants).catch(() => setMessage('No se pudieron cargar restaurantes'));
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await createRestaurantUser(form);
      setMessage('Usuario creado correctamente');
    } catch (error) {
      setMessage(error.message || 'Error creando usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h1>Crear usuario de restaurante</h1>
      <form onSubmit={submit}>
        <input placeholder="Correo" value={form.email} onChange={(e) => updateField('email', e.target.value)} />
        <input placeholder="Contraseña temporal" value={form.password} onChange={(e) => updateField('password', e.target.value)} />
        <select value={form.restaurantId} onChange={(e) => updateField('restaurantId', e.target.value)}>
          <option value="">Seleccionar restaurante</option>
          {restaurants.map((restaurant) => (
            <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
          ))}
        </select>
        <button type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear acceso'}</button>
      </form>
      {message && <p>{message}</p>}
    </section>
  );
}

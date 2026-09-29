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
      await createRestaurantUser({email:form.email,password:form.password,restaurant_id:form.restaurantId});
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
        <input aria-label="Correo" type="email" required placeholder="Correo" value={form.email} onChange={(e) => updateField('email', e.target.value)} />
        <input aria-label="Contraseña temporal" type="password" autoComplete="new-password" minLength={8} required placeholder="Contraseña temporal" value={form.password} onChange={(e) => updateField('password', e.target.value)} />
        <select aria-label="Restaurante" required value={form.restaurantId} onChange={(e) => updateField('restaurantId', e.target.value)}>
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

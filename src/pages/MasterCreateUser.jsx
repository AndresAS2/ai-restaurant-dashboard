import { useState } from 'react';

export default function MasterCreateUser() {
  const [form, setForm] = useState({ email: '', password: '', restaurantId: '' });

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    console.log('Pending secure auth creation', form);
  };

  return (
    <section>
      <h1>Crear usuario de restaurante</h1>
      <form onSubmit={submit}>
        <input placeholder="Correo" value={form.email} onChange={(e) => updateField('email', e.target.value)} />
        <input placeholder="Contraseña temporal" value={form.password} onChange={(e) => updateField('password', e.target.value)} />
        <input placeholder="Restaurant ID" value={form.restaurantId} onChange={(e) => updateField('restaurantId', e.target.value)} />
        <button type="submit">Crear acceso</button>
      </form>
    </section>
  );
}

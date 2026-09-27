import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardMetrics } from '../services/dashboard';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  const { restaurant } = useAuth();
  const [metrics, setMetrics] = useState({ orders: 0, customers: 0, conversations: 0 });

  useEffect(() => {
    async function load() {
      if (restaurant?.id) {
        const data = await getDashboardMetrics(restaurant.id);
        setMetrics(data);
      }
    }
    load();
  }, [restaurant]);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Bienvenido</h2>
      <p className="mb-6 text-gray-500">Panel de control del restaurante</p>

      <div className="bg-white rounded-xl p-6 shadow mb-6">
        <h3 className="text-xl font-semibold">{restaurant?.name || 'Restaurante'}</h3>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <StatCard title="Pedidos" value={metrics.orders} />
        <StatCard title="Clientes" value={metrics.customers} />
        <StatCard title="Conversaciones" value={metrics.conversations} />
      </div>
    </div>
  );
}

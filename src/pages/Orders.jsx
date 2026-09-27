import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrders } from '../services/orders';

export default function Orders(){
 const { restaurant } = useAuth();
 const [orders, setOrders] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  async function load(){
   if (!restaurant?.id) return;
   const data = await getOrders(restaurant.id);
   setOrders(data);
   setLoading(false);
  }
  load();
 }, [restaurant]);

 return (
  <div>
   <h1 className="text-2xl font-bold mb-4">Pedidos</h1>
   {loading ? <p>Cargando pedidos...</p> : (
    <div className="space-y-3">
     {orders.length === 0 && <p className="text-gray-500">No hay pedidos registrados.</p>}
     {orders.map(order => (
      <div key={order.id} className="bg-white rounded-xl p-4 shadow">
       <p className="font-semibold">Pedido #{order.id}</p>
       <p>Cliente: {order.customers?.name || 'Cliente'}</p>
       <p>Estado: {order.status || 'Pendiente'}</p>
       <p>Total: {order.total || 0}</p>
      </div>
     ))}
    </div>
   )}
  </div>
 );
}

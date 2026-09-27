import { useAuth } from '../context/AuthContext';

export default function Dashboard(){
 const { restaurant } = useAuth();
 return <div>
  <h2 className="text-3xl font-bold mb-6">Bienvenido</h2>
  <div className="bg-white rounded-xl p-6 shadow">
   <h3 className="text-xl font-semibold">{restaurant?.name || 'Restaurante'}</h3>
   <div className="grid md:grid-cols-3 gap-4 mt-6">
    <div className="p-4 bg-gray-50 rounded">IA: 🟢 Preparada</div>
    <div className="p-4 bg-gray-50 rounded">WhatsApp: ⚪ Configuración pendiente</div>
    <div className="p-4 bg-gray-50 rounded">Pedidos: 0</div>
   </div>
  </div>
 </div>
}

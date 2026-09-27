import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMenu } from '../services/menu';

export default function Menu(){
  const { restaurant } = useAuth();
  const [menu, setMenu] = useState({ categories: [], products: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load(){
      if(!restaurant?.id) return;
      const data = await getMenu(restaurant.id);
      setMenu(data);
      setLoading(false);
    }

    load();
  }, [restaurant]);

  if(loading) return <p>Cargando menú...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Menú IA</h1>
      <p className="text-gray-500 mb-6">Administración inteligente del menú.</p>

      <div className="grid md:grid-cols-2 gap-4">
        {menu.products.map((product)=>(
          <div key={product.id} className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold">{product.name}</h2>
            <p>{product.price}</p>
            <span>{product.available ? 'Disponible' : 'No disponible'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

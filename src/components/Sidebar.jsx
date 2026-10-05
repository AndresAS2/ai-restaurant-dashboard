import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const items = [
 ['Inicio','/'],
 ['Pedidos','/orders'],
 ['Menú IA','/menu'],
 ['Clientes','/customers'],
 ['Conversaciones','/conversations'],
 ['Entrenamiento IA','/training'],
 ['Fidelización','/loyalty'],
 ['Configuración','/settings'],
];

export default function Sidebar(){
 const { isMasterAdmin } = useAuth();

 return <aside className="w-64 min-h-screen bg-slate-900 text-white p-5">
   <h1 className="text-xl font-bold mb-8">AI Restaurant</h1>
   <nav className="space-y-2">
   {items.map(([label,path])=>(
    <NavLink key={path} to={path} className="block rounded-lg px-3 py-2 hover:bg-slate-800">
      {label}
    </NavLink>
   ))}
   {isMasterAdmin && (
    <>
      <div className="my-4 border-t border-slate-700" />
      <NavLink to="/master/restaurants" className="block rounded-lg px-3 py-2 hover:bg-slate-800">
        Solicitudes y restaurantes
      </NavLink>
    </>
   )}
   </nav>
 </aside>
}

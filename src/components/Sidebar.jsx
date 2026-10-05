import { NavLink } from 'react-router-dom';

const items = [
 ['Inicio','/'],
 ['Pedidos','/orders'],
 ['Menú IA','/menu'],
 ['Clientes','/customers'],
 ['Conversaciones','/conversations'],
 ['Entrenamiento IA','/training'],
 ['Fidelización','/loyalty'],
 ['Usuarios','/master/users/create'],
 ['Configuración','/settings'],
];

export default function Sidebar(){
 return <aside className="w-64 min-h-screen bg-slate-900 text-white p-5">
   <h1 className="text-xl font-bold mb-8">AI Restaurant</h1>
   <nav className="space-y-2">
   {items.map(([label,path])=>(
    <NavLink key={path} to={path} className="block rounded-lg px-3 py-2 hover:bg-slate-800">
      {label}
    </NavLink>
   ))}
   </nav>
 </aside>
}
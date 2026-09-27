import { NavLink, Outlet } from 'react-router-dom';
import { Home, ShoppingBag, Utensils, Users, MessageSquare, Brain, Heart, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const items = [
 {label:'Inicio', path:'/', icon:Home},
 {label:'Pedidos', path:'/orders', icon:ShoppingBag},
 {label:'Menú IA', path:'/menu', icon:Utensils},
 {label:'Clientes', path:'/customers', icon:Users},
 {label:'Conversaciones', path:'/conversations', icon:MessageSquare},
 {label:'Entrenamiento IA', path:'/training', icon:Brain},
 {label:'Fidelización', path:'/loyalty', icon:Heart},
 {label:'Configuración', path:'/settings', icon:Settings}
];

export default function DashboardLayout(){
 const { signOut, restaurant } = useAuth();
 return <div className="min-h-screen bg-gray-100 flex">
  <aside className="w-64 bg-white border-r p-5">
   <h1 className="text-xl font-bold mb-8">AI Restaurant</h1>
   <p className="text-sm mb-5">{restaurant?.name || 'Restaurante'}</p>
   <nav className="space-y-2">
    {items.map(({label,path,icon:Icon})=><NavLink key={path} to={path} className="flex gap-3 p-3 rounded hover:bg-gray-100"><Icon size={18}/>{label}</NavLink>)}
   </nav>
   <button onClick={signOut} className="flex gap-3 mt-8 p-3"><LogOut size={18}/>Salir</button>
  </aside>
  <main className="flex-1 p-8"><Outlet/></main>
 </div>
}

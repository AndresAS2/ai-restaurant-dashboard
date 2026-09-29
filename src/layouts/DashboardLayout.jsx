import {NavLink,Outlet} from 'react-router-dom';
import {useState} from 'react';
import {Home,ShoppingBag,Utensils,Users,MessageSquare,Settings,LogOut,Bot,Brain,Heart} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
const items=[['Inicio','/dashboard',Home],['Pedidos','/orders',ShoppingBag],['Conversaciones','/conversations',MessageSquare],['Clientes','/customers',Users],['Menú','/menu',Utensils],['Configuración','/settings',Settings],['Prueba IA','/ai-test',Bot],['Entrenamiento IA','/training',Brain],['Fidelización','/loyalty',Heart]];
export default function DashboardLayout(){
 const {restaurant,signOut}=useAuth(),[error,setError]=useState('');
 return <div className="min-h-screen md:flex"><aside className="bg-white border-r md:w-60 md:sticky md:top-0 md:h-screen p-5 flex-shrink-0"><p className="font-bold text-xl tracking-tight text-emerald-900">AI Restaurant<span className="text-emerald-500">.</span></p><p className="text-xs text-slate-500 mt-2 mb-6">{restaurant?.name}</p><nav className="grid grid-cols-2 md:grid-cols-1 gap-1">{items.map(([label,path,Icon])=><NavLink key={path} to={path} className={({isActive})=>'flex gap-3 items-center text-sm p-3 rounded-lg '+(isActive?'bg-emerald-50 text-emerald-900 font-semibold':'text-slate-600 hover:bg-slate-50')}><Icon size={18}/>{label}</NavLink>)}</nav><button className="flex items-center gap-3 mt-6 text-sm" onClick={()=>signOut().catch(e=>setError(e.message))}><LogOut size={17}/>Cerrar sesión</button>{error&&<p role="alert">{error}</p>}</aside><main className="min-w-0 flex-1 p-5 lg:p-10"><Outlet/></main></div>;
}

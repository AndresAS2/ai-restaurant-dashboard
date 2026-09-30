import {NavLink,Outlet} from 'react-router-dom';
import {useState} from 'react';
import {Home,ShoppingBag,Utensils,Users,MessageSquare,Settings,LogOut,Bot,Brain,Heart,Menu,X,ChefHat} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
const groups=[
 ['OPERACIÓN',[['Inicio','/dashboard',Home],['Pedidos','/orders',ShoppingBag],['Conversaciones','/conversations',MessageSquare],['Clientes','/customers',Users],['Menú','/menu',Utensils]]],
 ['TU RESTAURANTE',[['Configuración','/settings',Settings],['Entrenamiento IA','/training',Brain],['Prueba IA','/ai-test',Bot],['Fidelización','/loyalty',Heart]]]
];
export default function DashboardLayout(){
 const {restaurant,signOut}=useAuth(),[error,setError]=useState(''),[open,setOpen]=useState(false),[exiting,setExiting]=useState(false);
 async function exit(){setExiting(true);try{await signOut();}catch(e){setError(e.message);}finally{setExiting(false);}}
 return <div className="min-h-screen md:flex">
 <aside className="sidebar md:w-64 md:sticky md:top-0 md:h-screen flex-shrink-0 md:overflow-y-auto">
 <div className="flex items-center justify-between gap-3 p-5 md:p-6"><div className="flex gap-3 items-center"><span className="brand-icon"><ChefHat size={22}/></span><div><p className="font-bold text-lg tracking-tight text-white">AI Restaurant<span className="text-emerald-400">.</span></p><p className="text-[10px] uppercase tracking-[.2em] text-emerald-200/60">Restaurant workspace</p></div></div><button type="button" className="md:hidden text-white p-2" aria-label={open?'Cerrar navegación':'Abrir navegación'} aria-expanded={open} aria-controls="dashboard-navigation" onClick={()=>setOpen(!open)}>{open?<X size={22}/>:<Menu size={22}/>}</button></div>
 <div id="dashboard-navigation" className={(open?'block':'hidden')+' md:block px-4 pb-6'}>
 <div className="restaurant-switch mb-7"><span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0"/><p className="text-sm font-medium">{restaurant?.name||'Mi restaurante'}</p></div>
 <nav aria-label="Navegación principal" className="space-y-6">{groups.map(([label,items])=><div key={label}><p className="px-3 mb-2 text-[10px] font-semibold tracking-[.18em] text-slate-400">{label}</p><div className="space-y-1">{items.map(([name,path,Icon])=><NavLink key={path} to={path} onClick={()=>setOpen(false)} className={({isActive})=>'nav-item '+(isActive?'nav-active':'')}><Icon size={18} className="shrink-0"/><span>{name}</span></NavLink>)}</div></div>)}</nav>
 <div className="border-t border-white/10 mt-7 pt-5"><button className="nav-item w-full" disabled={exiting} onClick={exit}><LogOut size={17}/>{exiting?'Cerrando sesión…':'Cerrar sesión'}</button>{error&&<p role="alert" className="text-red-200 text-sm p-3">{error}</p>}</div>
 </div></aside>
 <main className="min-w-0 flex-1 p-5 lg:p-10"><div className="mx-auto max-w-[1500px]"><Outlet/></div></main></div>;
}

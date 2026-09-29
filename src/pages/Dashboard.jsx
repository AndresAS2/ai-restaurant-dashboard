import {Link} from 'react-router-dom';
import Page from '../components/Page';
import {useResource} from '../hooks/useResource';
import {getDashboardMetrics} from '../services/dashboard';
import {money,date} from '../services/format';
export default function Dashboard(){
 const r=useResource(getDashboardMetrics),m=r.data||{};
 return <Page title={r.restaurant?.name||'Inicio'} description="Una vista clara de la actividad de tu restaurante." resource={r}><div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">{[['Ventas entregadas hoy',money(m.sales_today)],['Pedidos activos',m.active||0],['Clientes registrados',m.customers||0],['Mensajes registrados',m.messages||0]].map(([label,value])=><article className="panel" key={label}><p className="text-sm text-slate-500">{label}</p><p className="text-3xl font-semibold mt-4">{value}</p></article>)}</div><article className="panel flex flex-wrap justify-between gap-6"><div><h2 className="text-xl font-semibold">La actividad del mesero virtual</h2><p className="mt-3 text-slate-500">{m.orders||0} pedidos reales · {m.testOrders||0} pedidos de prueba</p><p className="mt-2 text-sm">Último mensaje: {date(m.lastMessage)}</p></div><div className="flex items-center gap-3"><Link className="primary" to="/orders">Ver pedidos</Link><Link className="secondary" to="/conversations">Ver conversaciones</Link></div></article><p className="text-xs text-slate-500">Actualización cada 15 segundos. Ventas: pedidos entregados creados hoy, hora de Bogotá. Las pruebas se excluyen de las ventas; clientes y mensajes incluyen pruebas.</p></Page>;
}

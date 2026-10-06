export default function ConversationProfile({customer,identity,messages,last}){
 const orderId=last?.metadata?.order_id||last?.metadata?.pedido_id;
 return <aside className="panel h-fit space-y-4">
  <div>
   <p className="eyebrow">CLIENTE</p>
   <h3 className="text-lg font-semibold">{identity.display_name}</h3>
   <p className="text-sm text-slate-500">{identity.display_phone||'Teléfono no registrado'}</p>
  </div>
  <div className="border-t pt-3 text-sm space-y-2">
   <p><strong>ID:</strong> {identity.reference}</p>
   <p><strong>Mensajes:</strong> {messages.length}</p>
   <p><strong>Canal:</strong> WhatsApp</p>
   <p><strong>Última interacción:</strong> {last?.created_at?new Date(last.created_at).toLocaleString('es-CO'):'Sin datos'}</p>
  </div>
  {orderId&&<div className="notice">
   <strong>Pedido asociado</strong>
   <p>{orderId}</p>
  </div>}
 </aside>;
}

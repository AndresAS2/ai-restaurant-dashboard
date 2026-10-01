import AssetPicker from './AssetPicker';
export default function PaymentEditor({restaurantId,value,onChange,disabled}){
 const update=(id,patch)=>onChange(rows=>rows.map(p=>p.id===id?{...p,...patch}:p));
 return <section className="panel space-y-4"><h2 className="text-xl font-semibold">Métodos de pago</h2><p className="text-sm text-slate-500">Solo los métodos activos se muestran al mesero virtual. Guarda la configuración para aplicar los cambios.</p>
 {value.map(p=><div key={p.id} className="border rounded-xl p-4 grid sm:grid-cols-2 gap-3">
 <label>Tipo<select value={p.type||'transferencia'} disabled={disabled} onChange={e=>{const type=e.target.value;update(p.id,{type,name:e.target.selectedOptions[0].text});}}>{[['efectivo','Efectivo'],['nequi','Nequi'],['daviplata','Daviplata'],['transferencia','Bancolombia / transferencia'],['tarjeta','Tarjeta'],['otro','Otro']].map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
 <label>Nombre del método<input required maxLength={80} value={p.name||''} onChange={e=>update(p.id,{name:e.target.value})}/></label>
 <label>Número o cuenta<input maxLength={100} value={p.number||''} onChange={e=>update(p.id,{number:e.target.value})}/></label>
 <label>Instrucciones de pago<textarea maxLength={500} value={p.description||''} onChange={e=>update(p.id,{description:e.target.value})}/></label>
 <label className="flex gap-2 items-center"><input type="checkbox" checked={p.active!==false} onChange={e=>update(p.id,{active:e.target.checked})}/>Método activo</label>
 <button type="button" className="secondary" disabled={disabled} onClick={()=>onChange(value.filter(x=>x.id!==p.id))}>Quitar método</button>
 <div className="sm:col-span-2">{p.image_url&&<img src={p.image_url} alt={'QR o imagen de '+p.name} className="h-32 object-contain mb-3"/>}<AssetPicker label={'Imagen para '+(p.name||'método')} restaurantId={restaurantId} disabled={disabled} onUploaded={a=>update(p.id,{image_url:a.url,image_path:a.path})}/></div>
 </div>)}
 <button type="button" className="secondary" disabled={disabled||value.length>=20} onClick={()=>onChange([...value,{id:crypto.randomUUID(),type:'nequi',name:'Nequi',number:'',description:'',active:true}])}>Agregar método de pago</button></section>;
}

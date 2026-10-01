import AssetPicker from './AssetPicker';
export default function MenuMediaEditor({restaurantId,value,onChange}){
 const update=(i,patch)=>onChange(rows=>rows.map((a,j)=>i===j?{...a,...patch}:a));
 const move=(i,d)=>onChange(rows=>{const next=[...rows];[next[i],next[i+d]]=[next[i+d],next[i]];return next;});
 return <section className="panel space-y-4"><h2 className="text-xl font-semibold">Recursos visuales del menú</h2>
 <p className="text-sm text-slate-500">Imágenes y PDF para tus clientes. El mesero utiliza los primeros cinco recursos activos en este orden. Guarda la configuración para publicar los cambios.</p>
 <AssetPicker key={restaurantId} label="Imágenes o PDF del menú" restaurantId={restaurantId} multiple allowPdf maxFiles={Math.min(5,20-value.length)} disabled={value.length>=20} onUploaded={a=>onChange(rows=>[...rows,{...a,caption:a.name}])}/>
 {value.map((a,i)=><div key={i} className="border rounded-xl p-4 space-y-3">
 {a.url&&(a.mime==='application/pdf'?<a href={a.url} target="_blank" rel="noreferrer" className="underline">Ver PDF</a>:<img src={a.url} alt={a.caption||'Menú'} className="h-32 max-w-full object-contain rounded-lg"/>)}
 <div className="grid sm:grid-cols-2 gap-3"><label>Enlace de imagen<input required type="url" value={a.url||''} onChange={e=>update(i,{url:e.target.value,path:null,mime:/\.pdf(?:\?|$)/i.test(e.target.value)?'application/pdf':'image/png'})}/></label><label>Descripción<input maxLength={200} value={a.caption||''} onChange={e=>update(i,{caption:e.target.value})}/></label></div>
 <div className="flex flex-wrap gap-2 items-center"><label className="flex gap-2 items-center"><input type="checkbox" checked={a.active!==false} onChange={e=>update(i,{active:e.target.checked})}/>Visible</label><button type="button" className="secondary" disabled={i===0} onClick={()=>move(i,-1)}>Subir posición</button><button type="button" className="secondary" disabled={i===value.length-1} onClick={()=>move(i,1)}>Bajar posición</button><button type="button" className="secondary" onClick={()=>onChange(rows=>rows.filter((_,j)=>i!==j))}>Quitar</button></div>
 </div>)}
 <button type="button" className="secondary" disabled={value.length>=20} onClick={()=>onChange(rows=>[...rows,{url:'',caption:'',active:true}])}>Agregar imagen</button></section>;
}


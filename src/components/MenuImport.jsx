import {useState} from 'react';
import AssetPicker from './AssetPicker';
import {extractMenu} from '../services/assets';
import {importReviewedMenu} from '../services/menu';
export default function MenuImport({restaurantId,onSaved}){
 const [assets,setAssets]=useState([]),[products,setProducts]=useState([]),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 async function extract(){setBusy(true);setError('');setNotice('');try{setProducts(await extractMenu(restaurantId,assets));setNotice('Revisa nombres, precios e ingredientes antes de confirmar. La extracción puede contener errores.');}catch(e){setError(e.message);}finally{setBusy(false);}}
 async function save(){setBusy(true);setError('');try{const selected=products.filter(p=>p.selected);if(!selected.length)throw new Error('Selecciona al menos un producto.');const n=await importReviewedMenu(restaurantId,selected);setProducts([]);setNotice(n+' productos guardados.');await onSaved();}catch(e){setError(e.message);}finally{setBusy(false);}}
 const update=(id,patch)=>setProducts(rows=>rows.map(p=>p.id===id?{...p,...patch}:p));
 return <details className="panel"><summary className="cursor-pointer font-semibold">Importar menú desde imágenes o PDF</summary><div className="space-y-4 mt-4">
 <p className="text-sm text-slate-500">Sube hasta cinco archivos, extrae los productos y revisa el resultado. Tu menú actual se conserva. No se guarda ningún producto automáticamente.</p>
 <AssetPicker label="Archivos del menú" restaurantId={restaurantId} multiple allowPdf maxFiles={5-assets.length} disabled={busy||assets.length>=5} onUploaded={a=>{setAssets(v=>[...v,a]);setProducts([]);setNotice('');}}/>
 {assets.map(a=><div key={a.path} className="flex flex-wrap items-center gap-3"><a href={a.url} target="_blank" rel="noreferrer" className="underline">{a.name}</a><button type="button" className="secondary" disabled={busy} onClick={()=>{setAssets(v=>v.filter(x=>x.path!==a.path));setProducts([]);}}>Quitar de importación</button></div>)}
 {!!assets.length&&<button type="button" className="secondary" disabled={busy||assets.length>5} onClick={extract}>{busy?'Procesando…':'Extraer productos'}</button>}
 {!!products.length&&<><p className="font-semibold">Vista previa editable · {products.length} productos</p><div className="space-y-4">{products.map(p=><div key={p.id} className="border rounded-xl p-4 grid sm:grid-cols-2 gap-3">
 <label className="sm:col-span-2 flex gap-2"><input type="checkbox" checked={p.selected} disabled={busy} onChange={e=>update(p.id,{selected:e.target.checked})}/>Incluir producto</label>
 <label>Nombre extraído<input maxLength={150} disabled={busy} value={p.name||''} onChange={e=>update(p.id,{name:e.target.value})}/></label>
 <label>Precio extraído (COP)<input type="number" min="0" max="100000000" disabled={busy} value={p.price} onChange={e=>update(p.id,{price:e.target.value})}/></label>
 <label>Categoría extraída<input maxLength={100} disabled={busy} value={p.category||''} onChange={e=>update(p.id,{category:e.target.value})}/></label>
 <label className="flex items-center gap-2"><input type="checkbox" checked={p.available} disabled={busy} onChange={e=>update(p.id,{available:e.target.checked})}/>Disponible</label>
 <label>Descripción extraída<textarea maxLength={2000} disabled={busy} value={p.description||''} onChange={e=>update(p.id,{description:e.target.value})}/></label>
 <label>Ingredientes extraídos<input disabled={busy} value={p.ingredients||''} onChange={e=>update(p.id,{ingredients:e.target.value})}/></label>
 </div>)}</div><button className="primary" disabled={busy} onClick={save}>Confirmar y guardar productos seleccionados</button></>}
 {error&&<p className="notice error" role="alert">{error}</p>}{notice&&<p className="notice" role="status">{notice}</p>}
 </div></details>;
}

import {useEffect,useRef,useState} from 'react';
import {uploadAsset} from '../services/assets';
import {validateAsset} from '../services/menuValidation';
export default function AssetPicker({restaurantId,label,onUploaded,multiple=false,allowPdf=false,disabled=false,maxFiles=5}){
 const current=useRef(restaurantId),mounted=useRef(true);current.current=restaurantId;
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
 const [files,setFiles]=useState([]),[previews,setPreviews]=useState([]),[busy,setBusy]=useState(false),[error,setError]=useState('');
 useEffect(()=>{const urls=files.map(f=>({url:URL.createObjectURL(f),type:f.type,name:f.name}));setPreviews(urls);return()=>urls.forEach(p=>URL.revokeObjectURL(p.url));},[files]);
 function select(list){try{const selected=Array.from(list||[]);if(selected.length>maxFiles)throw new Error('Puedes seleccionar hasta '+maxFiles+' archivo(s) más.');selected.forEach(f=>validateAsset(f,allowPdf));setFiles(selected);setError('');}catch(e){setFiles([]);setError(e.message);}}
 async function upload(){setBusy(true);setError('');let completed=0;const tenant=restaurantId;try{for(const file of files){if(!mounted.current||current.current!==tenant)return;const asset=await uploadAsset(tenant,file,allowPdf);if(!mounted.current||current.current!==tenant)return;await onUploaded(asset);completed++;}setFiles([]);}catch(e){setFiles(v=>v.slice(completed));setError(e.message);}finally{if(mounted.current)setBusy(false);}}
 return <div className="rounded-xl border border-dashed border-slate-300 p-4 space-y-3">
 <label>{label}<input type="file" accept={'image/jpeg,image/png,image/webp'+(allowPdf?',application/pdf':'')} multiple={multiple} disabled={disabled||busy} onChange={e=>{select(e.target.files);e.target.value='';}}/></label>
 <p className="text-xs text-slate-500">Máximo 6 MB por archivo. Recursos para compartir con clientes; no subas documentos privados.</p>
 <div className="flex flex-wrap gap-3">{previews.map((p,i)=><div className="w-28" key={i}>{p.type.startsWith('image/')?<img className="w-28 h-24 object-contain rounded-lg bg-slate-50" src={p.url} alt={'Vista previa de '+p.name}/>:<span className="badge">PDF</span>}<p className="text-xs break-all">{p.name}</p></div>)}</div>
 {!!files.length&&<button className="secondary" type="button" disabled={busy||disabled} onClick={upload}>{busy?'Subiendo…':'Subir '+files.length+' archivo(s)'}</button>}
 {error&&<p className="notice error" role="alert">{error}</p>}
 </div>;
}

export default function SegmentedControl({label,value,onChange,options}){
 return <div role="group" aria-label={label} className="segmented">{options.map(([id,text])=><button key={id} type="button" aria-pressed={value===id} className={value===id?'selected':''} onClick={()=>onChange(id)}>{text}</button>)}</div>;
}

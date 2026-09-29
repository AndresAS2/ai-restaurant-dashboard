import {useState,useEffect,useCallback,useRef} from 'react';
import {useAuth} from '../context/AuthContext';
export function useResource(loader,poll=true){
 const {restaurant}=useAuth(),id=restaurant?.id;
 const [state,setState]=useState({data:null,error:'',loading:true}),seq=useRef(0);
 const refresh=useCallback(async()=>{const n=++seq.current;if(!id){setState({data:null,error:'',loading:false});return;}
 try{const data=await loader(id);if(n===seq.current)setState({data,error:'',loading:false});}
 catch(e){if(n===seq.current)setState(s=>({...s,error:e.message,loading:false}));}},[id,loader]);
 useEffect(()=>{setState({data:null,error:'',loading:true});refresh();const timer=poll?setInterval(()=>{if(!document.hidden)refresh();},15000):null;return()=>{clearInterval(timer);seq.current++;};},[refresh,poll]);
 return {...state,refresh,restaurant};
}

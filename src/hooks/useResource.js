import {useState,useEffect,useCallback,useRef} from 'react';
import {useAuth} from '../context/AuthContext';
export function useResource(loader,poll=true){
 const {restaurant}=useAuth(),id=restaurant?.id;
 const [state,setState]=useState({data:null,error:'',loading:true}),seq=useRef(0),pending=useRef(null);
 const refresh=useCallback(async(force=true)=>{
 const n=++seq.current;
 if(!id){setState({data:null,error:'',loading:false});return;}
 let request=pending.current;
 if(force!==false||!request||request.id!==id||request.loader!==loader){
 request={id,loader,promise:Promise.resolve().then(()=>loader(id))};pending.current=request;
 }
 try{const data=await request.promise;if(n===seq.current)setState({data,error:'',loading:false});}
 catch(e){if(n===seq.current)setState(s=>({...s,error:e.message,loading:false}));}
 finally{if(pending.current===request)pending.current=null;}
 },[id,loader]);
 useEffect(()=>{
 setState({data:null,error:'',loading:true});refresh(false);
 const visible=()=>{if(!document.hidden)refresh(false);};
 const timer=poll?setInterval(visible,15000):null;
 if(poll)document.addEventListener('visibilitychange',visible);
 return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',visible);seq.current++;};
 },[refresh,poll]);
 return {...state,refresh,restaurant};
}

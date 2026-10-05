import {createContext,useContext,useEffect,useState} from 'react';
import {supabase,configured} from '../services/supabase';
import {getMyRegistrationRequest} from '../services/restaurantRegistration';

const AuthContext=createContext(null);

export function AuthProvider({children}){
 const [session,setSession]=useState(null),[loading,setLoading]=useState(true),[restaurant,setRestaurant]=useState(null),[error,setError]=useState('');
 const [logoutError,setLogoutError]=useState('');
 const [registrationRequest,setRegistrationRequest]=useState(null);
 const [isMaster,setIsMaster]=useState(false);

 useEffect(()=>{
  if(!configured){setLoading(false);return;}
  let alive=true;
  supabase.auth.getSession()
   .then(({data,error})=>{if(alive){setSession(data.session);if(error)setError(error.message);if(!data.session)setLoading(false);}})
   .catch(e=>{if(alive){setError(e.message);setLoading(false);}});
  const {data}=supabase.auth.onAuthStateChange((_event,s)=>{
   if(alive){
    setSession(s);
    if(!s){
     setRestaurant(null);
     setRegistrationRequest(null);
     setIsMaster(false);
     setLoading(false);
    }
   }
  });
  return()=>{alive=false;data.subscription.unsubscribe();};
 },[]);

 useEffect(()=>{
  let alive=true;
  setRestaurant(null);
  setRegistrationRequest(null);
  setIsMaster(false);
  setError('');

  if(!session?.user)return()=>{alive=false;};

  setLoading(true);

  Promise.all([
   supabase.from('restaurant_users').select('restaurant_id,restaurants(*)').eq('user_id',session.user.id).maybeSingle(),
   supabase.from('platform_admins').select('user_id').eq('user_id',session.user.id).maybeSingle(),
   getMyRegistrationRequest(session.user.id).then(data=>({data,error:null})).catch(error=>({data:null,error}))
  ])
   .then(([restaurantResult,adminResult,requestResult])=>{
    if(!alive)return;
    setRestaurant(restaurantResult.data?.restaurants||null);
    setIsMaster(Boolean(adminResult.data?.user_id));
    setRegistrationRequest(requestResult.data||null);
    const firstError=restaurantResult.error||adminResult.error||requestResult.error;
    setError(firstError?.message||'');
   })
   .catch(e=>{if(alive)setError(e.message);})
   .finally(()=>{if(alive)setLoading(false);});

  return()=>{alive=false;};
 },[session?.user?.id]);

 async function refreshAccess(){
  if(!session?.user)return;
  setLoading(true);
  try{
   const [restaurantResult,adminResult,requestResult]=await Promise.all([
    supabase.from('restaurant_users').select('restaurant_id,restaurants(*)').eq('user_id',session.user.id).maybeSingle(),
    supabase.from('platform_admins').select('user_id').eq('user_id',session.user.id).maybeSingle(),
    getMyRegistrationRequest(session.user.id).then(data=>({data,error:null})).catch(error=>({data:null,error}))
   ]);
   setRestaurant(restaurantResult.data?.restaurants||null);
   setIsMaster(Boolean(adminResult.data?.user_id));
   setRegistrationRequest(requestResult.data||null);
   const firstError=restaurantResult.error||adminResult.error||requestResult.error;
   setError(firstError?.message||'');
  }finally{
   setLoading(false);
  }
 }

 async function signOut(){
  setLogoutError('');
  try{
   const {error}=await supabase.auth.signOut();
   if(error)throw error;
   setSession(null);
   setRestaurant(null);
   setRegistrationRequest(null);
   setIsMaster(false);
  }catch(e){
   setLogoutError('No se pudo confirmar el cierre de sesión en el servidor. '+e.message);
   throw e;
  }
 }

 return <AuthContext.Provider value={{
  session,
  user:session?.user||null,
  restaurant,
  registrationRequest,
  updateRestaurant:setRestaurant,
  loading,
  error,
  logoutError,
  clearLogoutError:()=>setLogoutError(''),
  configured,
  signOut,
  refreshAccess,
  isMaster,
  isMasterAdmin:isMaster
 }}>{children}</AuthContext.Provider>;
}

export const useAuth=()=>useContext(AuthContext);

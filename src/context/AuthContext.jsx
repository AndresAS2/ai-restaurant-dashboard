import {createContext,useContext,useEffect,useState} from 'react';
import {supabase,configured} from '../services/supabase';
const AuthContext=createContext(null);
export function AuthProvider({children}){
 const [session,setSession]=useState(null),[loading,setLoading]=useState(true),[restaurant,setRestaurant]=useState(null),[error,setError]=useState('');
 useEffect(()=>{
 if(!configured){setLoading(false);return;}let alive=true;
 supabase.auth.getSession().then(({data,error})=>{if(alive){setSession(data.session);if(error)setError(error.message);if(!data.session)setLoading(false);}}).catch(e=>{if(alive){setError(e.message);setLoading(false);}});
 const {data}=supabase.auth.onAuthStateChange((_event,s)=>{if(alive){setSession(s);if(!s){setRestaurant(null);setLoading(false);}}});
 return()=>{alive=false;data.subscription.unsubscribe();};
 },[]);
 useEffect(()=>{
 let alive=true;setRestaurant(null);setError('');
 if(!session?.user){return()=>{alive=false;};}setLoading(true);
 supabase.from('restaurant_users').select('restaurant_id,restaurants(*)').eq('user_id',session.user.id).maybeSingle()
 .then(({data,error})=>{if(alive){setRestaurant(data?.restaurants||null);setError(error?.message||'');}})
 .catch(e=>{if(alive)setError(e.message);}).finally(()=>{if(alive)setLoading(false);});
 return()=>{alive=false;};
 },[session?.user?.id]);
 async function signOut(){const {error}=await supabase.auth.signOut();if(error)throw error;setSession(null);setRestaurant(null);}
 return <AuthContext.Provider value={{session,user:session?.user||null,restaurant,loading,error,configured,signOut,isMaster:session?.user?.app_metadata?.role==='master'}}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function loadRestaurant() {
      if (!session?.user) return;

      const { data } = await supabase
        .from('restaurant_users')
        .select('restaurant_id, restaurants(*)')
        .eq('user_id', session.user.id)
        .single();

      setRestaurant(data?.restaurants || null);
    }

    loadRestaurant();
  }, [session]);

  return (
    <AuthContext.Provider value={{ session, restaurant, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

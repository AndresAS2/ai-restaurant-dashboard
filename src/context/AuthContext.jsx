import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(null);

  async function loadRestaurant(currentSession) {
    if (!currentSession?.user) {
      setRestaurant(null);
      return;
    }

    const { data, error } = await supabase
      .from('restaurant_users')
      .select('restaurant_id, restaurants(*)')
      .eq('user_id', currentSession.user.id)
      .single();

    if (error) {
      setError(error.message);
      setRestaurant(null);
      return;
    }

    setRestaurant(data?.restaurants || null);
  }

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      await loadRestaurant(data.session);
      setLoading(false);
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      await loadRestaurant(nextSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setRestaurant(null);
  }

  return (
    <AuthContext.Provider value={{ session, restaurant, loading, error, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

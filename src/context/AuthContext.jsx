import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [isMasterAdmin, setIsMasterAdmin] = useState(false);
  const [error, setError] = useState(null);

  async function loadAccess(currentSession) {
    if (!currentSession?.user) {
      setRestaurant(null);
      setIsMasterAdmin(false);
      return;
    }

    setError(null);

    const [restaurantResult, adminResult] = await Promise.all([
      supabase
        .from('restaurant_users')
        .select('restaurant_id, restaurants(*)')
        .eq('user_id', currentSession.user.id)
        .maybeSingle(),
      supabase
        .from('platform_admins')
        .select('user_id')
        .eq('user_id', currentSession.user.id)
        .maybeSingle(),
    ]);

    if (restaurantResult.error) {
      setError(restaurantResult.error.message);
      setRestaurant(null);
    } else {
      setRestaurant(restaurantResult.data?.restaurants || null);
    }

    setIsMasterAdmin(Boolean(adminResult.data?.user_id));
  }

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      await loadAccess(data.session);
      setLoading(false);
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      await loadAccess(nextSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setRestaurant(null);
    setIsMasterAdmin(false);
  }

  return (
    <AuthContext.Provider value={{
      session,
      user: session?.user || null,
      restaurant,
      isMasterAdmin,
      loading,
      error,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

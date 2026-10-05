import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { getMyRegistrationRequest } from '../services/restaurantRegistration';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [registrationRequest, setRegistrationRequest] = useState(null);
  const [isMasterAdmin, setIsMasterAdmin] = useState(false);
  const [error, setError] = useState(null);

  async function loadAccess(currentSession) {
    if (!currentSession?.user) {
      setRestaurant(null);
      setRegistrationRequest(null);
      setIsMasterAdmin(false);
      return;
    }

    setError(null);

    const [restaurantResult, adminResult, requestResult] = await Promise.all([
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
      getMyRegistrationRequest(currentSession.user.id)
        .then((data) => ({ data, error: null }))
        .catch((requestError) => ({ data: null, error: requestError })),
    ]);

    if (restaurantResult.error) {
      setError(restaurantResult.error.message);
      setRestaurant(null);
    } else {
      setRestaurant(restaurantResult.data?.restaurants || null);
    }

    setRegistrationRequest(requestResult.data || null);
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

  async function refreshAccess() {
    setLoading(true);
    await loadAccess(session);
    setLoading(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setRestaurant(null);
    setRegistrationRequest(null);
    setIsMasterAdmin(false);
  }

  return (
    <AuthContext.Provider value={{
      session,
      user: session?.user || null,
      restaurant,
      registrationRequest,
      isMasterAdmin,
      loading,
      error,
      refreshAccess,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

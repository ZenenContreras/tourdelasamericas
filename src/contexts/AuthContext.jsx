import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../config/supabase';
import { signInWithEmail, signInWithGoogle, signUp, signOut } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Memoizar la función de obtener sesión
  const getSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error al obtener la sesión:', error);
        setUser(null);
      } else if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error al obtener la sesión:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getSession();

    // Suscribirse a cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [getSession]);

  // Memoizar la función de cerrar sesión
  const handleSignOut = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await signOut();
      if (error) {
        console.error('Error en handleSignOut:', error);
      }
      setUser(null);
    } catch (error) {
      console.error('Error en handleSignOut:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoizar el valor del contexto
  const value = useMemo(() => ({
    user,
    loading,
    signInWithEmail,
    signInWithGoogle,
    signUp,
    signOut: handleSignOut,
  }), [user, loading, handleSignOut]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
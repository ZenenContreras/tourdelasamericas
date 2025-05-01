import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../config/supabase';
import { signInWithEmail, signInWithGoogle, signUp, signOut, resetPassword, updatePassword, getCurrentUser } from '../services/authService';

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
        // Obtener datos adicionales del usuario
        const { user: currentUser } = await getCurrentUser();
        setUser(currentUser);
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
        // Actualizar con los datos del usuario completos
        const { user: currentUser } = await getCurrentUser();
        setUser(currentUser);
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

  // Memoizar la función de recuperar contraseña
  const handleResetPassword = useCallback(async (email) => {
    return resetPassword(email);
  }, []);

  // Memoizar la función de actualizar contraseña
  const handleUpdatePassword = useCallback(async (newPassword) => {
    return updatePassword(newPassword);
  }, []);

  // Memoizar el valor del contexto
  const value = useMemo(() => ({
    user,
    loading,
    signInWithEmail,
    signInWithGoogle,
    signUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword
  }), [user, loading, handleSignOut, handleResetPassword, handleUpdatePassword]);

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
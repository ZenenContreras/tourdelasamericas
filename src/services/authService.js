import { supabase } from '../config/supabase';

export const signInWithEmail = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    
    // Obtener el perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();
    
    if (profileError) throw profileError;
    
    return { 
      data: { ...data, profile }, 
      error: null 
    };
  } catch (error) {
    return { 
      data: null, 
      error: {
        message: error.message,
        code: error.code,
        status: error.status
      }
    };
  }
};

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: {
        message: error.message,
        code: error.code,
        status: error.status
      }
    };
  }
};

export const signUp = async (email, password) => {
  try {
    // Registrar usuario en auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (authError) throw authError;

    // Crear perfil de usuario
    const { data: profile, error: profileError } = await supabase
      .from('usuarios')
      .insert([
        {
          email,
          nombre: email.split('@')[0], // Nombre temporal basado en el email
          contraseña: password,
          autenticacion_social: false
        }
      ])
      .select()
      .single();

    if (profileError) throw profileError;

    return { 
      data: { ...authData, profile }, 
      error: null 
    };
  } catch (error) {
    return { 
      data: null, 
      error: {
        message: error.message,
        code: error.code,
        status: error.status
      }
    };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { 
      error: {
        message: error.message,
        code: error.code,
        status: error.status
      }
    };
  }
};

export const resetPassword = async (email) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: {
        message: error.message,
        code: error.code,
        status: error.status
      }
    };
  }
};

export const updatePassword = async (newPassword) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: {
        message: error.message,
        code: error.code,
        status: error.status
      }
    };
  }
};

export const updateProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: {
        message: error.message,
        code: error.code,
        status: error.status
      }
    };
  }
};

export const getProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: {
        message: error.message,
        code: error.code,
        status: error.status
      }
    };
  }
}; 
import { supabase } from '../config/supabase';

export const signInWithEmail = async (email, password) => {
  if (!email || !password) {
    throw new Error('El correo y la contraseña son requeridos');
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    // Obtener el perfil del usuario de la tabla usuarios
    const { data: userProfile, error: profileError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error al obtener el perfil:', profileError);
    }

    // Combinar los datos de autenticación con el perfil
    return {
      user: {
        ...authData.user,
        profile: userProfile || null
      },
      session: authData.session
    };
  } catch (error) {
    console.error('Error en signInWithEmail:', error);
    throw new Error(error.message);
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
  if (!email || !password) {
    throw new Error('El correo y la contraseña son requeridos');
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // Crear perfil de usuario en la tabla usuarios
    const { error: profileError } = await supabase
      .from('usuarios')
      .insert([
        {
          email,
          created_at: new Date(),
        }
      ]);

    if (profileError) {
      console.error('Error al crear el perfil:', profileError);
      throw profileError;
    }

    return {
      user: authData.user,
      session: authData.session
    };
  } catch (error) {
    console.error('Error en signUp:', error);
    throw new Error(error.message);
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error en signOut:', error);
    throw new Error(error.message);
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
    // Primero obtenemos el email del usuario
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabase
      .from('usuarios')
      .update(updates)
      .eq('email', userData.user.email)
      .select()
      .single()
      .throwOnError();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error en updateProfile:', error);
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
    // Primero obtenemos el email y avatar del usuario
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const avatar_url = userData.user.user_metadata?.avatar_url || null;

    // Primero verificamos si existe el perfil
    const { data: existingProfiles, error: checkError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', userData.user.email);

    if (checkError) throw checkError;

    // Si no existe el perfil, lo creamos
    if (!existingProfiles || existingProfiles.length === 0) {
      const { data: newProfile, error: createError } = await supabase
        .from('usuarios')
        .insert([
          {
            email: userData.user.email,
            nombre: userData.user.email.split('@')[0],
            fecha_creacion: new Date().toISOString(),
            autenticacion_social: !!avatar_url,
            avatar_url: avatar_url,
            contraseña: '' // Para evitar error de not null
          }
        ])
        .select()
        .single();

      if (createError) throw createError;
      return { data: newProfile, error: null };
    }

    // Si existe, devolvemos el primer perfil encontrado
    return { data: existingProfiles[0], error: null };
  } catch (error) {
    console.error('Error en getProfile:', error);
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

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    if (!user) return null;

    // Obtener el perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', user.email)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error al obtener el perfil:', profileError);
    }

    return {
      ...user,
      profile: profile || null
    };
  } catch (error) {
    console.error('Error en getCurrentUser:', error);
    return null;
  }
};

export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error en getSession:', error);
    return null;
  }
}; 
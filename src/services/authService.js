import { supabase } from '../config/supabase';

const handleAuthError = (error) => {
  if (!error) return null;

  // Mapeo de errores comunes de Supabase
  const errorMap = {
    'Invalid login credentials': 'Credenciales inválidas. Por favor verifica tu email y contraseña.',
    'Email not confirmed': 'Por favor confirma tu correo electrónico antes de iniciar sesión.',
    'Email already in use': 'Este correo electrónico ya está registrado.',
    'Signup requires a valid password': 'La contraseña debe tener al menos 6 caracteres.',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
    'User already registered': 'Este usuario ya está registrado.',
    'Invalid email': 'El correo electrónico no es válido.',
    'Network error': 'Error de conexión. Por favor verifica tu conexión a internet.',
  };

  const message = errorMap[error.message] || error.message;
  return new Error(message);
};

export const signInWithEmail = async (email, password) => {
  if (!email || !password) {
    throw new Error('El correo y la contraseña son requeridos');
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw handleAuthError(authError);

    // Obtener el perfil del usuario
    const { data: userProfile, error: profileError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error al obtener el perfil:', profileError);
    }

    return {
      user: {
        ...authData.user,
        profile: userProfile || null
      },
      session: authData.session,
      error: null
    };
  } catch (error) {
    console.error('Error en signInWithEmail:', error);
    return {
      user: null,
      session: null,
      error: handleAuthError(error)
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

    if (error) throw handleAuthError(error);

    return { data, error: null };
  } catch (error) {
    console.error('Error en signInWithGoogle:', error);
    return { 
      data: null, 
      error: handleAuthError(error)
    };
  }
};

export const signUp = async (email, password) => {
  if (!email || !password) {
    throw new Error('El correo y la contraseña son requeridos');
  }

  try {
    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('Este correo electrónico ya está registrado');
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw handleAuthError(authError);

    // Crear perfil de usuario
    const { error: profileError } = await supabase
      .from('usuarios')
      .insert([
        {
          email,
          created_at: new Date(),
          nombre: email.split('@')[0],
        }
      ]);

    if (profileError) {
      console.error('Error al crear el perfil:', profileError);
      throw handleAuthError(profileError);
    }

    return {
      user: authData.user,
      session: authData.session,
      error: null
    };
  } catch (error) {
    console.error('Error en signUp:', error);
    return {
      user: null,
      session: null,
      error: handleAuthError(error)
    };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw handleAuthError(error);
    return { error: null };
  } catch (error) {
    console.error('Error en signOut:', error);
    return { error: handleAuthError(error) };
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
    
    if (error) throw handleAuthError(error);
    if (!user) return { user: null, error: null };

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
      user: {
        ...user,
        profile: profile || null
      },
      error: null
    };
  } catch (error) {
    console.error('Error en getCurrentUser:', error);
    return {
      user: null,
      error: handleAuthError(error)
    };
  }
};

export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw handleAuthError(error);
    return { session, error: null };
  } catch (error) {
    console.error('Error en getSession:', error);
    return {
      session: null,
      error: handleAuthError(error)
    };
  }
}; 
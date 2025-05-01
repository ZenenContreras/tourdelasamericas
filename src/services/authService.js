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

export const signUp = async (email, password, nombre) => {
  if (!email || !password) {
    throw new Error('El correo y la contraseña son requeridos');
  }

  if (!nombre || nombre.trim() === '') {
    throw new Error('El nombre es requerido');
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

    // Crear perfil de usuario con el nombre de columna correcto
    const { error: profileError } = await supabase
      .from('usuarios')
      .insert([
        {
          email,
          nombre: nombre,
          fecha_creacion: new Date(), // Usar el nombre correcto de la columna
          autenticacion_social: false
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
    // Primero verificamos si hay una sesión activa
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.warn('Error al verificar la sesión:', sessionError);
      // Si hay error al verificar la sesión, limpiamos todo de todas formas
      await supabase.auth.signOut();
      return { error: null };
    }

    // Si no hay sesión, consideramos que ya está cerrada
    if (!session) {
      console.log('No hay sesión activa para cerrar');
      return { error: null };
    }

    // Si hay sesión, intentamos cerrarla normalmente
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error al cerrar sesión:', error);
      // Si falla el cierre de sesión normal, forzamos el cierre
      await supabase.auth.signOut({ scope: 'local' });
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error en signOut:', error);
    // En caso de cualquier error, intentamos limpiar la sesión localmente
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch (e) {
      console.warn('Error al limpiar sesión local:', e);
    }
    return { error: null };
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
    // Primero obtenemos el usuario autenticado
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    // Obtenemos el ID de la tabla usuarios
    const { data: userProfile, error: profileError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', userData.user.email)
      .single();

    if (profileError) throw profileError;

    // Actualizamos el nombre en la tabla usuarios
    const { data: userUpdate, error: userUpdateError } = await supabase
      .from('usuarios')
      .update({ nombre: updates.nombre })
      .eq('id', userProfile.id)
      .select()
      .single();

    if (userUpdateError) throw userUpdateError;

    // Verificamos si ya existe una dirección para este usuario
    const { data: existingAddress, error: addressCheckError } = await supabase
      .from('direcciones_envio')
      .select('*')
      .eq('usuario_id', userProfile.id)
      .single();

    // Solo manejamos el error si no es de "no encontrado"
    if (addressCheckError && addressCheckError.code !== 'PGRST116') {
      throw addressCheckError;
    }

    // Preparamos los datos de dirección
    const addressData = {
      usuario_id: userProfile.id,
      direccion: updates.direccion,
      ciudad: updates.ciudad,
      estado: updates.estado,
      codigo_postal: updates.codigo_postal,
      pais: updates.pais,
      telefono: updates.telefono
    };

    let addressUpdate;
    if (existingAddress) {
      // Actualizamos la dirección existente
      const { data, error } = await supabase
        .from('direcciones_envio')
        .update(addressData)
        .eq('usuario_id', userProfile.id)
        .select()
        .single();
      
      if (error) throw error;
      addressUpdate = data;
    } else {
      // Creamos una nueva dirección
      const { data, error } = await supabase
        .from('direcciones_envio')
        .insert([addressData])
        .select()
        .single();
      
      if (error) throw error;
      addressUpdate = data;
    }

    return { 
      data: {
        ...userUpdate,
        direccion_envio: addressUpdate
      }, 
      error: null 
    };
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

    // Obtenemos el perfil del usuario
    const { data: userProfile, error: profileError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', userData.user.email)
      .single();

    if (profileError) throw profileError;

    // Obtenemos la dirección de envío usando el ID de la tabla usuarios
    const { data: shippingAddress, error: addressError } = await supabase
      .from('direcciones_envio')
      .select('*')
      .eq('usuario_id', userProfile.id)
      .single();

    // No lanzamos error si no hay dirección, es normal que no exista al principio
    
    return { 
      data: {
        ...userProfile,
        avatar_url: avatar_url,
        direccion_envio: shippingAddress || null
      }, 
      error: null 
    };
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

export const resendVerificationEmail = async (email) => {
  try {
    // Supabase no tiene una función dedicada para reenviar correos de verificación,
    // pero podemos usar la función de restablecimiento de contraseña con un mensaje personalizado
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error al reenviar correo de verificación:', error);
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
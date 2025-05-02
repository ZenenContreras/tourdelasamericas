import { supabase } from '../config/supabase';

// Obtener ID numérico del usuario
const getUserNumericId = async (authUser) => {
  try {
    if (!authUser || !authUser.email) {
      throw new Error('Usuario no autenticado o email no disponible');
    }

    const { data, error } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', authUser.email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Usuario no encontrado');
      }
      throw error;
    }

    if (!data || !data.id) {
      throw new Error('ID de usuario no encontrado');
    }

    return data.id;
  } catch (error) {
    console.error('Error obteniendo ID numérico del usuario:', error);
    throw error;
  }
};

// Obtener todos los favoritos de un usuario
export const getUserFavorites = async (authUser) => {
  try {
    if (!authUser) {
      throw new Error('Usuario no autenticado');
    }

    const userId = await getUserNumericId(authUser);

    const { data, error } = await supabase
      .from('favoritos')
      .select(`
        id,
        producto_id,
        usuario_id,
        fecha_agregado,
        productos (
          id,
          nombre,
          descripcion,
          precio,
          stock,
          imagen_principal,
          categoria_id,
          categorias (
            id,
            nombre
          ),
          subcategorias (
            id,
            nombre
          )
        )
      `)
      .eq('usuario_id', userId)
      .order('fecha_agregado', { ascending: false });

    if (error) throw error;

    // Filtrar favoritos sin productos válidos
    const validFavorites = data?.filter(favorite => favorite.productos) || [];

    // Procesar las URLs de imágenes
    const processedFavorites = await Promise.all(validFavorites.map(async favorite => {
      if (favorite.productos?.imagen_principal) {
        const { data: imageData } = supabase.storage
          .from('productos')
          .getPublicUrl(favorite.productos.imagen_principal);
        
        return {
          ...favorite,
          productos: {
            ...favorite.productos,
            imagen_url: imageData?.publicUrl || null
          }
        };
      }
      return favorite;
    }));

    return {
      data: processedFavorites,
      error: null
    };
  } catch (error) {
    console.error('Error obteniendo favoritos:', error);
    return {
      data: [],
      error: error.message
    };
  }
};

// Agregar un producto a favoritos
export const addToFavorites = async (authUser, productId) => {
  try {
    if (!authUser) {
      throw new Error('Usuario no autenticado');
    }

    if (!productId) {
      throw new Error('ID de producto no válido');
    }

    const userId = await getUserNumericId(authUser);

    // Verificar si ya está en favoritos
    const { data: existingFavorite, error: checkError } = await supabase
      .from('favoritos')
      .select('id')
      .eq('usuario_id', userId)
      .eq('producto_id', productId)
      .maybeSingle();

    if (checkError) throw checkError;
    
    if (existingFavorite) {
      return {
        data: existingFavorite,
        error: null
      };
    }

    const { data, error } = await supabase
      .from('favoritos')
      .insert({
        usuario_id: userId,
        producto_id: productId
      })
      .select()
      .single();

    if (error) throw error;

    return {
      data,
      error: null
    };
  } catch (error) {
    console.error('Error agregando a favoritos:', error);
    return {
      data: null,
      error: error.message
    };
  }
};

// Eliminar un producto de favoritos
export const removeFromFavorites = async (authUser, productId) => {
  try {
    if (!authUser) {
      throw new Error('Usuario no autenticado');
    }

    if (!productId) {
      throw new Error('ID de producto no válido');
    }

    const userId = await getUserNumericId(authUser);

    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('usuario_id', userId)
      .eq('producto_id', productId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error eliminando de favoritos:', error);
    return { error: error.message };
  }
};

// Verificar si un producto está en favoritos
export const isProductFavorite = async (authUser, productId) => {
  try {
    if (!authUser) {
      return {
        isFavorite: false,
        error: 'Usuario no autenticado'
      };
    }

    if (!productId) {
      return {
        isFavorite: false,
        error: 'ID de producto no válido'
      };
    }

    const userId = await getUserNumericId(authUser);

    const { data, error } = await supabase
      .from('favoritos')
      .select('id')
      .eq('usuario_id', userId)
      .eq('producto_id', productId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;

    return {
      isFavorite: !!data,
      error: null
    };
  } catch (error) {
    console.error('Error verificando favorito:', error);
    return {
      isFavorite: false,
      error: error.message
    };
  }
}; 
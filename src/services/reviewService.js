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

// Obtener todas las reviews de un producto
export const getProductReviews = async (productId) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        estrellas,
        comentario,
        fecha_creacion,
        usuario_id,
        usuarios (
          id,
          nombre,
          email
        )
      `)
      .eq('producto_id', productId)
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;

    return {
      data: data || [],
      error: null
    };
  } catch (error) {
    console.error('Error obteniendo reviews:', error);
    return {
      data: [],
      error: error.message
    };
  }
};

// Obtener el rating promedio de un producto
export const getProductRating = async (productId) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('estrellas')
      .eq('producto_id', productId);

    if (error) throw error;

    const reviews = data || [];
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.estrellas, 0) / totalReviews
      : 0;

    return {
      averageRating,
      totalReviews,
      error: null
    };
  } catch (error) {
    console.error('Error obteniendo rating:', error);
    return {
      averageRating: 0,
      totalReviews: 0,
      error: error.message
    };
  }
};

// Verificar si un usuario ya ha dejado una review
export const hasUserReviewed = async (authUser, productId) => {
  try {
    const userId = await getUserNumericId(authUser);

    const { data, error } = await supabase
      .from('reviews')
      .select('id')
      .eq('usuario_id', userId)
      .eq('producto_id', productId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;

    return {
      hasReviewed: !!data,
      error: null
    };
  } catch (error) {
    console.error('Error verificando review:', error);
    return {
      hasReviewed: false,
      error: error.message
    };
  }
};

// Crear una nueva review
export const createReview = async (authUser, productId, rating, comment) => {
  try {
    const userId = await getUserNumericId(authUser);

    // Verificar si ya existe una review
    const { hasReviewed } = await hasUserReviewed(authUser, productId);
    if (hasReviewed) {
      throw new Error('Ya has dejado una review para este producto');
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        usuario_id: userId,
        producto_id: productId,
        estrellas: rating,
        comentario: comment
      })
      .select(`
        id,
        estrellas,
        comentario,
        fecha_creacion,
        usuario_id,
        usuarios (
          id,
          nombre,
          email
        )
      `)
      .single();

    if (error) throw error;

    return {
      data,
      error: null
    };
  } catch (error) {
    console.error('Error creando review:', error);
    return {
      data: null,
      error: error.message
    };
  }
};

// Actualizar una review existente
export const updateReview = async (reviewId, authUser, rating, comment) => {
  try {
    const userId = await getUserNumericId(authUser);
    if (!userId) throw new Error('Usuario no encontrado');

    const { data, error } = await supabase
      .from('reviews')
      .update({
        estrellas: rating,
        comentario: comment
      })
      .eq('id', reviewId)
      .eq('usuario_id', userId)
      .select(`
        *,
        usuarios (
          id,
          nombre,
          email
        )
      `)
      .single();

    if (error) throw error;

    return {
      data,
      error: null
    };
  } catch (error) {
    console.error('Error actualizando review:', error);
    return {
      data: null,
      error: error.message
    };
  }
};

// Eliminar una review
export const deleteReview = async (reviewId, authUser) => {
  try {
    const userId = await getUserNumericId(authUser);

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)
      .eq('usuario_id', userId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error eliminando review:', error);
    return { error: error.message };
  }
}; 
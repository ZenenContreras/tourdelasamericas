import { supabase } from '../config/supabase';

// Obtener ID numérico del usuario
const getUserNumericId = async (authUser) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', authUser.email)
      .single();

    if (error) throw error;
    return data?.id;
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
        *,
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
      data,
      error: null
    };
  } catch (error) {
    console.error('Error obteniendo reviews:', error);
    return {
      data: null,
      error: error.message
    };
  }
};

// Obtener el promedio de estrellas de un producto
export const getProductRating = async (productId) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('estrellas')
      .eq('producto_id', productId);

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        error: null
      };
    }

    const totalStars = data.reduce((sum, review) => sum + review.estrellas, 0);
    const averageRating = totalStars / data.length;

    return {
      averageRating,
      totalReviews: data.length,
      error: null
    };
  } catch (error) {
    console.error('Error calculando rating:', error);
    return {
      averageRating: 0,
      totalReviews: 0,
      error: error.message
    };
  }
};

// Crear una nueva review
export const createReview = async (authUser, productId, rating, comment) => {
  try {
    // Obtener ID numérico del usuario
    const userId = await getUserNumericId(authUser);
    if (!userId) throw new Error('Usuario no encontrado');

    // Verificar si el usuario ya ha dejado una review para este producto
    const { data: existingReview, error: checkError } = await supabase
      .from('reviews')
      .select('id')
      .eq('usuario_id', userId)
      .eq('producto_id', productId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') throw checkError;
    
    if (existingReview) {
      throw new Error('Ya has dejado una reseña para este producto');
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
    if (!userId) throw new Error('Usuario no encontrado');

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

// Verificar si un usuario ya ha dejado una review
export const hasUserReviewed = async (authUser, productId) => {
  try {
    const userId = await getUserNumericId(authUser);
    if (!userId) throw new Error('Usuario no encontrado');

    const { data, error } = await supabase
      .from('reviews')
      .select('id')
      .eq('usuario_id', userId)
      .eq('producto_id', productId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return {
      hasReviewed: !!data,
      error: null
    };
  } catch (error) {
    console.error('Error verificando review de usuario:', error);
    return {
      hasReviewed: false,
      error: error.message
    };
  }
}; 
import { supabase } from '../config/supabase';

// Cache para URLs de imágenes
const imageUrlCache = new Map();

// Función para obtener URL de imagen con caché
const getImageUrl = async (imagePath) => {
  if (!imagePath) return null;
  
  if (imageUrlCache.has(imagePath)) {
    return imageUrlCache.get(imagePath);
  }

  const { data } = supabase.storage
    .from('productos')
    .getPublicUrl(imagePath);

  imageUrlCache.set(imagePath, data.publicUrl);
  return data.publicUrl;
};

// Cargar productos con información completa
export const loadProducts = async (filters = {}, categoria_id = null) => {
  try {
    let query = supabase
      .from('productos')
      .select(`
        *,
        categorias (
          id,
          nombre
        ),
        subcategorias (
          id,
          nombre
        ),
        reviews (
          id,
          estrellas
        )
      `);

    // Aplicar filtros
    if (categoria_id) {
      query = query.eq('categoria_id', categoria_id);
    }

    if (filters.subcategory) {
      query = query.eq('subcategoria_id', filters.subcategory);
    }

    if (filters.minPrice) {
      query = query.gte('precio', filters.minPrice);
    }

    if (filters.maxPrice) {
      query = query.lte('precio', filters.maxPrice);
    }

    if (filters.search) {
      query = query.or(`nombre.ilike.%${filters.search}%,descripcion.ilike.%${filters.search}%`);
    }

    // Ordenar resultados
    switch (filters.sortBy) {
      case 'nameAsc':
        query = query.order('nombre', { ascending: true });
        break;
      case 'nameDesc':
        query = query.order('nombre', { ascending: false });
        break;
      case 'priceAsc':
        query = query.order('precio', { ascending: true });
        break;
      case 'priceDesc':
        query = query.order('precio', { ascending: false });
        break;
      default:
        query = query.order('nombre', { ascending: true });
    }

    const { data, error } = await query;

    if (error) throw error;

    // Procesar y formatear los datos
    const formattedProducts = await Promise.all(data.map(async product => {
      const imageUrl = await getImageUrl(product.imagen_principal);
      
      // Calcular rating promedio
      const averageRating = product.reviews && product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.estrellas, 0) / product.reviews.length
        : 0;

      return {
        ...product,
        precio: parseFloat(product.precio),
        categoria: product.categorias?.nombre || null,
        subcategoria: product.subcategorias?.nombre || null,
        imagen_url: imageUrl,
        rating: averageRating,
        total_reviews: product.reviews?.length || 0
      };
    }));

    return {
      data: formattedProducts,
      error: null
    };
  } catch (error) {
    console.error('Error cargando productos:', error);
    return {
      data: null,
      error: error.message
    };
  }
};

// Verificar stock disponible
export const checkStock = async (productId, quantity) => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('stock')
      .eq('id', productId)
      .single();

    if (error) throw error;

    const available = data.stock >= quantity;

    return {
      available,
      currentStock: data.stock,
      error: null
    };
  } catch (error) {
    console.error('Error verificando stock:', error);
    return {
      available: false,
      currentStock: 0,
      error: error.message
    };
  }
};

// Actualizar stock
export const updateStock = async (productId, newStock) => {
  try {
    const { error } = await supabase
      .from('productos')
      .update({ stock: newStock })
      .eq('id', productId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error actualizando stock:', error);
    return { error: error.message };
  }
};

// Obtener producto por ID con información completa
export const getProductById = async (productId) => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select(`
        *,
        categorias (
          id,
          nombre
        ),
        subcategorias (
          id,
          nombre
        ),
        reviews (
          id,
          estrellas,
          comentario,
          fecha_creacion,
          usuarios (
            id,
            nombre,
            email
          )
        )
      `)
      .eq('id', productId)
      .single();

    if (error) throw error;

    const imageUrl = await getImageUrl(data.imagen_principal);

    // Calcular rating promedio
    const averageRating = data.reviews && data.reviews.length > 0
      ? data.reviews.reduce((sum, review) => sum + review.estrellas, 0) / data.reviews.length
      : 0;

    return {
      data: {
        ...data,
        precio: parseFloat(data.precio),
        categoria: data.categorias?.nombre || null,
        subcategoria: data.subcategorias?.nombre || null,
        imagen_url: imageUrl,
        rating: averageRating,
        total_reviews: data.reviews?.length || 0
      },
      error: null
    };
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    return {
      data: null,
      error: error.message
    };
  }
}; 
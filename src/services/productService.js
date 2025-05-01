import { supabase } from '../config/supabase';

const processImage = async (producto) => {
  if (producto.imagen_principal) {
    const url = supabase.storage
      .from('productos')
      .getPublicUrl(producto.imagen_principal).data.publicUrl;
    return { ...producto, imagen_url: url };
  }
  return producto;
};

// Función para cargar productos con filtros
export const loadProducts = async (filters = {}, categoria_id = null) => {
  try {
    let query = supabase
      .from('productos')
      .select(`
        id,
        nombre,
        descripcion,
        precio,
        stock,
        imagen_principal,
        categoria_id,
        subcategoria_id,
        categorias (
          id,
          nombre
        )
      `);

    // Filtrar por categoría_id si se proporciona
    if (categoria_id) {
      query = query.eq('categoria_id', categoria_id);
    }

    // Aplicar filtros
    if (filters.minPrice) {
      query = query.gte('precio', parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      query = query.lte('precio', parseFloat(filters.maxPrice));
    }
    if (filters.search) {
      query = query.ilike('nombre', `%${filters.search}%`);
    }
    if (filters.subcategory) {
      query = query.eq('subcategoria_id', parseInt(filters.subcategory));
    }

    // Aplicar ordenamiento
    switch (filters.sortBy) {
      case 'precio-asc':
        query = query.order('precio', { ascending: true });
        break;
      case 'precio-desc':
        query = query.order('precio', { ascending: false });
        break;
      case 'nombre-asc':
        query = query.order('nombre', { ascending: true });
        break;
      case 'nombre-desc':
        query = query.order('nombre', { ascending: false });
        break;
      default:
        query = query.order('nombre', { ascending: true });
    }

    const { data, error } = await query;

    if (error) throw error;

    // Procesar las imágenes y datos
    const processedData = await Promise.all(data.map(async (item) => {
      const processedItem = await processImage(item);
      return {
        ...processedItem,
        precio: parseFloat(item.precio),
        categoria: item.categorias?.nombre || null,
        subcategoria_id: item.subcategoria_id
      };
    }));

    return {
      data: processedData,
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

// Función para obtener un producto por ID
export const getProductById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select(`
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
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Procesar la imagen
    const processedItem = await processImage(data);

    return {
      data: {
        ...processedItem,
        precio: parseFloat(data.precio),
        categoria: data.categorias?.nombre || null
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

// Función para verificar stock disponible
export const checkStock = async (productId, quantity) => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('stock')
      .eq('id', productId)
      .single();

    if (error) throw error;

    return {
      available: data.stock >= quantity,
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

// Función para actualizar el stock
export const updateStock = async (productId, newStock) => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .update({ stock: newStock })
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;

    return {
      data,
      error: null
    };
  } catch (error) {
    console.error('Error actualizando stock:', error);
    return {
      data: null,
      error: error.message
    };
  }
}; 
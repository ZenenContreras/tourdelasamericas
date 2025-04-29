import { supabase } from '../config/supabase';

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

    return {
      data: data.map(item => ({
        ...item,
        precio: parseFloat(item.precio),
        categoria: item.categorias?.nombre || null
      })),
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
export const getProductById = async (id, table = 'productos') => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select(`
        id,
        nombre,
        descripcion,
        precio,
        stock,
        imagen_url,
        categorias (
          id,
          nombre
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      data: {
        ...data,
        precio: parseFloat(data.precio),
        categoria: data.categorias?.nombre || null
      },
      error: null
    };
  } catch (error) {
    console.error(`Error obteniendo ${table}:`, error);
    return {
      data: null,
      error: error.message
    };
  }
};

// Función para verificar stock disponible
export const checkStock = async (productId, quantity, table = 'productos') => {
  try {
    const { data, error } = await supabase
      .from(table)
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
export const updateStock = async (productId, newStock, table = 'productos') => {
  try {
    const { data, error } = await supabase
      .from(table)
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
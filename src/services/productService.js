import { supabase } from '../config/supabase';

// Cache para URL de imágenes para evitar recálculos
const imageUrlCache = new Map();

const processImage = async (producto) => {
  // Si ya tenemos la URL en caché, usarla en lugar de recalcular
  if (producto.imagen_principal) {
    const cacheKey = `productos/${producto.imagen_principal}`;
    
    if (imageUrlCache.has(cacheKey)) {
      return { ...producto, imagen_url: imageUrlCache.get(cacheKey) };
    }
    
    const url = supabase.storage
      .from('productos')
      .getPublicUrl(producto.imagen_principal).data.publicUrl;
    
    // Guardar en caché para uso futuro
    imageUrlCache.set(cacheKey, url);
    return { ...producto, imagen_url: url };
  }
  return producto;
};

// Función optimizada para cargar productos con filtros
export const loadProducts = async (filters = {}, categoria_id = null) => {
  try {
    // Campos mínimos necesarios para mejorar rendimiento de la consulta
    const baseQuery = supabase
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

    // Construir un único objeto de consulta para mejorar rendimiento
    const queryParams = {};
    const filterConditions = [];
    
    // Filtrar por categoría_id si se proporciona
    if (categoria_id) {
      queryParams['categoria_id'] = categoria_id;
      filterConditions.push('categoria_id.eq.' + categoria_id);
    }

    // Aplicar filtros de precio
    if (filters.minPrice) {
      filterConditions.push('precio.gte.' + parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filterConditions.push('precio.lte.' + parseFloat(filters.maxPrice));
    }
    
    // Búsqueda optimizada
    if (filters.search) {
      filterConditions.push(`nombre.ilike.%${filters.search}%`);
    }
    
    // Subcategoría
    if (filters.subcategory && filters.subcategory !== '') {
      queryParams['subcategoria_id'] = parseInt(filters.subcategory);
      filterConditions.push('subcategoria_id.eq.' + parseInt(filters.subcategory));
    }

    // Construir consulta final
    let query = baseQuery;
    
    // Aplicar filtros usando .match para consultas más eficientes cuando sea posible
    if (Object.keys(queryParams).length > 0) {
      query = query.match(queryParams);
    }
    
    // Aplicar otros filtros complejos
    filterConditions.forEach(condition => {
      const [field, op, value] = condition.split('.');
      if (op === 'ilike') {
        query = query.ilike(field, value);
      } else if (op === 'gte') {
        query = query.gte(field, parseFloat(value));
      } else if (op === 'lte') {
        query = query.lte(field, parseFloat(value));
      }
      // Para eq ya está cubierto con .match
    });

    // Aplicar ordenamiento
    switch (filters.sortBy) {
      case 'priceAsc':
        query = query.order('precio', { ascending: true });
        break;
      case 'priceDesc':
        query = query.order('precio', { ascending: false });
        break;
      case 'nameDesc':
        query = query.order('nombre', { ascending: false });
        break;
      default:
        query = query.order('nombre', { ascending: true });
    }

    // Ejecutar consulta
    const { data, error } = await query;

    if (error) throw error;

    // Procesamiento de imágenes en paralelo para mejor rendimiento
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

// Función optimizada para obtener un producto por ID
export const getProductById = async (id) => {
  try {
    // Verificar caché para imágenes
    const cacheKey = `product-${id}`;
    
    // Consulta al servidor
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
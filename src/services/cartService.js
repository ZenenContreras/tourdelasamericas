import { supabase } from '../config/supabase';
import { checkStock, updateStock } from './productService';

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

// Función para obtener el ID numérico del usuario usando su email
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

// Cargar el carrito del usuario con información completa
export const loadCart = async (authUser) => {
  try {
    const userId = await getUserNumericId(authUser);
    if (!userId) throw new Error('Usuario no encontrado');

    const { data, error } = await supabase
      .from('carrito')
      .select(`
        id,
        cantidad,
        producto_id,
        productos (
          id,
          nombre,
          descripcion,
          precio,
          stock,
          imagen_principal,
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
      .eq('usuario_id', userId);

    if (error) throw error;

    // Procesar y formatear los datos del carrito
    const formattedCartItems = await Promise.all(data.map(async item => {
      const imageUrl = await getImageUrl(item.productos.imagen_principal);
      
      return {
        id: item.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        producto: {
          ...item.productos,
          precio: parseFloat(item.productos.precio),
          categoria: item.productos.categorias?.nombre || null,
          subcategoria: item.productos.subcategorias?.nombre || null,
          imagen_url: imageUrl
        }
      };
    }));

    return {
      data: formattedCartItems,
      error: null
    };
  } catch (error) {
    console.error('Error cargando carrito:', error);
    return {
      data: null,
      error: error.message
    };
  }
};

// Agregar producto al carrito con validaciones
export const addToCart = async (authUser, productId, quantity = 1) => {
  try {
    const userId = await getUserNumericId(authUser);
    if (!userId) throw new Error('Usuario no encontrado');

    // Validar cantidad
    if (quantity <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }

    // Verificar stock disponible
    const { available, currentStock, error: stockError } = await checkStock(productId, quantity);
    
    if (stockError) throw new Error(stockError);
    if (!available) throw new Error('Stock no disponible');

    // Verificar si el producto ya está en el carrito
    const { data: existingItem } = await supabase
      .from('carrito')
      .select('id, cantidad')
      .eq('usuario_id', userId)
      .eq('producto_id', productId)
      .single();

    let result;
    
    if (existingItem) {
      // Actualizar cantidad si ya existe
      const newQuantity = existingItem.cantidad + quantity;
      
      // Verificar stock para la nueva cantidad
      if (newQuantity > currentStock) {
        throw new Error('Stock insuficiente');
      }

      result = await supabase
        .from('carrito')
        .update({ cantidad: newQuantity })
        .eq('id', existingItem.id)
        .select()
        .single();
    } else {
      // Insertar nuevo item
      result = await supabase
        .from('carrito')
        .insert({
          usuario_id: userId,
          producto_id: productId,
          cantidad: quantity
        })
        .select()
        .single();
    }

    if (result.error) throw result.error;

    // Obtener información completa del producto
    const { data: productData } = await supabase
      .from('productos')
      .select(`
        *,
        categorias (nombre),
        subcategorias (nombre)
      `)
      .eq('id', productId)
      .single();

    const imageUrl = await getImageUrl(productData.imagen_principal);

    return {
      data: {
        ...result.data,
        producto: {
          ...productData,
          precio: parseFloat(productData.precio),
          categoria: productData.categorias?.nombre || null,
          subcategoria: productData.subcategorias?.nombre || null,
          imagen_url: imageUrl
        }
      },
      error: null
    };
  } catch (error) {
    console.error('Error agregando al carrito:', error);
    return {
      data: null,
      error: error.message
    };
  }
};

// Actualizar cantidad en el carrito con validaciones
export const updateCartItem = async (authUser, cartItemId, newQuantity) => {
  try {
    const userId = await getUserNumericId(authUser);
    if (!userId) throw new Error('Usuario no encontrado');

    // Validar cantidad
    if (newQuantity < 0) {
      throw new Error('La cantidad no puede ser negativa');
    }

    // Obtener información del item del carrito
    const { data: cartItem, error: cartError } = await supabase
      .from('carrito')
      .select('producto_id, cantidad')
      .eq('id', cartItemId)
      .eq('usuario_id', userId)
      .single();

    if (cartError) throw cartError;

    // Si la cantidad es 0, eliminar el item
    if (newQuantity === 0) {
      return await removeFromCart(authUser, cartItemId);
    }

    // Verificar stock disponible
    const { available, error: stockError } = await checkStock(cartItem.producto_id, newQuantity);
    
    if (stockError) throw new Error(stockError);
    if (!available) throw new Error('Stock no disponible');

    // Actualizar cantidad
    const { data, error } = await supabase
      .from('carrito')
      .update({ cantidad: newQuantity })
      .eq('id', cartItemId)
      .eq('usuario_id', userId)
      .select()
      .single();

    if (error) throw error;

    return {
      data,
      error: null
    };
  } catch (error) {
    console.error('Error actualizando cantidad:', error);
    return {
      data: null,
      error: error.message
    };
  }
};

// Eliminar item del carrito
export const removeFromCart = async (authUser, cartItemId) => {
  try {
    const userId = await getUserNumericId(authUser);
    if (!userId) throw new Error('Usuario no encontrado');

    const { error } = await supabase
      .from('carrito')
      .delete()
      .eq('id', cartItemId)
      .eq('usuario_id', userId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error eliminando del carrito:', error);
    return { error: error.message };
  }
};

// Vaciar carrito
export const clearCart = async (authUser) => {
  try {
    const userId = await getUserNumericId(authUser);
    if (!userId) throw new Error('Usuario no encontrado');

    const { error } = await supabase
      .from('carrito')
      .delete()
      .eq('usuario_id', userId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error vaciando carrito:', error);
    return { error: error.message };
  }
};

// Calcular total del carrito con descuentos
export const calculateCartTotal = async (authUser, couponCode = null) => {
  try {
    const userId = await getUserNumericId(authUser);
    if (!userId) throw new Error('Usuario no encontrado');

    // Obtener items del carrito
    const { data: cartItems, error } = await supabase
      .from('carrito')
      .select(`
        cantidad,
        productos (
          precio,
          stock
        )
      `)
      .eq('usuario_id', userId);

    if (error) throw error;

    // Calcular subtotal
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.productos.precio) * item.cantidad);
    }, 0);

    // Aplicar descuento si hay cupón
    let discount = 0;
    if (couponCode) {
      const { data: coupon } = await supabase
        .from('cupones')
        .select('descuento')
        .eq('codigo', couponCode)
        .single();

      if (coupon) {
        discount = (subtotal * coupon.descuento) / 100;
      }
    }

    // Calcular total final
    const total = subtotal - discount;

    return {
      subtotal,
      discount,
      total,
      error: null
    };
  } catch (error) {
    console.error('Error calculando total:', error);
    return {
      subtotal: 0,
      discount: 0,
      total: 0,
      error: error.message
    };
  }
};

// Preparar carrito para Stripe
export const prepareCartForStripe = async (authUser) => {
  try {
    const userId = await getUserNumericId(authUser);
    if (!userId) throw new Error('Usuario no encontrado');

    const { data: cartItems, error } = await loadCart(authUser);
    
    if (error) throw error;
    
    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.producto.nombre,
          description: item.producto.descripcion,
          images: item.producto.imagen_url ? [item.producto.imagen_url] : []
        },
        unit_amount: Math.round(item.producto.precio * 100) // Stripe usa centavos
      },
      quantity: item.cantidad
    }));

    return {
      lineItems,
      error: null
    };
  } catch (error) {
    console.error('Error preparando carrito para Stripe:', error);
    return {
      lineItems: [],
      error: error.message
    };
  }
};

// Verificar disponibilidad de stock para todos los items
export const verifyStockAvailability = async (authUser) => {
  try {
    const userId = await getUserNumericId(authUser);
    if (!userId) throw new Error('Usuario no encontrado');

    const { data: cartItems, error } = await loadCart(authUser);
    
    if (error) throw error;

    const stockIssues = [];

    for (const item of cartItems) {
      if (item.cantidad > item.producto.stock) {
        stockIssues.push({
          producto_id: item.producto_id,
          nombre: item.producto.nombre,
          stock_disponible: item.producto.stock,
          cantidad_solicitada: item.cantidad
        });
      }
    }

    return {
      available: stockIssues.length === 0,
      issues: stockIssues,
      error: null
    };
  } catch (error) {
    console.error('Error verificando stock:', error);
    return {
      available: false,
      issues: [],
      error: error.message
    };
  }
};

// Validar cupón de descuento
export const validateCoupon = async (couponCode) => {
  try {
    // Verificar si el cupón existe y está activo
    const { data, error } = await supabase
      .from('cupones')
      .select('*')
      .eq('codigo', couponCode)
      .eq('activo', true)
      .single();

    if (error) throw error;

    if (!data) {
      throw new Error('Cupón no válido o expirado');
    }

    // Verificar si el cupón ha expirado
    if (data.fecha_expiracion && new Date(data.fecha_expiracion) < new Date()) {
      throw new Error('Cupón expirado');
    }

    // Verificar si el cupón ha alcanzado su límite de uso
    if (data.limite_uso && data.usos >= data.limite_uso) {
      throw new Error('Cupón ha alcanzado su límite de uso');
    }

    return {
      data,
      error: null
    };
  } catch (error) {
    console.error('Error validando cupón:', error);
    return {
      data: null,
      error: error.message
    };
  }
}; 
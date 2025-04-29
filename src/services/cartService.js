import { supabase } from '../config/supabase';
import { checkStock, updateStock } from './productService';

// Cargar el carrito del usuario
export const loadCart = async (userId) => {
  try {
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
          imagen_url,
          categorias (
            id,
            nombre
          )
        )
      `)
      .eq('usuario_id', userId);

    if (error) throw error;

    return {
      data: data.map(item => ({
        id: item.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        producto: {
          ...item.productos,
          precio: parseFloat(item.productos.precio),
          categoria: item.productos.categorias?.nombre || null
        }
      })),
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

// Agregar producto al carrito
export const addToCart = async (userId, productId, quantity = 1, table = 'productos') => {
  try {
    // Verificar stock disponible
    const { available, currentStock, error: stockError } = await checkStock(productId, quantity, table);
    
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

    return {
      data: result.data,
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

// Actualizar cantidad en el carrito
export const updateCartItem = async (userId, cartItemId, newQuantity, table = 'productos') => {
  try {
    // Obtener información del item del carrito
    const { data: cartItem, error: cartError } = await supabase
      .from('carrito')
      .select('producto_id')
      .eq('id', cartItemId)
      .eq('usuario_id', userId)
      .single();

    if (cartError) throw cartError;

    // Verificar stock disponible
    const { available, error: stockError } = await checkStock(cartItem.producto_id, newQuantity, table);
    
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
export const removeFromCart = async (userId, cartItemId) => {
  try {
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
export const clearCart = async (userId) => {
  try {
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

// Calcular total del carrito
export const calculateCartTotal = async (userId) => {
  try {
    const { data: cartItems, error } = await supabase
      .from('carrito')
      .select(`
        cantidad,
        productos (
          precio
        )
      `)
      .eq('usuario_id', userId);

    if (error) throw error;

    const total = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.productos.precio) * item.cantidad);
    }, 0);

    return {
      total,
      error: null
    };
  } catch (error) {
    console.error('Error calculando total:', error);
    return {
      total: 0,
      error: error.message
    };
  }
};

// Preparar carrito para Stripe
export const prepareCartForStripe = async (userId) => {
  try {
    const { data: cartItems, error } = await loadCart(userId);
    
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
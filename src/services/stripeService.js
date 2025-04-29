import { supabase } from '../config/supabase';

// Crear una sesión de checkout de Stripe
export const createCheckoutSession = async (userId, lineItems) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { userId, lineItems }
    });

    if (error) throw error;

    return { sessionUrl: data.url, error: null };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return { sessionUrl: null, error: error.message };
  }
};

// Verificar el estado del pago
export const verifyPayment = async (sessionId) => {
  try {
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: { sessionId }
    });

    if (error) throw error;

    return { status: data.status, error: null };
  } catch (error) {
    console.error('Error verifying payment:', error);
    return { status: null, error: error.message };
  }
};

// Crear un pedido después de un pago exitoso
export const createOrder = async (userId, cartItems, shippingAddress, paymentDetails) => {
  try {
    const { data: order, error: orderError } = await supabase
      .from('pedidos')
      .insert({
        usuario_id: userId,
        estado: 'pendiente',
        direccion_envio: shippingAddress,
        detalles_pago: paymentDetails,
        fecha_pedido: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Crear detalles del pedido
    const orderItems = cartItems.map(item => ({
      pedido_id: order.id,
      producto_id: item.producto_id,
      cantidad: item.cantidad,
      precio_unitario: item.producto.precio
    }));

    const { error: itemsError } = await supabase
      .from('detalles_pedido')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Actualizar el stock de los productos
    for (const item of cartItems) {
      const { error: stockError } = await supabase
        .rpc('update_product_stock', {
          p_id: item.producto_id,
          quantity: item.cantidad
        });

      if (stockError) throw stockError;
    }

    // Limpiar el carrito del usuario
    const { error: cartError } = await supabase
      .from('carrito')
      .delete()
      .eq('usuario_id', userId);

    if (cartError) throw cartError;

    return { order, error: null };
  } catch (error) {
    console.error('Error creating order:', error);
    return { order: null, error: error.message };
  }
};

// Obtener el historial de pedidos de un usuario
export const getOrderHistory = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        id,
        estado,
        fecha_pedido,
        direccion_envio,
        detalles_pago,
        detalles_pedido (
          id,
          cantidad,
          precio_unitario,
          productos (
            id,
            nombre,
            descripcion,
            imagen_url
          )
        )
      `)
      .eq('usuario_id', userId)
      .order('fecha_pedido', { ascending: false });

    if (error) throw error;

    return { orders: data, error: null };
  } catch (error) {
    console.error('Error getting order history:', error);
    return { orders: [], error: error.message };
  }
};

// Actualizar el estado de un pedido
export const updateOrderStatus = async (orderId, status) => {
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .update({ estado: status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    return { order: data, error: null };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { order: null, error: error.message };
  }
};

// Cancelar un pedido
export const cancelOrder = async (orderId) => {
  try {
    // Obtener los detalles del pedido
    const { data: orderDetails, error: detailsError } = await supabase
      .from('detalles_pedido')
      .select('producto_id, cantidad')
      .eq('pedido_id', orderId);

    if (detailsError) throw detailsError;

    // Restaurar el stock de los productos
    for (const item of orderDetails) {
      const { error: stockError } = await supabase
        .rpc('restore_product_stock', {
          p_id: item.producto_id,
          quantity: item.cantidad
        });

      if (stockError) throw stockError;
    }

    // Actualizar el estado del pedido a cancelado
    const { data: order, error: orderError } = await supabase
      .from('pedidos')
      .update({ estado: 'cancelado' })
      .eq('id', orderId)
      .select()
      .single();

    if (orderError) throw orderError;

    return { order, error: null };
  } catch (error) {
    console.error('Error canceling order:', error);
    return { order: null, error: error.message };
  }
}; 
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import { toast } from 'react-hot-toast';
import * as cartService from '../services/cartService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Cargar el carrito cuando el usuario inicia sesión
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCartItems([]);
      setLoading(false);
    }
  }, [user]);

  // Actualizar total cuando cambian los items
  useEffect(() => {
    if (user && cartItems.length > 0) {
      updateCartTotal();
    } else {
      setTotal(0);
    }
  }, [cartItems, user]);

  // Cargar el carrito
  const loadCart = async () => {
    try {
      setLoading(true);
      const { data, error } = await cartService.loadCart(user.id);
      
      if (error) throw error;
      
      setCartItems(data || []);
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      setError(error.message);
      toast.error(t('cart.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  // Actualizar total del carrito
  const updateCartTotal = async () => {
    try {
      const { total, error } = await cartService.calculateCartTotal(user.id);
      
      if (error) throw error;
      
      setTotal(total);
    } catch (error) {
      console.error('Error al calcular total:', error);
      toast.error(t('cart.errorCalculatingTotal'));
    }
  };

  // Agregar al carrito
  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      toast.error(t('cart.loginRequired'));
      return;
    }

    try {
      const { data, error } = await cartService.addToCart(user.id, product.id, quantity);
      
      if (error) throw error;
      
      await loadCart(); // Recargar carrito para obtener datos actualizados
      toast.success(t('cart.addedToCart'));
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      toast.error(error.message || t('cart.errorAdding'));
    }
  };

  // Actualizar cantidad
  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      const { error } = await cartService.updateCartItem(user.id, cartItemId, newQuantity);
      
      if (error) throw error;
      
      await loadCart(); // Recargar carrito para obtener datos actualizados
      toast.success(t('cart.updated'));
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      toast.error(error.message || t('cart.errorUpdating'));
    }
  };

  // Eliminar del carrito
  const removeFromCart = async (cartItemId) => {
    try {
      const { error } = await cartService.removeFromCart(user.id, cartItemId);
      
      if (error) throw error;
      
      await loadCart(); // Recargar carrito para obtener datos actualizados
      toast.success(t('cart.removed'));
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      toast.error(t('cart.errorRemoving'));
    }
  };

  // Vaciar carrito
  const clearCart = async () => {
    try {
      const { error } = await cartService.clearCart(user.id);
      
      if (error) throw error;
      
      setCartItems([]);
      setTotal(0);
      toast.success(t('cart.cleared'));
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
      toast.error(t('cart.errorClearing'));
    }
  };

  // Preparar carrito para Stripe
  const prepareForCheckout = async () => {
    try {
      const { lineItems, error } = await cartService.prepareCartForStripe(user.id);
      
      if (error) throw error;
      
      return { lineItems, error: null };
    } catch (error) {
      console.error('Error al preparar checkout:', error);
      return { lineItems: [], error: error.message };
    }
  };

  // Verificar si un producto está en el carrito
  const isInCart = (productId) => {
    return cartItems.some(item => item.producto_id === productId);
  };

  // Obtener la cantidad de un producto en el carrito
  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => item.producto_id === productId);
    return item ? item.cantidad : 0;
  };

  const value = {
    cartItems,
    loading,
    error,
    total,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isInCart,
    getItemQuantity,
    prepareForCheckout
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 
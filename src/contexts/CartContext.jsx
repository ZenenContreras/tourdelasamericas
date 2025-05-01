import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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

  // Memoizar la función de cargar el carrito
  const loadCart = useCallback(async () => {
    if (!user) return;
    
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
  }, [user, t]);

  // Memoizar la función de actualizar el total
  const updateCartTotal = useCallback(async () => {
    if (!user || cartItems.length === 0) {
      setTotal(0);
      return;
    }

    try {
      const { total, error } = await cartService.calculateCartTotal(user.id);
      
      if (error) throw error;
      
      setTotal(total);
    } catch (error) {
      console.error('Error al calcular total:', error);
      toast.error(t('cart.errorCalculatingTotal'));
    }
  }, [user, cartItems.length, t]);

  // Cargar el carrito cuando el usuario inicia sesión
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCartItems([]);
      setLoading(false);
    }
  }, [user, loadCart]);

  // Actualizar total cuando cambian los items
  useEffect(() => {
    if (user && cartItems.length > 0) {
      updateCartTotal();
    } else {
      setTotal(0);
    }
  }, [cartItems, user, updateCartTotal]);

  // Memoizar la función de agregar al carrito
  const addToCart = useCallback(async (product) => {
    if (!user) {
      toast.error(t('cart.loginRequired'));
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await cartService.addToCart(user.id, product);
      
      if (error) throw error;
      
      setCartItems(prev => [...prev, data]);
      toast.success(t('cart.addedToCart'));
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      toast.error(t('cart.errorAdding'));
    } finally {
      setLoading(false);
    }
  }, [user, t]);

  // Memoizar la función de actualizar cantidad
  const updateQuantity = useCallback(async (productId, quantity) => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await cartService.updateCartItemQuantity(user.id, productId, quantity);
      
      if (error) throw error;
      
      setCartItems(prev => 
        prev.map(item => 
          item.id === productId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      toast.error(t('cart.errorUpdating'));
    } finally {
      setLoading(false);
    }
  }, [user, t]);

  // Memoizar la función de eliminar del carrito
  const removeFromCart = useCallback(async (productId) => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await cartService.removeFromCart(user.id, productId);
      
      if (error) throw error;
      
      setCartItems(prev => prev.filter(item => item.id !== productId));
      toast.success(t('cart.removedFromCart'));
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      toast.error(t('cart.errorRemoving'));
    } finally {
      setLoading(false);
    }
  }, [user, t]);

  // Memoizar la función de verificar si un producto está en el carrito
  const isInCart = useCallback((productId) => {
    return cartItems.some(item => item.id === productId);
  }, [cartItems]);

  // Memoizar la función de obtener la cantidad de un producto
  const getItemQuantity = useCallback((productId) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }, [cartItems]);

  // Memoizar el valor del contexto
  const value = useMemo(() => ({
    cartItems,
    loading,
    error,
    total,
    addToCart,
    updateQuantity,
    removeFromCart,
    isInCart,
    getItemQuantity
  }), [
    cartItems,
    loading,
    error,
    total,
    addToCart,
    updateQuantity,
    removeFromCart,
    isInCart,
    getItemQuantity
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 
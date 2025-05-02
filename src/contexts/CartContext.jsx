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
  const [total, setTotal] = useState({ subtotal: 0, discount: 0, total: 0 });
  const [stockIssues, setStockIssues] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Memoizar la función de cargar el carrito
  const loadCart = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await cartService.loadCart(user.id);
      
      if (error) throw error;
      
      setCartItems(data || []);
      
      // Verificar stock al cargar
      const { issues } = await cartService.verifyStockAvailability(user.id);
      setStockIssues(issues);
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
      setTotal({ subtotal: 0, discount: 0, total: 0 });
      return;
    }

    try {
      const { subtotal, discount, total, error } = await cartService.calculateCartTotal(
        user.id,
        appliedCoupon?.codigo
      );
      
      if (error) throw error;
      
      setTotal({ subtotal, discount, total });
    } catch (error) {
      console.error('Error al calcular total:', error);
      toast.error(t('cart.errorCalculatingTotal'));
    }
  }, [user, cartItems.length, appliedCoupon, t]);

  // Cargar el carrito cuando el usuario inicia sesión
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCartItems([]);
      setLoading(false);
      setTotal({ subtotal: 0, discount: 0, total: 0 });
      setStockIssues([]);
      setAppliedCoupon(null);
    }
  }, [user, loadCart]);

  // Actualizar total cuando cambian los items o el cupón
  useEffect(() => {
    if (user && cartItems.length > 0) {
      updateCartTotal();
    }
  }, [cartItems, appliedCoupon, user, updateCartTotal]);

  // Memoizar la función de agregar al carrito
  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!user) {
      toast.error(t('cart.loginRequired'));
      return { error: 'login_required' };
    }

    try {
      setLoading(true);
      const { data, error } = await cartService.addToCart(user.id, productId, quantity);
      
      if (error) throw error;
      
      // Actualizar el carrito
      const existingItemIndex = cartItems.findIndex(item => item.producto_id === productId);
      
      if (existingItemIndex >= 0) {
        // Actualizar item existente
        setCartItems(prev => prev.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, cantidad: item.cantidad + quantity }
            : item
        ));
      } else {
        // Agregar nuevo item
        setCartItems(prev => [...prev, data]);
      }

      // Verificar stock después de agregar
      const { issues } = await cartService.verifyStockAvailability(user.id);
      setStockIssues(issues);
      
      toast.success(t('cart.addedToCart'));
      return { error: null };
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      toast.error(error.message || t('cart.errorAdding'));
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  }, [user, cartItems, t]);

  // Memoizar la función de actualizar cantidad
  const updateQuantity = useCallback(async (cartItemId, newQuantity) => {
    if (!user) return { error: 'login_required' };

    try {
      setLoading(true);
      const { data, error } = await cartService.updateCartItem(user.id, cartItemId, newQuantity);
      
      if (error) throw error;

      if (newQuantity === 0) {
        // Eliminar el item
        setCartItems(prev => prev.filter(item => item.id !== cartItemId));
        toast.success(t('cart.removed'));
      } else {
        // Actualizar cantidad
        setCartItems(prev => 
          prev.map(item => 
            item.id === cartItemId ? { ...item, cantidad: newQuantity } : item
          )
        );
        toast.success(t('cart.updated'));
      }

      // Verificar stock después de actualizar
      const { issues } = await cartService.verifyStockAvailability(user.id);
      setStockIssues(issues);

      return { error: null };
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      toast.error(error.message || t('cart.errorUpdating'));
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  }, [user, t]);

  // Memoizar la función de eliminar del carrito
  const removeFromCart = useCallback(async (cartItemId) => {
    if (!user) return { error: 'login_required' };

    try {
      setLoading(true);
      const { error } = await cartService.removeFromCart(user.id, cartItemId);
      
      if (error) throw error;
      
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
      toast.success(t('cart.removed'));
      return { error: null };
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      toast.error(error.message || t('cart.errorRemoving'));
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  }, [user, t]);

  // Memoizar la función de limpiar el carrito
  const clearCart = useCallback(async () => {
    if (!user) return { error: 'login_required' };

    try {
      setLoading(true);
      const { error } = await cartService.clearCart(user.id);
      
      if (error) throw error;
      
      setCartItems([]);
      setStockIssues([]);
      setAppliedCoupon(null);
      toast.success(t('cart.cleared'));
      return { error: null };
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
      toast.error(error.message || t('cart.errorClearing'));
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  }, [user, t]);

  // Memoizar la función de aplicar cupón
  const applyCoupon = useCallback(async (couponCode) => {
    if (!user) return { error: 'login_required' };

    try {
      setLoading(true);
      const { data: coupon, error } = await cartService.validateCoupon(couponCode);
      
      if (error) throw error;
      
      setAppliedCoupon(coupon);
      toast.success(t('cart.couponApplied'));
      return { error: null };
    } catch (error) {
      console.error('Error al aplicar cupón:', error);
      toast.error(error.message || t('cart.errorApplyingCoupon'));
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  }, [user, t]);

  // Memoizar la función de remover cupón
  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    toast.success(t('cart.couponRemoved'));
  }, [t]);

  // Memoizar la función de verificar si un producto está en el carrito
  const isInCart = useCallback((productId) => {
    return cartItems.some(item => item.producto_id === productId);
  }, [cartItems]);

  // Memoizar la función de obtener la cantidad de un producto
  const getItemQuantity = useCallback((productId) => {
    const item = cartItems.find(item => item.producto_id === productId);
    return item ? item.cantidad : 0;
  }, [cartItems]);

  // Memoizar el valor del contexto
  const value = useMemo(() => ({
    cartItems,
    loading,
    error,
    total,
    stockIssues,
    appliedCoupon,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    isInCart,
    getItemQuantity,
    itemCount: cartItems.reduce((sum, item) => sum + item.cantidad, 0)
  }), [
    cartItems,
    loading,
    error,
    total,
    stockIssues,
    appliedCoupon,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
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
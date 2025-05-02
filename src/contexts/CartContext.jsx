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
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await cartService.loadCart(user);
      
      if (error) throw error;
      
      setCartItems(data || []);
      
      // Verificar stock al cargar
      const { issues } = await cartService.verifyStockAvailability(user);
      setStockIssues(issues);
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      setError(error.message);
      toast.error(t('cart.errorLoading'));
    } finally {
      setLoading(false);
    }
  }, [user, t]);

  // Cargar el carrito cuando el usuario inicia sesión
  useEffect(() => {
    loadCart();
  }, [user, loadCart]);

  // Memoizar la función de actualizar el total
  const updateCartTotal = useCallback(async () => {
    if (!user || cartItems.length === 0) {
      setTotal({ subtotal: 0, discount: 0, total: 0 });
      return;
    }

    try {
      const { subtotal, discount, total, error } = await cartService.calculateCartTotal(
        user,
        appliedCoupon?.codigo
      );
      
      if (error) throw error;
      
      setTotal({ subtotal, discount, total });
    } catch (error) {
      console.error('Error al calcular total:', error);
      toast.error(t('cart.errorCalculatingTotal'));
    }
  }, [user, cartItems.length, appliedCoupon, t]);

  // Actualizar total cuando cambian los items o el cupón
  useEffect(() => {
    updateCartTotal();
  }, [cartItems, appliedCoupon, updateCartTotal]);

  // Memoizar la función de agregar al carrito
  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!user) {
      toast.error(t('cart.loginRequired'));
      return { error: 'login_required' };
    }

    try {
      setLoading(true);
      const { data, error } = await cartService.addToCart(user, productId, quantity);
      
      if (error) throw error;

      // Actualizar el carrito inmediatamente
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.producto_id === productId);
        if (existingItem) {
          return prevItems.map(item =>
            item.producto_id === productId
              ? { ...item, cantidad: item.cantidad + quantity }
              : item
          );
        }
        return [...prevItems, data];
      });

      // Recargar el carrito para asegurar sincronización
      await loadCart();

      // Mostrar notificación de éxito con el nombre del producto
      toast.success(
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 h-10 w-10">
            <img
              src={data.producto.imagen_url || '/placeholder-product.png'}
              alt={data.producto.nombre}
              className="h-full w-full object-cover rounded"
            />
          </div>
          <div>
            <p className="font-medium">{data.producto.nombre}</p>
            <p className="text-sm text-gray-500">{t('cart.addedToCart')}</p>
          </div>
        </div>,
        {
          duration: 3000,
          position: 'bottom-right',
        }
      );

      return { error: null };
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      toast.error(error.message || t('cart.errorAdding'));
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  }, [user, t, loadCart]);

  // Memoizar la función de actualizar cantidad
  const updateQuantity = useCallback(async (cartItemId, newQuantity) => {
    if (!user) return { error: 'login_required' };

    try {
      setLoading(true);
      const { data, error } = await cartService.updateCartItem(user, cartItemId, newQuantity);
      
      if (error) throw error;

      // Actualizar el carrito inmediatamente
      setCartItems(prevItems => {
        if (newQuantity === 0) {
          return prevItems.filter(item => item.id !== cartItemId);
        }
        return prevItems.map(item =>
          item.id === cartItemId
            ? { ...item, cantidad: newQuantity }
            : item
        );
      });

      // Recargar el carrito para asegurar sincronización
      await loadCart();

      if (newQuantity === 0) {
        toast.success(t('cart.removed'));
      } else {
        toast.success(t('cart.updated'));
      }

      return { error: null };
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      toast.error(error.message || t('cart.errorUpdating'));
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  }, [user, t, loadCart]);

  // Memoizar la función de eliminar del carrito
  const removeFromCart = useCallback(async (cartItemId) => {
    if (!user) return { error: 'login_required' };

    try {
      setLoading(true);
      const { error } = await cartService.removeFromCart(user, cartItemId);
      
      if (error) throw error;
      
      // Actualizar el carrito inmediatamente
      setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));

      // Recargar el carrito para asegurar sincronización
      await loadCart();
      
      toast.success(t('cart.removed'));
      return { error: null };
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      toast.error(error.message || t('cart.errorRemoving'));
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  }, [user, t, loadCart]);

  // Memoizar la función de limpiar el carrito
  const clearCart = useCallback(async () => {
    if (!user) return { error: 'login_required' };

    try {
      setLoading(true);
      const { error } = await cartService.clearCart(user);
      
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

  // Calcular el total de items en el carrito
  const cartItemCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.cantidad, 0);
  }, [cartItems]);

  // Memoizar el valor del contexto
  const value = useMemo(() => ({
    cartItems,
    loading,
    error,
    total,
    stockIssues,
    appliedCoupon,
    cartItemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    isInCart,
    getItemQuantity,
    loadCart
  }), [
    cartItems,
    loading,
    error,
    total,
    stockIssues,
    appliedCoupon,
    cartItemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    isInCart,
    getItemQuantity,
    loadCart
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
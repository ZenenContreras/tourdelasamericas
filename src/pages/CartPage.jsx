import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { supabase } from '../config/supabase';

const CartPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadCartItems();
    }
  }, [user]);

  const loadCartItems = async () => {
    try {
      const { data: cartData, error: cartError } = await supabase
        .from('carrito')
        .select(`
          cantidad,
          productos (
            id,
            nombre,
            descripcion,
            precio,
            categorias (
              nombre
            )
          )
        `)
        .eq('usuario_id', user.id);

      if (cartError) throw cartError;

      const formattedCartItems = cartData.map(item => ({
        id: item.productos.id,
        name: item.productos.nombre,
        description: item.productos.descripcion,
        price: parseFloat(item.productos.precio),
        quantity: item.cantidad,
        category: item.productos.categorias?.nombre,
        image: '/placeholder-product.jpg' // TODO: Agregar manejo de imágenes
      }));

      setCartItems(formattedCartItems);
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, change) => {
    try {
      const item = cartItems.find(item => item.id === id);
      const newQuantity = Math.max(0, item.quantity + change);

      if (newQuantity === 0) {
        await removeItem(id);
        return;
      }

      const { error } = await supabase
        .from('carrito')
        .update({ cantidad: newQuantity })
        .eq('usuario_id', user.id)
        .eq('producto_id', id);

      if (error) throw error;

      setCartItems(items =>
        items.map(item =>
          item.id === id
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      setError(error.message);
    }
  };

  const removeItem = async (id) => {
    try {
      const { error } = await supabase
        .from('carrito')
        .delete()
        .eq('usuario_id', user.id)
        .eq('producto_id', id);

      if (error) throw error;

      setCartItems(items => items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error al eliminar item:', error);
      setError(error.message);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">{t('auth.login.title')}</h2>
          <p className="mt-1 text-sm text-gray-500">{t('auth.login.subtitle')}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">{t('cart.title')}</h1>

          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6 text-center"
            >
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-lg font-medium text-gray-900">{t('cart.empty')}</h2>
              <p className="mt-1 text-sm text-gray-500">{t('cart.emptyMessage')}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Lista de productos */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-4 sm:p-6 flex items-center gap-4"
                    >
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                          <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)}</p>
                          {item.category && (
                            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                              {item.category}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="h-4 w-4 text-gray-600" />
                            </button>
                            <span className="px-4 py-2 text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Resumen y total */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base font-medium text-gray-900">{t('cart.subtotal')}</span>
                  <span className="text-base font-medium text-gray-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base text-gray-500">{t('cart.shipping')}</span>
                  <span className="text-base text-gray-500">{t('cart.shippingCalculated')}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-lg font-medium text-gray-900">{t('cart.total')}</span>
                    <span className="text-lg font-medium text-gray-900">${total.toFixed(2)}</span>
                  </div>
                  <button
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    {t('cart.checkout')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage; 
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, Trash2, Plus, Minus, Package, Truck, CreditCard, AlertTriangle, X, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CartPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { 
    cartItems, 
    loading, 
    error, 
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
    verifyStockAvailability
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [stockIssues, setStockIssues] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (user && cartItems.length > 0) {
      checkStockAvailability();
    }
  }, [user, cartItems]);

  const checkStockAvailability = async () => {
    const { available, issues } = await verifyStockAvailability(user.id);
    setStockIssues(issues);
  };

  const handleQuantityChange = async (id, change) => {
    try {
      const item = cartItems.find(item => item.id === id);
      const newQuantity = Math.max(0, item.cantidad + change);

      if (newQuantity === 0) {
        await removeFromCart(id);
        toast.success(t('cart.itemRemoved'));
      } else {
        await updateQuantity(id, newQuantity);
        toast.success(t('cart.quantityUpdated'));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleApplyCoupon = async () => {
    try {
      // Aquí iría la lógica para validar y aplicar el cupón
      toast.success(t('cart.couponApplied'));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      
      // Verificar stock antes de proceder
      const { available, issues } = await verifyStockAvailability(user.id);
      
      if (!available) {
        setStockIssues(issues);
        toast.error(t('cart.stockIssues'));
        return;
      }

      // Aquí iría la lógica para proceder al checkout
      toast.success(t('cart.proceedingToCheckout'));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

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
          <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
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
              {/* Alertas de stock */}
              <AnimatePresence>
                {stockIssues.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4"
                  >
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{t('cart.stockIssues')}</h3>
                        <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                          {stockIssues.map((issue, index) => (
                            <li key={index}>
                              {issue.nombre}: {t('cart.availableStock', { stock: issue.stock_disponible })}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Lista de productos */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-4 sm:p-6"
                      >
                        <div className="flex items-center gap-4">
                          {/* Imagen del producto */}
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={item.producto.imagen_url || '/placeholder-product.png'}
                              alt={item.producto.nombre}
                              className="h-full w-full object-cover object-center"
                              loading="lazy"
                            />
                          </div>

                          {/* Información del producto */}
                          <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                              <h3 className="text-base font-medium text-gray-900">{item.producto.nombre}</h3>
                              <p className="mt-1 text-sm text-gray-500">${item.producto.precio.toFixed(2)}</p>
                              {item.producto.categoria && (
                                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                                  {item.producto.categoria}
                                </span>
                              )}
                            </div>

                            {/* Controles de cantidad */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                  className="p-2 hover:bg-gray-100 transition-colors"
                                  disabled={isCheckingOut}
                                >
                                  <Minus className="h-4 w-4 text-gray-600" />
                                </button>
                                <span className="px-4 py-2 text-gray-900">{item.cantidad}</span>
                                <button
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                  className="p-2 hover:bg-gray-100 transition-colors"
                                  disabled={isCheckingOut}
                                >
                                  <Plus className="h-4 w-4 text-gray-600" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                disabled={isCheckingOut}
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>

              {/* Cupón de descuento */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder={t('cart.enterCoupon')}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={isCheckingOut || !!appliedCoupon}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isCheckingOut || !couponCode || !!appliedCoupon}
                  >
                    {t('cart.applyCoupon')}
                  </button>
                </div>
              </div>

              {/* Resumen y total */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-900">{t('cart.subtotal')}</span>
                    <span className="text-base font-medium text-gray-900">${total.subtotal.toFixed(2)}</span>
                  </div>
                  
                  {total.discount > 0 && (
                    <div className="flex items-center justify-between text-green-600">
                      <span className="text-base">{t('cart.discount')}</span>
                      <span className="text-base">-${total.discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-gray-500">
                    <span className="text-base">{t('cart.shipping')}</span>
                    <span className="text-base">{t('cart.shippingCalculated')}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-lg font-medium text-gray-900">{t('cart.total')}</span>
                      <span className="text-lg font-medium text-gray-900">${total.total.toFixed(2)}</span>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={handleCheckout}
                        disabled={isCheckingOut || stockIssues.length > 0}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isCheckingOut ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {t('cart.processing')}
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-5 w-5" />
                            {t('cart.checkout')}
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => clearCart()}
                        disabled={isCheckingOut}
                        className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t('cart.clearCart')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Package className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{t('cart.freeShipping')}</h3>
                      <p className="mt-1 text-sm text-gray-500">{t('cart.freeShippingDetails')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{t('cart.fastDelivery')}</h3>
                      <p className="mt-1 text-sm text-gray-500">{t('cart.fastDeliveryDetails')}</p>
                    </div>
                  </div>
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
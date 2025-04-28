import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Package, ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../config/supabase';

const OrdersPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('pedidos')
        .select(`
          id,
          fecha,
          estado,
          total,
          detalles_pedido (
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
          )
        `)
        .eq('usuario_id', user.id)
        .order('fecha', { ascending: false });

      if (ordersError) throw ordersError;

      const formattedOrders = ordersData.map(order => ({
        id: order.id,
        date: new Date(order.fecha),
        status: order.estado,
        total: parseFloat(order.total),
        items: order.detalles_pedido.map(detail => ({
          id: detail.productos.id,
          name: detail.productos.nombre,
          description: detail.productos.descripcion,
          price: parseFloat(detail.productos.precio),
          quantity: detail.cantidad,
          category: detail.productos.categorias?.nombre,
          image: '/placeholder-product.jpg' // TODO: Agregar manejo de imágenes
        }))
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error al cargar los pedidos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pendiente':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'completado':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelado':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-50 text-yellow-800';
      case 'completado':
        return 'bg-green-50 text-green-800';
      case 'cancelado':
        return 'bg-red-50 text-red-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">{t('orders.title')}</h1>

          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6 text-center"
            >
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-lg font-medium text-gray-900">{t('orders.empty')}</h2>
              <p className="mt-1 text-sm text-gray-500">{t('orders.emptyMessage')}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  layout
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div
                    className="p-4 sm:p-6 cursor-pointer"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="text-sm text-gray-500">
                            {t('orders.orderNumber')} #{order.id}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {t(`orders.status.${order.status}`)}
                        </span>
                        <span className="text-base font-medium text-gray-900">
                          ${order.total.toFixed(2)}
                        </span>
                        {expandedOrder === order.id ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedOrder === order.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-gray-200"
                      >
                        <div className="p-4 sm:p-6">
                          <ul className="divide-y divide-gray-200">
                            {order.items.map((item) => (
                              <li key={item.id} className="py-4 flex items-center gap-4">
                                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div className="flex flex-1 flex-col">
                                  <div>
                                    <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                                    <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)} x {item.quantity}</p>
                                  </div>
                                  {item.category && (
                                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full w-fit mt-2">
                                      {item.category}
                                    </span>
                                  )}
                                </div>

                                <div className="text-right">
                                  <p className="text-base font-medium text-gray-900">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-6 border-t border-gray-200 pt-6">
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <p>{t('orders.total')}</p>
                              <p>${order.total.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage; 
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, AlertTriangle, Plus, Minus, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product, type = 'product' }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { addToCart, updateQuantity, isInCart, getItemQuantity } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Configuración de colores y traducciones según el tipo de producto
  const typeConfig = {
    product: {
      accent: 'indigo',
      hover: 'indigo',
      button: 'indigo',
      gradient: 'from-indigo-50 to-blue-50',
      translations: {
        addToCart: 'product.addToCart',
        outOfStock: 'product.outOfStock',
        lowStock: 'product.lowStock'
      }
    },
    food: {
      accent: 'amber',
      hover: 'orange',
      button: 'amber',
      gradient: 'from-amber-50 to-orange-50',
      translations: {
        addToCart: 'food.addToCart',
        outOfStock: 'food.outOfStock',
        lowStock: 'food.lowStock'
      }
    },
    boutique: {
      accent: 'purple',
      hover: 'purple',
      button: 'purple',
      gradient: 'from-purple-50 to-pink-50',
      translations: {
        addToCart: 'boutique.addToCart',
        outOfStock: 'boutique.outOfStock',
        lowStock: 'boutique.lowStock'
      }
    }
  };

  const config = typeConfig[type];

  const handleAddToCart = async () => {
    if (!user) {
      toast.error(t('cart.loginRequired'));
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await addToCart(product.id);
      
      if (error) {
        if (error === 'login_required') {
          toast.error(t('cart.loginRequired'));
        } else {
          throw new Error(error);
        }
        return;
      }

      // Mostrar animación de éxito
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);

      // Mostrar notificación
      toast.custom((t) => (
        <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
          <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
            <Check className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{product.nombre}</p>
            <p className="text-sm text-gray-500">{t('cart.addedToCart')}</p>
          </div>
        </div>
      ), {
        duration: 2000,
        position: 'bottom-right',
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.message || t('cart.errorAdding'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (change) => {
    if (!user) {
      toast.error(t('cart.loginRequired'));
      return;
    }

    try {
      setIsLoading(true);
      const currentQuantity = getItemQuantity(product.id);
      const newQuantity = Math.max(0, currentQuantity + change);

      // Si la nueva cantidad excede el stock, mostrar error
      if (newQuantity > product.stock) {
        toast.error(t('cart.stockLimit', { stock: product.stock }));
        return;
      }

      const { error } = await updateQuantity(product.id, newQuantity);
      
      if (error) {
        if (error === 'login_required') {
          toast.error(t('cart.loginRequired'));
        } else {
          throw new Error(error);
        }
        return;
      }

      // Mostrar notificación según la acción
      if (newQuantity === 0) {
        toast.custom((t) => (
          <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
            <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
              <Minus className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{product.nombre}</p>
              <p className="text-sm text-gray-500">{t('cart.removed')}</p>
            </div>
          </div>
        ), {
          duration: 2000,
          position: 'bottom-right',
        });
      } else {
        toast.custom((t) => (
          <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
              <Check className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{product.nombre}</p>
              <p className="text-sm text-gray-500">
                {change > 0 ? t('cart.quantityIncreased') : t('cart.quantityDecreased')}
              </p>
            </div>
          </div>
        ), {
          duration: 2000,
          position: 'bottom-right',
        });
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(error.message || t('cart.errorUpdating'));
    } finally {
      setIsLoading(false);
    }
  };

  const productInCart = isInCart(product.id);
  const quantity = getItemQuantity(product.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300 border border-${config.accent}-100 hover:border-${config.accent}-300 h-full flex flex-col relative`}
      style={{ 
        minHeight: '400px',
        height: '100%'
      }}
    >
      {/* Animación de éxito al agregar al carrito */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
          >
            <div className="bg-white rounded-full p-4">
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenedor de imagen con aspect ratio fijo */}
      <div 
        className="relative overflow-hidden bg-gray-100"
        style={{ 
          aspectRatio: '1/1',
          width: '100%'
        }}
      >
        {product.imagen_url ? (
          <div className={`w-full h-full bg-gradient-to-br ${config.gradient}`}>
            <img
              src={product.imagen_url}
              alt={product.nombre}
              className="h-full w-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              width="400"
              height="400"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-product.png';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
            <ShoppingCart className={`h-8 w-8 sm:h-10 sm:w-10 text-${config.accent}-300`} />
          </div>
        )}
        
        {product.destacado && (
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-yellow-400 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium flex items-center gap-0.5">
            <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            {t('common.featured')}
          </div>
        )}

        {product.stock < 30 && (
          <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 bg-red-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium flex items-center gap-0.5">
            <AlertTriangle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            {t('common.lowStock')}
          </div>
        )}
      </div>
      
      {/* Contenido del card con altura fija y dimensiones reservadas */}
      <div 
        className="p-2 sm:p-3 md:p-4 flex flex-col flex-grow" 
        style={{ minHeight: '200px' }}
      >
        <div className="mb-1 sm:mb-2 flex flex-wrap gap-0.5 sm:gap-1">
          {product.categoria && (
            <span className={`text-[10px] sm:text-xs font-medium text-${config.accent}-600 bg-${config.accent}-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full`}>
              {product.categoria}
            </span>
          )}
        </div>
        
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
          {product.nombre}
        </h3>
        
        <p className="text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3 line-clamp-2 flex-grow">
          {product.descripcion}
        </p>
        
        {/* Footer del card con precio y botón */}
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center pt-2 sm:pt-3 border-t border-gray-100 mt-auto gap-2">
          <div className="flex flex-col">
            {product.precio_anterior && (
              <span className="text-[10px] sm:text-xs text-gray-500 line-through">
                ${product.precio_anterior.toFixed(2)}
              </span>
            )}
            <span className="text-sm sm:text-base font-bold text-gray-900">
              ${product.precio.toFixed(2)}
            </span>
          </div>
          
          {productInCart ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleUpdateQuantity(-1)}
                  className="p-1.5 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  disabled={isLoading || product.stock === 0}
                >
                  <Minus className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                </motion.button>
                <span className="px-2 py-1 text-xs sm:text-sm text-gray-900 min-w-[2rem] text-center">
                  {quantity}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleUpdateQuantity(1)}
                  className="p-1.5 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  disabled={isLoading || quantity >= product.stock}
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                </motion.button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isLoading || product.stock === 0}
              className={`
                flex items-center justify-center gap-1.5 
                px-3 py-1.5 
                rounded-lg 
                text-[11px] sm:text-xs 
                font-medium 
                w-full sm:w-auto 
                whitespace-nowrap
                transition-all duration-300
                ${product.stock === 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : `bg-${config.button}-600 hover:bg-${config.button}-700 text-white`}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>
                    {product.stock === 0 
                      ? t(config.translations.outOfStock)
                      : t(config.translations.addToCart)}
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard; 
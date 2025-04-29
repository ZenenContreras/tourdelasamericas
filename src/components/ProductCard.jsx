import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product, type = 'product' }) => {
  const { t } = useTranslation();
  const { addToCart, isInCart, getItemQuantity } = useCart();

  // Configuración de colores según el tipo de producto
  const colorConfig = {
    product: {
      accent: 'indigo',
      hover: 'indigo',
      button: 'indigo'
    },
    food: {
      accent: 'amber',
      hover: 'orange',
      button: 'orange'
    },
    boutique: {
      accent: 'purple',
      hover: 'purple',
      button: 'purple'
    }
  };

  const colors = colorConfig[type];

  const handleAddToCart = async () => {
    try {
      await addToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 border border-${colors.accent}-50 hover:border-${colors.accent}-200`}
    >
      <div className="relative">
        {product.imagen_url ? (
          <div className={`aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gradient-to-br from-${colors.accent}-50 to-${colors.hover}-50`}>
            <img
              src={product.imagen_url}
              alt={product.nombre}
              className="h-full w-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className={`aspect-w-1 aspect-h-1 w-full bg-gradient-to-br from-${colors.accent}-100 to-${colors.hover}-50 flex items-center justify-center`}>
            <ShoppingCart className={`h-8 w-8 text-${colors.accent}-300`} />
          </div>
        )}
        
        {product.destacado && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-white px-1.5 py-0.5 rounded-full text-[10px] font-medium flex items-center">
            <Star className="h-2.5 w-2.5 mr-0.5" />
            {t('common.featured')}
          </div>
        )}
      </div>
      
      <div className="p-3">
        <div className="flex flex-col h-full">
          <div className="mb-2 flex flex-wrap gap-1">
            {product.categoria && (
              <span className={`text-[10px] font-medium text-${colors.accent}-600 bg-${colors.accent}-50 px-1.5 py-0.5 rounded-full`}>
                {product.categoria}
              </span>
            )}
          </div>
          
          <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 flex-grow">{product.nombre}</h3>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.descripcion}</p>
          
          {product.stock < 30 && (
            <div className={`flex items-center space-x-1 text-${colors.accent}-600 bg-${colors.accent}-50 px-2 py-1 rounded-lg mb-2 text-[10px]`}>
              <AlertTriangle className="h-3 w-3 flex-shrink-0" />
              <span className="font-medium">{t('common.lowStock')}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
            <div className="flex flex-col">
              <div className="flex items-baseline">
                {product.precio_anterior && (
                  <span className="text-xs text-gray-500 line-through mr-1">
                    ${product.precio_anterior.toFixed(2)}
                  </span>
                )}
                <span className="text-sm font-bold text-gray-900">
                  ${product.precio.toFixed(2)}
                </span>
              </div>
            </div>
            {isInCart(product.id) ? (
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-600 font-medium">
                  {getItemQuantity(product.id)}x
                </span>
                <button
                  onClick={handleAddToCart}
                  className="flex items-center space-x-1 bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-3 w-3" />
                  <span>+</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className={`flex items-center space-x-1 bg-${colors.button}-600 text-white px-2 py-1 rounded-lg hover:bg-${colors.button}-700 transition-all duration-300 text-xs font-medium disabled:bg-gray-400 disabled:cursor-not-allowed`}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-3 w-3" />
                <span>{product.stock === 0 ? t('common.outOfStock') : t('common.add')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard; 
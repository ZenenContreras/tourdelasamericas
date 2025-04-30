import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product, type = 'product' }) => {
  const { t } = useLanguage();
  const { addToCart, isInCart, getItemQuantity } = useCart();

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
      className={`bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300 border border-${config.accent}-100 hover:border-${config.accent}-300 h-full flex flex-col`}
    >
      {/* Contenedor de imagen con aspect ratio fijo */}
      <div className="relative aspect-square w-full overflow-hidden">
        {product.imagen_url ? (
          <div className={`w-full h-full bg-gradient-to-br ${config.gradient}`}>
            <img
              src={product.imagen_url}
              alt={product.nombre}
              className="h-full w-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
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
      </div>
      
      {/* Contenido del card con altura fija */}
      <div className="p-2 sm:p-3 md:p-4 flex flex-col flex-grow">
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
        
        {product.stock < 30 && (
          <div className={`flex items-center gap-0.5 sm:gap-1 text-${config.accent}-600 bg-${config.accent}-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg mb-2 sm:mb-3 text-[10px] sm:text-xs`}>
            <AlertTriangle className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
            <span className="font-medium">
              {t(config.translations.lowStock, { stock: product.stock })}
            </span>
          </div>
        )}
        
        {/* Footer del card con precio y botón */}
        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100 mt-auto">
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
          
          {isInCart(product.id) ? (
            <div className="flex items-center gap-1">
              <span className="text-[10px] sm:text-xs text-gray-600 font-medium">
                {getItemQuantity(product.id)}x
              </span>
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-0.5 bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-green-700 transition-colors text-[10px] sm:text-xs font-medium disabled:bg-gray-400 disabled:cursor-not-allowed min-w-[60px] sm:min-w-[70px]"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span>{t('cart.addMore')}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-0.5 bg-${config.button}-600 text-white px-2 py-1 rounded-lg hover:bg-${config.button}-700 transition-all duration-300 text-[10px] sm:text-xs font-medium disabled:bg-gray-400 disabled:cursor-not-allowed min-w-[60px] sm:min-w-[70px]`}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span>
                {product.stock === 0 
                  ? t(config.translations.outOfStock)
                  : t(config.translations.addToCart)}
              </span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard; 
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import AuthModal from './AuthModal';
import ProductDetailModal from './ProductDetailModal';

const ProductCard = ({ product, type = 'product', onOpenDetail }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const cardRef = useRef(null);

  // Configuración de colores según el tipo
  const typeConfig = {
    product: {
      accent: 'indigo',
      hover: 'indigo',
      button: 'indigo',
      gradient: 'from-indigo-50 to-blue-50'
    },
    food: {
      accent: 'amber',
      hover: 'orange',
      button: 'amber',
      gradient: 'from-amber-50 to-orange-50'
    },
    boutique: {
      accent: 'purple',
      hover: 'purple',
      button: 'purple',
      gradient: 'from-purple-50 to-pink-50'
    }
  };

  const config = typeConfig[type];

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await addToCart(product.id);
      
      if (error) {
        if (error === 'login_required') {
          setIsAuthModalOpen(true);
        } else {
          throw new Error(error);
        }
        return;
      }

      // Mostrar animación de éxito
      setShowSuccess(true);

      // Animar el producto "volando" al carrito
      if (cardRef.current) {
        const card = cardRef.current;
        const cardRect = card.getBoundingClientRect();
        const cartIcon = document.querySelector('.cart-icon');
        
        if (cartIcon) {
          const cartRect = cartIcon.getBoundingClientRect();
          
          // Crear elemento para la animación
          const flyingItem = document.createElement('div');
          flyingItem.style.cssText = `
            position: fixed;
            z-index: 100;
            width: ${cardRect.width}px;
            height: ${cardRect.width}px;
            background-image: url(${product.imagen_url || '/placeholder-product.png'});
            background-size: cover;
            background-position: center;
            border-radius: 0.75rem;
            left: ${cardRect.left}px;
            top: ${cardRect.top}px;
            transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          `;
          
          document.body.appendChild(flyingItem);
          
          // Forzar reflow
          flyingItem.offsetHeight;
          
          // Animar hacia el carrito
          flyingItem.style.transform = 'scale(0.2) rotate(-10deg)';
          flyingItem.style.opacity = '0';
          flyingItem.style.left = `${cartRect.left + cartRect.width/2 - cardRect.width/10}px`;
          flyingItem.style.top = `${cartRect.top + cartRect.height/2 - cardRect.height/10}px`;
          
          // Animar el icono del carrito
          cartIcon.style.transform = 'scale(1.2)';
          cartIcon.style.transition = 'transform 0.3s ease';
          
          // Remover después de la animación
          setTimeout(() => {
            document.body.removeChild(flyingItem);
            setShowSuccess(false);
            cartIcon.style.transform = 'scale(1)';
          }, 1200);

          toast.success(t('cart.addedToCart'));
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.message || t('cart.errorAdding'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.div
        ref={cardRef}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        onClick={() => onOpenDetail(product)}
        className={`bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300 border border-${config.accent}-100 hover:border-${config.accent}-300 cursor-pointer`}
      >
        {/* Animación de éxito al agregar al carrito */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-xl"
            >
              <div className="bg-white rounded-full p-4">
                <Star className="h-8 w-8 text-green-500" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contenedor de imagen cuadrado */}
        <div className="aspect-square relative overflow-hidden">
          {product.imagen_url ? (
            <div className={`w-full h-full bg-gradient-to-br ${config.gradient}`}>
              <img
                src={product.imagen_url}
                alt={product.nombre}
                className="h-full w-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-product.png';
                }}
              />
            </div>
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
              <ShoppingCart className={`h-8 w-8 text-${config.accent}-300`} />
            </div>
          )}
          
          {product.destacado && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Star className="h-3 w-3" />
              {t('common.featured')}
            </div>
          )}

          {product.stock < 30 && (
            <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {t('common.lowStock')}
            </div>
          )}

          {/* Rating */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-medium">
              {product.rating ? product.rating.toFixed(1) : '0.0'}
            </span>
          </div>
        </div>
        
        {/* Contenido del card simplificado */}
        <div className="p-3 flex flex-col">
          {product.categoria && (
            <span className={`text-xs font-medium text-${config.accent}-600 bg-${config.accent}-50 px-2 py-0.5 rounded-full inline-block mb-1 truncate`}>
              {product.categoria}
            </span>
          )}
          
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-2">
            {product.nombre}
          </h3>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="text-sm font-bold text-gray-900">
              ${product.precio.toFixed(2)}
            </span>
            
            <button
              onClick={handleAddToCart}
              disabled={isLoading || product.stock === 0}
              className={`
                flex items-center gap-1 px-2 py-1 rounded-lg text-white text-xs font-medium
                ${product.stock === 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : `bg-${config.button}-600 hover:bg-${config.button}-700`}
                disabled:opacity-50
              `}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="h-3 w-3" />
                  <span className="hidden sm:inline">
                    {product.stock === 0 
                      ? t('product.outOfStock')
                      : t('product.addToCart')}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default ProductCard; 
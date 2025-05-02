import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

const FavoritesPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { favorites, loading, error, loadFavorites } = useFavorites();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    loadFavorites();
  }, [user, loadFavorites]);

  const handleOpenDetail = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
  };

  const handleAuthClose = () => {
    setIsAuthModalOpen(false);
    if (!user) {
      navigate('/');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">{t('auth.login.title')}</h2>
          <p className="mt-1 text-sm text-gray-500">{t('auth.login.subtitle')}</p>
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={handleAuthClose}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="h-8 w-8 text-red-500" />
                {t('favorites.title')}
              </h1>
              <span className="text-sm text-gray-500">
                {favorites.length} {favorites.length === 1 ? 'producto' : 'productos'}
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-6 text-center"
              >
                <Heart className="mx-auto h-12 w-12 text-red-400 mb-4" />
                <h2 className="text-lg font-medium text-gray-900">{error}</h2>
                <button
                  onClick={loadFavorites}
                  className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {t('common.tryAgain')}
                </button>
              </motion.div>
            ) : favorites.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-6 text-center"
              >
                <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h2 className="text-lg font-medium text-gray-900">{t('favorites.empty')}</h2>
                <p className="mt-1 text-sm text-gray-500">{t('favorites.emptyMessage')}</p>
                <button
                  onClick={() => navigate('/productos')}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Explorar productos</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                <AnimatePresence>
                  {favorites.map((favorite) => {
                    if (!favorite?.productos) return null;
                    
                    const productType = favorite.productos.categoria_id === 2 ? 'food' : 
                                      favorite.productos.categoria_id === 3 ? 'boutique' : 'product';
                    
                    return (
                      <ProductCard
                        key={favorite.id}
                        product={favorite.productos}
                        type={productType}
                        onOpenDetail={handleOpenDetail}
                      />
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de detalle */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={handleCloseDetail}
            type={selectedProduct.categoria_id === 2 ? 'food' : 
                  selectedProduct.categoria_id === 3 ? 'boutique' : 'product'}
          />
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleAuthClose}
      />
    </>
  );
};

export default FavoritesPage; 
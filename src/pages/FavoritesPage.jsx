import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';

const FavoritesPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAuthModalOpen(true);
    }
  }, [user]);

  const [favorites, setFavorites] = useState([
    // Datos de ejemplo - esto debería venir de tu base de datos
    {
      id: 1,
      name: 'Producto 1',
      price: 29.99,
      image: '/placeholder-product.jpg',
      category: 'Comidas',
      description: 'Descripción corta del producto 1'
    },
    {
      id: 2,
      name: 'Producto 2',
      price: 19.99,
      image: '/placeholder-product.jpg',
      category: 'Productos',
      description: 'Descripción corta del producto 2'
    },
    {
      id: 3,
      name: 'Producto 3',
      price: 39.99,
      image: '/placeholder-product.jpg',
      category: 'Boutique',
      description: 'Descripción corta del producto 3'
    }
  ]);

  const removeFromFavorites = (id) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setFavorites(favorites.filter(item => item.id !== id));
  };

  const addToCart = (product) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    // Implementar lógica para agregar al carrito
    console.log('Agregando al carrito:', product);
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
            onClose={() => setIsAuthModalOpen(false)}
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mis Favoritos</h1>
              <span className="text-sm text-gray-500">{favorites.length} productos</span>
            </div>

            {favorites.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-6 text-center"
              >
                <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h2 className="text-lg font-medium text-gray-900">Tu lista de favoritos está vacía</h2>
                <p className="mt-1 text-sm text-gray-500">¡Agrega algunos productos a tus favoritos!</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                <AnimatePresence>
                  {favorites.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white rounded-lg shadow-sm overflow-hidden group"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <button
                            onClick={() => removeFromFavorites(product.id)}
                            className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-5 w-5 text-red-500" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="mb-2">
                          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                            {product.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-500 mb-3">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">
                            ${product.price.toFixed(2)}
                          </span>
                          <button
                            onClick={() => addToCart(product)}
                            className="flex items-center space-x-2 bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span>Agregar</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default FavoritesPage; 
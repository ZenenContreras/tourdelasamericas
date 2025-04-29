import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Filter, X, AlertTriangle, ShoppingCart, Star, Package } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../config/supabase';
import * as productService from '../services/productService';

const BoutiquePage = () => {
  const { t } = useLanguage();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [boutique, setBoutique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    search: '',
    category: '',
    sortBy: 'nombre-asc'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadBoutique();
  }, [filters]);

  const loadBoutique = async () => {
    try {
      setLoading(true);
      const { data, error } = await productService.loadProducts(filters, 3);
      
      if (error) throw error;
      
      setBoutique(data || []);
    } catch (error) {
      console.error('Error cargando productos de boutique:', error);
      setError(t('boutique.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      search: '',
      category: '',
      sortBy: 'nombre-asc'
    });
  };

  const handleAddToCart = async (item) => {
    try {
      await addToCart(item);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

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
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 sm:py-12">
      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center mb-2">
              <Store className="h-8 w-8 text-purple-600 mr-3" />
              {t('boutique.title')}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
              {t('boutique.description')}
            </p>
          </div>
          
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg shadow-sm transition-all duration-300 ${
              showFilters 
                ? 'bg-purple-600 text-white hover:bg-purple-700' 
                : 'bg-white/80 backdrop-blur-sm text-purple-600 hover:bg-white border border-purple-100 hover:border-purple-300'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter className={`h-5 w-5 ${showFilters ? 'text-white' : 'text-purple-600'}`} />
            <span className="font-medium">{t('common.filters.title')}</span>
            {showFilters && (
              <X className="h-5 w-5 ml-2 text-white" />
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 overflow-hidden border border-purple-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">{t('boutique.filterOptions')}</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('boutique.search')}
                  </label>
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder={t('boutique.searchPlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('boutique.minPrice')}
                  </label>
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('boutique.maxPrice')}
                  </label>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('boutique.sortBy')}
                  </label>
                  <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option value="nombre-asc">{t('boutique.sortOptions.nameAsc')}</option>
                    <option value="nombre-desc">{t('boutique.sortOptions.nameDesc')}</option>
                    <option value="precio-asc">{t('boutique.sortOptions.priceAsc')}</option>
                    <option value="precio-desc">{t('boutique.sortOptions.priceDesc')}</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  {t('boutique.resetFilters')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : boutique.length === 0 ? (
          <div className="text-center py-12">
            <Store className="mx-auto h-12 w-12 text-purple-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">{t('boutique.noProducts')}</h3>
            <p className="mt-1 text-sm text-gray-500">{t('boutique.noProductsMessage')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
            {boutique.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 border border-purple-50 hover:border-purple-200"
              >
                <div className="relative">
                  {item.imagen_url ? (
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
                      <img
                        src={item.imagen_url}
                        alt={item.nombre}
                        className="h-full w-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ) : (
                    <div className="aspect-w-1 aspect-h-1 w-full bg-gradient-to-br from-purple-100 to-pink-50 flex items-center justify-center">
                      <Package className="h-8 w-8 text-purple-300" />
                    </div>
                  )}
                  
                  {item.destacado && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-white px-1.5 py-0.5 rounded-full text-[10px] font-medium flex items-center">
                      <Star className="h-2.5 w-2.5 mr-0.5" />
                      Destacado
                    </div>
                  )}
                </div>
                
                <div className="p-3">
                  <div className="flex flex-col h-full">
                    <div className="mb-2 flex flex-wrap gap-1">
                      {item.categoria && (
                        <span className="text-[10px] font-medium text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">
                          {item.categoria}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 flex-grow">{item.nombre}</h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.descripcion}</p>
                    
                    {item.stock < 30 && (
                      <div className="flex items-center space-x-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-lg mb-2 text-[10px]">
                        <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                        <span className="font-medium">Stock bajo</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                      <div className="flex flex-col">
                        <div className="flex items-baseline">
                          {item.precio_anterior && (
                            <span className="text-xs text-gray-500 line-through mr-1">
                              ${item.precio_anterior.toFixed(2)}
                            </span>
                          )}
                          <span className="text-sm font-bold text-gray-900">
                            ${item.precio.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      {isInCart(item.id) ? (
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-600 font-medium">
                            {getItemQuantity(item.id)}x
                          </span>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="flex items-center space-x-1 bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
                            disabled={item.stock === 0}
                          >
                            <ShoppingCart className="h-3 w-3" />
                            <span>+</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="flex items-center space-x-1 bg-purple-600 text-white px-2 py-1 rounded-lg hover:bg-purple-700 transition-all duration-300 text-xs font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                          disabled={item.stock === 0}
                        >
                          <ShoppingCart className="h-3 w-3" />
                          <span>{item.stock === 0 ? 'Agotado' : 'Agregar'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default BoutiquePage; 
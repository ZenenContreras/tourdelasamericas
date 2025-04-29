import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Filter, X, AlertTriangle, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../config/supabase';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import productService from '../services/productService';

const BoutiquePage = () => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    search: '',
    sortBy: 'nombre-asc'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadBoutiqueItems();
  }, [filters]);

  const loadBoutiqueItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await productService.loadProducts(filters, 3); // Categoría 3 para boutique
      
      if (error) throw error;
      
      setItems(data || []);
    } catch (error) {
      console.error('Error cargando artículos de boutique:', error);
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
      sortBy: 'nombre-asc'
    });
  };

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      nombre: item.nombre,
      precio: item.precio,
      cantidad: 1
    });
  };

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <Store className="h-8 w-8 text-purple-600 mr-3" />
              {t('boutique.title')}
            </h1>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <Filter className="h-5 w-5 text-gray-500" />
              <span>{t('boutique.filters')}</span>
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-white rounded-lg shadow-sm p-6 mb-8 overflow-hidden"
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
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <Store className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">{t('boutique.noItems')}</h3>
              <p className="mt-1 text-sm text-gray-500">{t('boutique.noItemsMessage')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden group"
                >
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{item.nombre}</h3>
                    <p className="text-sm text-gray-500 mb-3">{item.descripcion}</p>
                    
                    {item.stock < 30 && (
                      <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full mb-3">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">
                          {t('boutique.lowStock', { item: item.nombre })}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        ${item.precio.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex items-center space-x-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>{t('boutique.addToCart')}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BoutiquePage; 
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Filter, X, AlertTriangle, ShoppingCart, Star, Package } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../config/supabase';
import * as productService from '../services/productService';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import ProductCard from '../components/ProductCard';

const BoutiquePage = () => {
  const { t } = useLanguage();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [boutique, setBoutique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'nameAsc'
  });

  useEffect(() => {
    loadBoutique();
  }, []);

  const loadBoutique = async () => {
    try {
      setLoading(true);
      const result = await productService.loadProducts(filters, 3); // 3 para boutique
      if (result.error) throw new Error(result.error);
      setBoutique(result.data || []);
    } catch (err) {
      setError(t('boutique.errorLoading'));
      console.error('Error loading boutique:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'nameAsc'
    });
  };

  const handleAddToCart = async (item) => {
    try {
      await addToCart(item);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const filteredBoutique = boutique.filter(item => {
    const matchesSearch = item.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
                        item.descripcion.toLowerCase().includes(filters.search.toLowerCase());
    const matchesMinPrice = !filters.minPrice || item.precio >= Number(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || item.precio <= Number(filters.maxPrice);
    return matchesSearch && matchesMinPrice && matchesMaxPrice;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'nameAsc':
        return a.nombre.localeCompare(b.nombre);
      case 'nameDesc':
        return b.nombre.localeCompare(a.nombre);
      case 'priceAsc':
        return a.precio - b.precio;
      case 'priceDesc':
        return b.precio - a.precio;
      default:
        return 0;
    }
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 text-xl font-medium mb-2">{error}</div>
          <button
            onClick={loadBoutique}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            {t('common.tryAgain')}
          </button>
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
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {showFilters ? <XMarkIcon className="h-5 w-5" /> : <FunnelIcon className="h-5 w-5" />}
            <span>{t('common.filters.title')}</span>
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-4 mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('common.filters.search')}
                  </label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder={t('common.filters.searchPlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('common.filters.minPrice')}
                  </label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('common.filters.maxPrice')}
                  </label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('common.filters.sortBy')}
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="nameAsc">{t('common.filters.sortOptions.nameAsc')}</option>
                    <option value="nameDesc">{t('common.filters.sortOptions.nameDesc')}</option>
                    <option value="priceAsc">{t('common.filters.sortOptions.priceAsc')}</option>
                    <option value="priceDesc">{t('common.filters.sortOptions.priceDesc')}</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {t('common.filters.reset')}
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  {t('common.filters.apply')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {loading ? (
            Array.from({ length: 12 }).map((_, index) => (
              <ProductCardSkeleton key={index} type="boutique" />
            ))
          ) : filteredBoutique.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Package className="mx-auto h-12 w-12 text-purple-300" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">{t('boutique.noBoutique')}</h3>
              <p className="mt-1 text-gray-500">{t('boutique.noBoutiqueMessage')}</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredBoutique.map(item => (
                <ProductCard key={item.id} product={item} type="boutique" />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </main>
  );
};

export default BoutiquePage; 
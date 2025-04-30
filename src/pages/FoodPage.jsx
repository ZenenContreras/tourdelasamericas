import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Filter, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import * as productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

export default function FoodPage() {
  const { t } = useLanguage();
  const [food, setFood] = useState([]);
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
    loadFood();
  }, []);

  const loadFood = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await productService.loadProducts(filters, 2); // 2 para comidas
      if (result.error) {
        setError(result.error);
      } else {
        setFood(result.data || []);
      }
    } catch (err) {
      setError(t('food.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    loadFood();
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'nameAsc'
    });
    loadFood();
  };

  const filteredFood = food.filter(item => {
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-8 sm:py-12">
      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center mb-2">
              <Utensils className="h-8 w-8 text-amber-600 mr-3" />
              {t('food.title')}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
              {t('food.description')}
            </p>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            {showFilters ? <X className="h-5 w-5" /> : <Filter className="h-5 w-5" />}
            <span>{t('food.filters')}</span>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('food.search')}
                  </label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder={t('food.searchPlaceholder')}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('food.minPrice')}
                  </label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('food.maxPrice')}
                  </label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('food.sortBy')}
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="nameAsc">{t('food.sortOptions.nameAsc')}</option>
                    <option value="nameDesc">{t('food.sortOptions.nameDesc')}</option>
                    <option value="priceAsc">{t('food.sortOptions.priceAsc')}</option>
                    <option value="priceDesc">{t('food.sortOptions.priceDesc')}</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {t('food.resetFilters')}
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
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
              <ProductCardSkeleton key={index} type="food" />
            ))
          ) : error ? (
            <div className="col-span-full text-center py-8">
              <div className="text-red-500 text-xl font-medium mb-2">{error}</div>
              <button
                onClick={loadFood}
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                {t('common.tryAgain')}
              </button>
            </div>
          ) : filteredFood.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Utensils className="mx-auto h-12 w-12 text-amber-300" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">{t('food.noFood')}</h3>
              <p className="mt-1 text-gray-500">{t('food.noFoodMessage')}</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredFood.map(item => (
                <ProductCard key={item.id} product={item} type="food" />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </main>
  );
} 
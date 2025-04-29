import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Filter, X, AlertTriangle, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import * as productService from '../services/productService';

const FoodPage = () => {
  const { t } = useLanguage();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [foods, setFoods] = useState([]);
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
    loadFoods();
  }, [filters]);

  const loadFoods = async () => {
    try {
      setLoading(true);
      const { data, error } = await productService.loadProducts(filters, 2);
      
      if (error) throw error;
      
      setFoods(data || []);
    } catch (error) {
      console.error('Error cargando comidas:', error);
      setError(t('food.errorLoading'));
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

  const handleAddToCart = async (food) => {
    try {
      await addToCart(food);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
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
              <Utensils className="h-8 w-8 text-indigo-600 mr-3" />
              {t('food.title')}
            </h1>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <Filter className="h-5 w-5 text-gray-500" />
              <span>{t('food.filters')}</span>
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
                  <h2 className="text-lg font-medium text-gray-900">{t('food.filterOptions')}</h2>
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
                      {t('food.search')}
                    </label>
                    <input
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder={t('food.searchPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('food.minPrice')}
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
                      {t('food.maxPrice')}
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
                      {t('food.sortBy')}
                    </label>
                    <select
                      name="sortBy"
                      value={filters.sortBy}
                      onChange={handleFilterChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="nombre-asc">{t('food.sortOptions.nameAsc')}</option>
                      <option value="nombre-desc">{t('food.sortOptions.nameDesc')}</option>
                      <option value="precio-asc">{t('food.sortOptions.priceAsc')}</option>
                      <option value="precio-desc">{t('food.sortOptions.priceDesc')}</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    {t('food.resetFilters')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : foods.length === 0 ? (
            <div className="text-center py-12">
              <Utensils className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">{t('food.noFood')}</h3>
              <p className="mt-1 text-sm text-gray-500">{t('food.noFoodMessage')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {foods.map((food) => (
                <motion.div
                  key={food.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden group"
                >
                  {food.imagen_url && (
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                      <img
                        src={food.imagen_url}
                        alt={food.nombre}
                        className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                      />
                    </div>
                  )}
                  
                  <div className="p-4">
                    {food.categoria && (
                      <div className="mb-2">
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                          {food.categoria}
                        </span>
                      </div>
                    )}
                    
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{food.nombre}</h3>
                    <p className="text-sm text-gray-500 mb-3">{food.descripcion}</p>
                    
                    {food.stock < 30 && (
                      <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full mb-3">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">
                          {t('food.lowStock', { food: food.nombre })}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        ${food.precio.toFixed(2)}
                      </span>
                      {isInCart(food.id) ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {t('cart.quantity')}: {getItemQuantity(food.id)}
                          </span>
                          <button
                            onClick={() => handleAddToCart(food)}
                            className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            disabled={food.stock === 0}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span>{t('cart.addMore')}</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(food)}
                          className="flex items-center space-x-2 bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                          disabled={food.stock === 0}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          <span>{food.stock === 0 ? t('food.outOfStock') : t('food.addToCart')}</span>
                        </button>
                      )}
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

export default FoodPage; 
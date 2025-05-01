import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Filter, X, AlertTriangle, ShoppingCart, Star, Package } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import * as productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import FilterPanel from '../components/FilterPanel';

const ProductsPage = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'nameAsc',
    subcategory: ''
  });

  const subcategories = [
    { id: '1', name: t('products.filters.subcategories.flour') },
    { id: '2', name: t('products.filters.subcategories.sauces') },
    { id: '3', name: t('products.filters.subcategories.snacks') }
  ];

  useEffect(() => {
    // Obtener subcategoría de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const subcategoriaFromUrl = urlParams.get('subcategoria');
    
    if (subcategoriaFromUrl) {
      setFilters(prev => ({
        ...prev,
        subcategory: subcategoriaFromUrl
      }));
    }
    
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const result = await productService.loadProducts(filters, 1); // 1 para productos
      if (result.error) throw new Error(result.error);
      setProducts(result.data || []);
    } catch (err) {
      setError(t('products.errorLoading'));
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    loadProducts();
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'nameAsc',
      subcategory: ''
    });
    loadProducts();
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
                        product.descripcion.toLowerCase().includes(filters.search.toLowerCase());
    const matchesMinPrice = !filters.minPrice || product.precio >= Number(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || product.precio <= Number(filters.maxPrice);
    const matchesSubcategory = !filters.subcategory || product.subcategoria_id === Number(filters.subcategory);
    return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesSubcategory;
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 text-xl font-medium mb-2">{error}</div>
          <button
            onClick={loadProducts}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            {t('common.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-8 sm:py-12">
      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center mb-2">
              <ShoppingBag className="h-8 w-8 text-indigo-600 mr-3" />
              {t('products.title')}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
              {t('products.description')}
            </p>
          </div>
          
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Filter className="h-5 w-5" />
            <span>{t('products.filters.title')}</span>
          </button>
        </div>

        <FilterPanel
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          onApply={handleApplyFilters}
          subcategories={subcategories}
          type="product"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {loading ? (
            Array.from({ length: 12 }).map((_, index) => (
              <ProductCardSkeleton key={index} type="product" />
            ))
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <ShoppingBag className="mx-auto h-12 w-12 text-indigo-300" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">{t('products.noProducts')}</h3>
              <p className="mt-1 text-gray-500">{t('products.noProductsMessage')}</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} type="product" />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductsPage; 
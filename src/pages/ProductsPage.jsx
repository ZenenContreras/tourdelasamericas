import React, { useState, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
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
  const [isMobile, setIsMobile] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'nameAsc',
    subcategory: ''
  });

  const subcategories = [
    { id: '1', name: t('products.filters.subcategories.flour') },
    { id: '2', name: t('products.filters.subcategories.sauces') },
    { id: '3', name: t('products.filters.subcategories.snacks') }
  ];

  // Detectar si es dispositivo móvil
  useLayoutEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

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
      minPrice: 0,
      maxPrice: 1000,
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

  // Componente de barra de búsqueda reutilizable
  const SearchBar = ({ className = "" }) => (
    <div className={`flex flex-col sm:flex-row items-stretch gap-3 ${className}`}>
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-indigo-500" />
        </div>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => { 
            handleFilterChange('search', e.target.value);
            handleApplyFilters();
          }}
          placeholder="Buscar productos..."
          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 h-full"
        />
      </div>
      
      <select
        value={filters.sortBy}
        onChange={(e) => {
          handleFilterChange('sortBy', e.target.value);
          handleApplyFilters();
        }}
        className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
      >
        <option value="nameAsc">Nombre (A-Z)</option>
        <option value="nameDesc">Nombre (Z-A)</option>
        <option value="priceAsc">Precio (Menor a Mayor)</option>
        <option value="priceDesc">Precio (Mayor a Menor)</option>
      </select>
    </div>
  );

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

  // Vista móvil
  if (isMobile) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-8">
        <div className="max-w-[95rem] mx-auto px-4 sm:px-6 mt-10">
          <div className="flex flex-col justify-between items-start mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center mb-2">
                <ShoppingBag className="h-7 w-7 text-indigo-600 mr-3" />
                {t('products.title')}
              </h1>
              <p className="text-sm text-gray-600 max-w-2xl mb-4">
                {t('products.description')}
              </p>
            </div>
            
            {/* Barra de búsqueda móvil */}
            <SearchBar className="w-full mb-3" />
            
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full justify-center"
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span>{t('products.filters.title')}</span>
            </button>
          </div>

          {/* Panel de filtros - Modal móvil */}
          <FilterPanel
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            onApply={handleApplyFilters}
            subcategories={subcategories}
            type="product"
            isMobile={true}
          />

          <div className="grid grid-cols-2 gap-3 mt-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <ProductCardSkeleton key={index} type="product" />
              ))
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-2 text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200">
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
  }

  // Vista desktop
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-8 sm:py-12">
      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col items-start mb-6">
          <div className="w-full">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
              <ShoppingBag className="h-8 w-8 text-indigo-600 mr-3" />
              {t('products.title')}
            </h1>
            <p className="text-base text-gray-600 max-w-3xl mb-4">
              {t('products.description')}
            </p>
            
            {/* Barra de búsqueda desktop */}
            <SearchBar />
          </div>
        </div>

        <div className="flex flex-row gap-6">
          {/* Columna de filtros (25% del ancho) */}
          <div className="w-1/4 flex-shrink-0">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              onApply={handleApplyFilters}
              subcategories={subcategories}
              type="product"
              isMobile={false}
            />
          </div>
          
          {/* Columna de productos (75% del ancho) */}
          <div className="w-3/4 flex-grow-0">
            {loading ? (
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, index) => (
                  <ProductCardSkeleton key={index} type="product" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <ShoppingBag className="mx-auto h-16 w-16 text-indigo-300" />
                <h3 className="mt-4 text-xl font-medium text-gray-900">{t('products.noProducts')}</h3>
                <p className="mt-2 text-gray-500 max-w-md mx-auto">{t('products.noProductsMessage')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} type="product" />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductsPage; 
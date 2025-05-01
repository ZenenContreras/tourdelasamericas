import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, SlidersHorizontal } from 'lucide-react';

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onReset, 
  onApply, 
  subcategories, 
  type,
  isOpen,
  onClose
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || 0,
    max: filters.maxPrice || 1000
  });

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handlePriceChange = (type, value) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleApply = () => {
    onFilterChange('minPrice', priceRange.min);
    onFilterChange('maxPrice', priceRange.max);
    onApply();
  };

  const handleReset = () => {
    setPriceRange({ min: 0, max: 1000 });
    onReset();
  };

  const getColorByType = (type) => {
    switch (type) {
      case 'product':
        return 'indigo';
      case 'food':
        return 'amber';
      case 'boutique':
        return 'purple';
      default:
        return 'indigo';
    }
  };

  const color = getColorByType(type);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-auto mt-20"
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className={`h-5 w-5 text-${color}-600`} />
                <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Búsqueda */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <input
                  type="text"
                  value={localFilters.search}
                  onChange={(e) => onFilterChange('search', e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-${color}-500"
                />
              </div>

              {/* Subcategorías */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategorías
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {subcategories.map(subcat => (
                    <button
                      key={subcat.id}
                      onClick={() => onFilterChange('subcategory', subcat.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        localFilters.subcategory === subcat.id
                          ? `bg-${color}-100 text-${color}-700`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {subcat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rango de Precios */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rango de Precios
                </label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange.min}
                      onChange={(e) => handlePriceChange('min', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange.max}
                      onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>${priceRange.min}</span>
                    <span>${priceRange.max}</span>
                  </div>
                </div>
              </div>

              {/* Ordenar por */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordenar por
                </label>
                <select
                  value={localFilters.sortBy}
                  onChange={(e) => onFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-${color}-500"
                >
                  <option value="nameAsc">Nombre (A-Z)</option>
                  <option value="nameDesc">Nombre (Z-A)</option>
                  <option value="priceAsc">Precio (Menor a Mayor)</option>
                  <option value="priceDesc">Precio (Mayor a Menor)</option>
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Restablecer
              </button>
              <button
                onClick={handleApply}
                className={`px-4 py-2 bg-${color}-600 text-white rounded-lg hover:bg-${color}-700 transition-colors`}
              >
                Aplicar Filtros
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilterPanel; 
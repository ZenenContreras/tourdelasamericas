import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, SlidersHorizontal, ChevronDown, Search, Trash2, Tag, CheckCircle, AlertCircle } from 'lucide-react';

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onReset, 
  onApply, 
  subcategories, 
  type,
  isOpen,
  onClose,
  isMobile = false,
  isFiltersVisible = true
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || 0,
    max: filters.maxPrice || 1000
  });
  const [activeSubcategories, setActiveSubcategories] = useState([]);
  const [expanded, setExpanded] = useState({
    subcategories: !isMobile,
    price: !isMobile,
    sort: !isMobile
  });
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success' // success, error, info
  });

  // Detectar si hay algún filtro activo
  const hasActiveFilters = () => {
    return (
      filters.search || 
      filters.subcategory || 
      filters.minPrice > 0 || 
      filters.maxPrice < 1000 || 
      filters.sortBy !== 'nameAsc'
    );
  };

  useEffect(() => {
    setLocalFilters(filters);
    
    // Si hay una subcategoría seleccionada, añadirla al array de activas
    if (filters.subcategory) {
      const subcategory = subcategories.find(s => s.id === filters.subcategory);
      if (subcategory && !activeSubcategories.some(s => s.id === subcategory.id)) {
        setActiveSubcategories([subcategory]);
      }
    } else {
      setActiveSubcategories([]);
    }
    
    setPriceRange({
      min: filters.minPrice || 0,
      max: filters.maxPrice || 1000
    });
  }, [filters, subcategories]);

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
    showNotification('Filtros aplicados correctamente', 'success');
  };

  const handleReset = () => {
    setPriceRange({ min: 0, max: 1000 });
    setActiveSubcategories([]);
    onReset();
    showNotification('Todos los filtros han sido restablecidos', 'info');
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

  const toggleExpanded = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const showNotification = (message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleRemoveFilter = (filterType, value = null) => {
    if (filterType === 'subcategory') {
      setActiveSubcategories([]);
      onFilterChange('subcategory', '');
      showNotification('Filtro de subcategoría eliminado', 'info');
    } else if (filterType === 'price') {
      setPriceRange({ min: 0, max: 1000 });
      onFilterChange('minPrice', 0);
      onFilterChange('maxPrice', 1000);
      showNotification('Filtro de precio eliminado', 'info');
    } else if (filterType === 'sortBy') {
      onFilterChange('sortBy', 'nameAsc');
      showNotification('Orden predeterminado restaurado', 'info');
    } else if (filterType === 'search') {
      onFilterChange('search', '');
      showNotification('Búsqueda eliminada', 'info');
    } else if (filterType === 'all') {
      handleReset();
    }
    onApply();
  };

  // Renderizar chips de filtros activos
  const renderActiveFilters = () => {
    if (!hasActiveFilters()) return null;

    const chips = [];

    if (filters.search) {
      chips.push(
        <motion.div 
          key="search" 
          className={`inline-flex items-center px-3 py-1 rounded-full bg-${color}-100 text-${color}-800 text-xs font-medium mr-2 mb-2`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <Search className="h-3 w-3 mr-1" />
          <span className="truncate max-w-[120px]">{filters.search}</span>
          <button onClick={() => handleRemoveFilter('search')} className="ml-1 p-0.5 hover:bg-white rounded-full">
            <X className="h-3 w-3" />
          </button>
        </motion.div>
      );
    }

    if (activeSubcategories.length > 0) {
      activeSubcategories.forEach(subcat => {
        chips.push(
          <motion.div 
            key={`subcat-${subcat.id}`} 
            className={`inline-flex items-center px-3 py-1 rounded-full bg-${color}-100 text-${color}-800 text-xs font-medium mr-2 mb-2`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Tag className="h-3 w-3 mr-1" />
            <span>{subcat.name}</span>
            <button onClick={() => handleRemoveFilter('subcategory')} className="ml-1 p-0.5 hover:bg-white rounded-full">
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        );
      });
    }

    if (filters.minPrice > 0 || filters.maxPrice < 1000) {
      chips.push(
        <motion.div 
          key="price" 
          className={`inline-flex items-center px-3 py-1 rounded-full bg-${color}-100 text-${color}-800 text-xs font-medium mr-2 mb-2`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <span>${filters.minPrice} - ${filters.maxPrice}</span>
          <button onClick={() => handleRemoveFilter('price')} className="ml-1 p-0.5 hover:bg-white rounded-full">
            <X className="h-3 w-3" />
          </button>
        </motion.div>
      );
    }

    if (filters.sortBy && filters.sortBy !== 'nameAsc') {
      const sortLabels = {
        nameAsc: "Nombre (A-Z)",
        nameDesc: "Nombre (Z-A)",
        priceAsc: "Precio (Menor a Mayor)",
        priceDesc: "Precio (Mayor a Menor)"
      };
      
      chips.push(
        <motion.div 
          key="sort" 
          className={`inline-flex items-center px-3 py-1 rounded-full bg-${color}-100 text-${color}-800 text-xs font-medium mr-2 mb-2`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <span>{sortLabels[filters.sortBy]}</span>
          <button onClick={() => handleRemoveFilter('sortBy')} className="ml-1 p-0.5 hover:bg-white rounded-full">
            <X className="h-3 w-3" />
          </button>
        </motion.div>
      );
    }

    return (
      <div className="flex flex-wrap items-center">
        {chips}
        {chips.length > 1 && (
          <motion.button
            className={`inline-flex items-center px-3 py-1 rounded-full border border-${color}-200 text-${color}-600 text-xs font-medium hover:bg-${color}-50`}
            onClick={() => handleRemoveFilter('all')}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Limpiar filtros
          </motion.button>
        )}
      </div>
    );
  };

  // Componente de notificación
  const Notification = () => {
    if (!notification.show) return null;
    
    const bgColor = notification.type === 'success' 
      ? 'bg-green-100 border-green-500 text-green-800' 
      : notification.type === 'error' 
        ? 'bg-red-100 border-red-500 text-red-800' 
        : 'bg-blue-100 border-blue-500 text-blue-800';
    
    const Icon = notification.type === 'success' 
      ? CheckCircle 
      : notification.type === 'error' 
        ? AlertCircle 
        : CheckCircle;
    
    return (
      <motion.div 
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 rounded-lg shadow-lg px-4 py-3 flex items-center space-x-2 border-l-4 ${bgColor} max-w-sm`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Icon className="h-5 w-5" />
        <span className="text-sm font-medium">{notification.message}</span>
        <button 
          onClick={() => setNotification(prev => ({ ...prev, show: false }))}
          className="ml-auto"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    );
  };

  // Renderización móvil con buscador externo
  if (isMobile) {
    return (
      <>
        {/* Notificación */}
        <AnimatePresence>
          {notification.show && <Notification />}
        </AnimatePresence>
        
        {/* Área de filtros activos siempre visible en la parte superior */}
        <div className="mb-4">
          <AnimatePresence>
            {renderActiveFilters()}
          </AnimatePresence>
        </div>
      
        {/* Panel modal para móvil */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end justify-center"
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-t-xl shadow-xl w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="sticky top-0 p-4 border-b border-gray-200 flex items-center justify-between bg-white z-10">
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

                <div className="p-4 space-y-4 pb-24">
                  {/* Subcategorías */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => toggleExpanded('subcategories')}
                      className="flex items-center justify-between w-full px-4 py-3 bg-gray-50"
                    >
                      <div className="flex items-center">
                        <Tag className={`h-4 w-4 mr-2 text-${color}-500`} />
                        <span className="font-medium text-gray-700">Subcategorías</span>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-500 transition-transform ${expanded.subcategories ? 'transform rotate-180' : ''}`}
                      />
                    </button>
                    
                    <AnimatePresence>
                      {expanded.subcategories && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-3 grid grid-cols-1 gap-2">
                            {subcategories.map(subcat => (
                              <button
                                key={subcat.id}
                                onClick={() => {
                                  onFilterChange('subcategory', localFilters.subcategory === subcat.id ? '' : subcat.id);
                                  setActiveSubcategories(prev => 
                                    prev.some(s => s.id === subcat.id) 
                                      ? prev.filter(s => s.id !== subcat.id) 
                                      : [...prev, subcat]
                                  );
                                  showNotification(`Subcategoría "${subcat.name}" ${localFilters.subcategory === subcat.id ? 'eliminada' : 'aplicada'}`, 'success');
                                }}
                                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left flex items-center justify-between ${
                                  localFilters.subcategory === subcat.id
                                    ? `bg-${color}-100 text-${color}-700 border border-${color}-200`
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100'
                                }`}
                              >
                                <span>{subcat.name}</span>
                                {localFilters.subcategory === subcat.id && (
                                  <div className={`h-2 w-2 rounded-full bg-${color}-500`}></div>
                                )}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Rango de Precios */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => toggleExpanded('price')}
                      className="flex items-center justify-between w-full px-4 py-3 bg-gray-50"
                    >
                      <div className="flex items-center">
                        <span className={`inline-block mr-2 text-${color}-500 font-medium`}>$</span>
                        <span className="font-medium text-gray-700">Rango de Precios</span>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-500 transition-transform ${expanded.price ? 'transform rotate-180' : ''}`}
                      />
                    </button>
                    
                    <AnimatePresence>
                      {expanded.price && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 space-y-6">
                            <div className="flex items-center justify-between gap-4">
                              <div className="relative flex-1">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">$</span>
                                <input
                                  type="number"
                                  min="0"
                                  max={priceRange.max}
                                  value={priceRange.min}
                                  onChange={(e) => handlePriceChange('min', parseInt(e.target.value) || 0)}
                                  className={`w-full pl-7 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-${color}-500 text-center`}
                                />
                                <label className="block text-xs text-gray-500 mt-1 text-center">Mínimo</label>
                              </div>
                              
                              <span className="text-gray-400">-</span>
                              
                              <div className="relative flex-1">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">$</span>
                                <input
                                  type="number"
                                  min={priceRange.min}
                                  max="1000"
                                  value={priceRange.max}
                                  onChange={(e) => handlePriceChange('max', parseInt(e.target.value) || 0)}
                                  className={`w-full pl-7 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-${color}-500 text-center`}
                                />
                                <label className="block text-xs text-gray-500 mt-1 text-center">Máximo</label>
                              </div>
                            </div>
                            
                            <div>
                              <input
                                type="range"
                                min="0"
                                max="1000"
                                value={priceRange.min}
                                onChange={(e) => handlePriceChange('min', parseInt(e.target.value))}
                                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-4 range-${color}`}
                                style={{
                                  background: `linear-gradient(to right, #e5e7eb ${priceRange.min / 10}%, #${color === 'indigo' ? '6366f1' : color === 'amber' ? 'f59e0b' : 'a855f7'} ${priceRange.min / 10}% ${priceRange.max / 10}%, #e5e7eb ${priceRange.max / 10}%)`
                                }}
                              />
                              <input
                                type="range"
                                min="0"
                                max="1000"
                                value={priceRange.max}
                                onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
                                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-${color}`}
                                style={{
                                  background: `linear-gradient(to right, #e5e7eb ${priceRange.min / 10}%, #${color === 'indigo' ? '6366f1' : color === 'amber' ? 'f59e0b' : 'a855f7'} ${priceRange.min / 10}% ${priceRange.max / 10}%, #e5e7eb ${priceRange.max / 10}%)`
                                }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Ordenar por */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => toggleExpanded('sort')}
                      className="flex items-center justify-between w-full px-4 py-3 bg-gray-50"
                    >
                      <div className="flex items-center">
                        <SlidersHorizontal className={`h-4 w-4 mr-2 text-${color}-500`} />
                        <span className="font-medium text-gray-700">Ordenar por</span>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-500 transition-transform ${expanded.sort ? 'transform rotate-180' : ''}`}
                      />
                    </button>
                    
                    <AnimatePresence>
                      {expanded.sort && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-3 space-y-2">
                            {[
                              { value: 'nameAsc', label: 'Nombre (A-Z)' },
                              { value: 'nameDesc', label: 'Nombre (Z-A)' },
                              { value: 'priceAsc', label: 'Precio (Menor a Mayor)' },
                              { value: 'priceDesc', label: 'Precio (Mayor a Menor)' }
                            ].map(option => (
                              <button
                                key={option.value}
                                onClick={() => {
                                  onFilterChange('sortBy', option.value);
                                  showNotification(`Ordenado por ${option.label}`, 'success');
                                }}
                                className={`w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left flex items-center justify-between ${
                                  localFilters.sortBy === option.value
                                    ? `bg-${color}-100 text-${color}-700 border border-${color}-200`
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100'
                                }`}
                              >
                                <span>{option.label}</span>
                                {localFilters.sortBy === option.value && (
                                  <div className={`h-2 w-2 rounded-full bg-${color}-500`}></div>
                                )}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-gray-200 flex justify-between gap-3 bg-white">
                  <button
                    onClick={handleReset}
                    className={`px-4 py-3 text-${color}-600 hover:text-${color}-800 transition-colors bg-white border border-gray-200 rounded-lg flex-1`}
                  >
                    Restablecer
                  </button>
                  <button
                    onClick={handleApply}
                    className={`px-4 py-3 bg-${color}-600 text-white rounded-lg hover:bg-${color}-700 transition-colors flex-[2]`}
                  >
                    Aplicar Filtros
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Versión desktop - filtros a la izquierda y datos a la derecha
  if (!isFiltersVisible) {
    return (
      <>
        {/* Notificación */}
        <AnimatePresence>
          {notification.show && <Notification />}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      {/* Notificación */}
      <AnimatePresence>
        {notification.show && <Notification />}
      </AnimatePresence>
      
      {/* Filtros activos como chips */}
      <AnimatePresence>
        {renderActiveFilters()}
      </AnimatePresence>
      
      {/* Contenedor principal de filtros */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
        {/* Cabecera de filtros */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <SlidersHorizontal className={`h-4 w-4 mr-2 text-${color}-500`} />
            <span className="font-medium text-gray-700">Filtros</span>
          </div>
          {hasActiveFilters() && (
            <button
              onClick={handleReset}
              className={`text-xs text-${color}-600 hover:text-${color}-800 flex items-center gap-1`}
            >
              <Trash2 className="h-3 w-3" />
              Limpiar todo
            </button>
          )}
        </div>
        
        {/* Contenido de filtros */}
        <div className="p-4 space-y-6">
          {/* Subcategorías */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Tag className={`h-4 w-4 mr-2 text-${color}-500`} />
              Subcategorías
            </h3>
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
              {subcategories.map(subcat => (
                <button
                  key={subcat.id}
                  onClick={() => {
                    onFilterChange('subcategory', localFilters.subcategory === subcat.id ? '' : subcat.id);
                    setActiveSubcategories(prev => 
                      prev.some(s => s.id === subcat.id) 
                        ? prev.filter(s => s.id !== subcat.id) 
                        : [...prev, subcat]
                    );
                    showNotification(`Subcategoría "${subcat.name}" ${localFilters.subcategory === subcat.id ? 'eliminada' : 'aplicada'}`, 'success');
                    onApply();
                  }}
                  className={`w-full px-3 py-2.5 rounded-lg text-sm transition-colors text-left flex items-center justify-between ${
                    localFilters.subcategory === subcat.id
                      ? `bg-${color}-100 text-${color}-700 border border-${color}-200 font-medium`
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100'
                  }`}
                >
                  <span>{subcat.name}</span>
                  {localFilters.subcategory === subcat.id && (
                    <div className={`h-2 w-2 rounded-full bg-${color}-500`}></div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Rango de Precios */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <span className={`inline-block mr-2 text-${color}-500 font-medium`}>$</span>
              Rango de Precios
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    max={priceRange.max}
                    value={priceRange.min}
                    onChange={(e) => {
                      handlePriceChange('min', parseInt(e.target.value) || 0);
                      onFilterChange('minPrice', parseInt(e.target.value) || 0);
                      onApply();
                      showNotification('Rango de precio actualizado', 'success');
                    }}
                    className={`w-full pl-7 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-${color}-500 text-center text-sm`}
                  />
                  <label className="block text-xs text-gray-500 mt-1 text-center">Mínimo</label>
                </div>
                
                <span className="text-gray-400">-</span>
                
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">$</span>
                  <input
                    type="number"
                    min={priceRange.min}
                    max="1000"
                    value={priceRange.max}
                    onChange={(e) => {
                      handlePriceChange('max', parseInt(e.target.value) || 0);
                      onFilterChange('maxPrice', parseInt(e.target.value) || 0);
                      onApply();
                      showNotification('Rango de precio actualizado', 'success');
                    }}
                    className={`w-full pl-7 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-${color}-500 text-center text-sm`}
                  />
                  <label className="block text-xs text-gray-500 mt-1 text-center">Máximo</label>
                </div>
              </div>
              
              <div className="px-1">
                <div className="relative pt-2">
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`absolute h-2 bg-${color}-500 rounded-full`}
                      style={{
                        left: `${priceRange.min / 10}%`,
                        right: `${100 - priceRange.max / 10}%`
                      }}
                    ></div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange.min}
                    onChange={(e) => {
                      handlePriceChange('min', parseInt(e.target.value));
                      onFilterChange('minPrice', parseInt(e.target.value));
                      onApply();
                    }}
                    className={`absolute w-full h-2 opacity-0 cursor-pointer top-2 range-${color}`}
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange.max}
                    onChange={(e) => {
                      handlePriceChange('max', parseInt(e.target.value));
                      onFilterChange('maxPrice', parseInt(e.target.value));
                      onApply();
                    }}
                    className={`absolute w-full h-2 opacity-0 cursor-pointer top-2 range-${color}`}
                  />
                </div>
                <div className="flex justify-between mt-4 text-xs text-gray-500">
                  <span>$0</span>
                  <span>$250</span>
                  <span>$500</span>
                  <span>$750</span>
                  <span>$1000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel; 
import React from 'react';

const ProductCardSkeleton = ({ type = 'product' }) => {
  // Configuración de colores según el tipo
  const colorConfig = {
    product: 'indigo',
    food: 'amber',
    boutique: 'purple'
  };

  const color = colorConfig[type];

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden border border-${color}-50 animate-pulse`}>
      {/* Imagen */}
      <div className={`aspect-w-1 aspect-h-1 w-full bg-gradient-to-br from-${color}-50 to-gray-100`} />
      
      <div className="p-3">
        <div className="flex flex-col h-full">
          {/* Categoría */}
          <div className="mb-2">
            <div className={`w-20 h-4 bg-${color}-50 rounded-full`} />
          </div>
          
          {/* Título */}
          <div className="w-full h-4 bg-gray-200 rounded mb-2" />
          <div className="w-2/3 h-4 bg-gray-200 rounded mb-4" />
          
          {/* Descripción */}
          <div className="w-full h-3 bg-gray-100 rounded mb-1" />
          <div className="w-4/5 h-3 bg-gray-100 rounded mb-4" />
          
          {/* Precio y botón */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
            <div className="w-16 h-5 bg-gray-200 rounded" />
            <div className={`w-24 h-8 bg-${color}-200 rounded-lg`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton; 
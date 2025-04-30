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
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300 border border-${color}-100 hover:border-${color}-300 h-full flex flex-col animate-pulse`}>
      {/* Contenedor de imagen con aspect ratio fijo */}
      <div className="relative aspect-square w-full overflow-hidden">
        <div className={`w-full h-full bg-gradient-to-br from-${color}-50 via-white to-${color}-50`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
      
      {/* Contenido del card con altura fija */}
      <div className="p-2 sm:p-3 md:p-4 flex flex-col flex-grow">
        <div className="mb-1 sm:mb-2 flex flex-wrap gap-0.5 sm:gap-1">
          <div className={`w-20 h-3 sm:h-4 bg-${color}-50 rounded-full`} />
        </div>
        
        <div className="w-full h-3 sm:h-4 bg-gray-200 rounded mb-1 sm:mb-2" />
        <div className="w-2/3 h-3 sm:h-4 bg-gray-200 rounded mb-2 sm:mb-3" />
        
        <div className="w-full h-2.5 sm:h-3 bg-gray-100 rounded mb-1 sm:mb-2" />
        <div className="w-4/5 h-2.5 sm:h-3 bg-gray-100 rounded mb-2 sm:mb-3" />
        
        {/* Alerta de stock bajo */}
        <div className={`flex items-center justify-center gap-0.5 sm:gap-1 bg-${color}-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg mb-2 sm:mb-3`}>
          <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 bg-${color}-200 rounded-full`} />
          <div className={`w-24 h-2.5 sm:h-3 bg-${color}-100 rounded`} />
        </div>
        
        {/* Footer del card con precio y botón */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 sm:pt-3 border-t border-gray-100 mt-auto gap-2">
          <div className="flex flex-col">
            <div className="w-12 h-2.5 sm:h-3 bg-gray-200 rounded mb-1" />
            <div className="w-16 h-4 sm:h-5 bg-gray-200 rounded" />
          </div>
          <div className={`w-full sm:w-auto h-8 sm:h-9 bg-${color}-200 rounded-lg`} />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton; 
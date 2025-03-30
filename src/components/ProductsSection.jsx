import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Package, Sandwich, UtensilsCrossed } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ProductsSection = () => {
  const { t } = useLanguage();

  // Categorías de productos
  const categories = [
    {
      id: 'harina-masa',
      name: 'Harina y masa',
      icon: <UtensilsCrossed className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-yellow-500" />,
      description: 'Descubre nuestras harinas de maíz, trigo y especialidades para preparar arepas, tortillas y más',
      image: '/harinasMasas.png',
      color: 'from-yellow-600 to-yellow-400'
    },
    {
      id: 'salsas-aderezos',
      name: 'Salsas y aderezos',
      icon: <Sandwich className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-red-500" />,
      description: 'Explora nuestra variedad de salsas picantes, moles, chimichurris y condimentos auténticos',
      image: '/salsasAderezos.png',
      color: 'from-red-600 to-red-400'
    },
    {
      id: 'paquetes-snacks',
      name: 'Paquetes y snacks',
      icon: <Package className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-green-500" />,
      description: 'Disfruta de nuestros chips de tortilla, bocadillos, galletas y dulces tradicionales',
      image: '/paquetesSnacks.png',
      color: 'from-green-600 to-green-400'
    }
  ];

  // Animación para entrada escalonada de elementos
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  // Animación para cada franja de categoría
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-10 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4 sm:mb-6">
            <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600 mr-2 sm:mr-3" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{t('sections.products')}</h2>
          </div>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explora nuestras categorías de productos auténticos de las Américas, cada una con sabores y tradiciones únicas.
          </p>
        </motion.div>

        {/* Franjas de categorías */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group h-52 sm:h-56 md:h-64"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = `/catalogo/${category.id}`}
            >
              {/* Fondo de la categoría con imagen y overlay */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 filter blur-[1px]"
                />
                
                {/* Gradiente para mejor legibilidad - opacidad reducida al 10% */}
                <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-10 transition-opacity duration-300 group-hover:opacity-20`}></div>
              
                {/* Contenido de la categoría */}
                <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-8">
                  <div className="flex items-center mb-3 sm:mb-4 inline-block">
                    {category.icon}
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white ml-3 sm:ml-4 drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
                      {category.name}
                    </h3>
                  </div>
                  
                  <p className="text-sm sm:text-base text-white mb-4 sm:mb-6 max-w-2xl drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
                    {category.description}
                  </p>
                  
                  <div className="flex items-center text-white mt-auto bg-black/15 px-3 py-2 rounded-lg inline-flex">
                    <span className="text-sm sm:text-base font-medium drop-shadow-md" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Ver productos</span>
                    <motion.div 
                      className="ml-2"
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                    >
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Botón para ver todo el catálogo */}
        <motion.div
          className="mt-10 sm:mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="inline-flex items-center bg-indigo-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg text-base sm:text-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/catalogo'}
          >
            Ver catálogo completo
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection; 
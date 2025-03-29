import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ProductsSection = () => {
  const { t } = useLanguage();
  const [clickedProduct, setClickedProduct] = useState(null);

  const products = [
    {
      id: 1,
      name: 'Poncho Colorido Andino',
      image: '/poncho.png',
      country: 'Perú',
      price: '$79.99',
      rating: 4.9
    },
    {
      id: 2,
      name: 'Sombrero Vueltiao',
      image: '/sombrero.png',
      country: 'Colombia',
      price: '$64.99',
      rating: 4.7
    },
    {
      id: 3,
      name: 'Árbol de la Vida Mexicano',
      image: '/arbol.png',
      country: 'México',
      price: '$129.99',
      rating: 5.0
    },
    {
      id: 4,
      name: 'Pulsera Wayuu',
      image: '/pulsera.png',
      country: 'Colombia',
      price: '$24.99',
      rating: 4.8
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
    hover: {
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  const handleProductClick = (productId) => {
    setClickedProduct(productId);
    setTimeout(() => setClickedProduct(null), 2000); // Reset after 2 seconds
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4 sm:mb-6">
            <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600 mr-2 sm:mr-3" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{t('sections.products')}</h2>
          </div>
          <p className="mt-3 sm:mt-4 text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('productSection.description')}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 cursor-pointer"
              variants={itemVariants}
              onClick={() => handleProductClick(product.id)}
            >
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg">
                  {t('productSection.featured')}
                </div>
              </div>
              
              <div className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg sm:text-xl font-bold text-indigo-600">{product.price}</span>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Coming Soon Overlay */}
              <AnimatePresence>
                {clickedProduct === product.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-indigo-600/90 backdrop-blur-sm flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="text-center p-6"
                    >
                      <span className="text-white text-xl font-bold block mb-2">{t('productSection.comingSoon')}</span>
                      <span className="text-white/80 text-sm">{t('productSection.clickToSee')}</span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('productSection.viewAll')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection; 
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ProductsSection = () => {
  const { t } = useLanguage();

  const products = [
    {
      id: 1,
      name: 'Poncho Colorido Andino',
      image: 'https://cdn.pixabay.com/photo/2017/08/10/08/06/clothes-2619832_960_720.jpg',
      country: 'Perú',
      price: '$79.99',
      rating: 4.9
    },
    {
      id: 2,
      name: 'Sombrero Vueltiao',
      image: 'https://images.unsplash.com/photo-1578878799601-d40c1b42d86c?auto=format&fit=crop&q=80',
      country: 'Colombia',
      price: '$64.99',
      rating: 4.7
    },
    {
      id: 3,
      name: 'Árbol de la Vida Mexicano',
      image: 'https://cdn.pixabay.com/photo/2017/08/01/06/29/arbol-solo-2563203_1280.jpg',
      country: 'México',
      price: '$129.99',
      rating: 5.0
    },
    {
      id: 4,
      name: 'Pulsera Wayuu',
      image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&q=80',
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

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <ShoppingBag className="h-8 w-8 text-indigo-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">{t('sections.products')}</h2>
          </div>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            {t('productSection.description')}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
              variants={itemVariants}
              whileHover="hover"
            >
              <div className="relative h-64 overflow-hidden">
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs uppercase tracking-wider font-bold px-2 py-1 rounded-lg">
                  {t('productSection.featured')}
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-indigo-600 font-medium">{product.country}</span>
                  <span className="text-lg font-bold text-gray-900">{product.price}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <motion.button
                  className="w-full mt-4 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors flex items-center justify-center"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>{t('productSection.viewDetails')}</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.button>
              </div>
              <div className="absolute inset-0 bg-indigo-600/80 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 pointer-events-none">
                <span className="text-white font-medium text-lg">{t('productSection.comingSoon')}</span>
              </div>
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
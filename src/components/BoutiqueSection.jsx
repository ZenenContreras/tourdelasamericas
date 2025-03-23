import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const BoutiqueSection = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredItem, setHoveredItem] = useState(null);

  const categories = [
    { id: 'all', name: 'boutiqueSection.allCategories' },
    { id: 'clothing', name: 'boutiqueSection.clothing' },
    { id: 'jewelry', name: 'boutiqueSection.jewelry' },
    { id: 'accessories', name: 'boutiqueSection.accessories' }
  ];

  const boutique = [
    {
      id: 1,
      name: 'Huipil Mexicano',
      image: 'https://images.unsplash.com/photo-1606743628895-1c7c00b7b322?auto=format&fit=crop&q=80',
      category: 'clothing',
      price: '$149.99',
      origin: 'México',
      isFeatured: true
    },
    {
      id: 2,
      name: 'Aretes de Filigrana',
      image: 'https://images.unsplash.com/photo-1579037873544-f5d937d9b1e4?auto=format&fit=crop&q=80',
      category: 'jewelry',
      price: '$79.99',
      origin: 'Colombia',
      isFeatured: false
    },
    {
      id: 3,
      name: 'Sombrero de Paja Toquilla',
      image: 'https://images.unsplash.com/photo-1583507262027-d2abd6cab047?auto=format&fit=crop&q=80',
      category: 'accessories',
      price: '$159.99',
      origin: 'Ecuador',
      isFeatured: true
    },
    {
      id: 4,
      name: 'Bolso Wayuu',
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80',
      category: 'accessories',
      price: '$84.99',
      origin: 'Colombia',
      isFeatured: false
    }
  ];

  const filteredBoutique = activeCategory === 'all' 
    ? boutique 
    : boutique.filter(item => item.category === activeCategory);

  return (
    <section className="py-20 bg-gradient-to-bl from-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <ShoppingBag className="h-8 w-8 text-purple-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">{t('sections.boutique')}</h2>
          </div>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            {t('boutiqueSection.description')}
          </p>
        </motion.div>

        {/* Categories Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium ${
                activeCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } transition-colors duration-300 shadow-sm`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-2">
                {activeCategory === category.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                )}
                <span>{t(category.name)}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {filteredBoutique.map((item) => (
              <motion.div
                key={item.id}
                className="relative bg-white rounded-xl overflow-hidden shadow-lg"
                whileHover={{ y: -10 }}
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
                layout
              >
                <div className="relative h-72 overflow-hidden">
                  <motion.img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  
                  <div className="absolute top-4 left-4">
                    {item.isFeatured && (
                      <motion.div
                        className="bg-purple-600 text-white py-1 px-3 rounded-full text-xs uppercase tracking-wider font-semibold"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {t('boutiqueSection.featured')}
                      </motion.div>
                    )}
                  </div>
                  
                  <motion.div
                    className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className={`h-5 w-5 ${hoveredItem === item.id ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                  </motion.div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                    <span className="text-lg font-semibold text-purple-600">{item.price}</span>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-sm text-gray-600">{item.origin}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <motion.button
                      className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t('boutiqueSection.notifyMe')}
                    </motion.button>
                    <motion.button
                      className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
                
                {/* Coming Soon Overlay */}
                <motion.div
                  className="absolute inset-0 bg-purple-800/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.span 
                    className="text-white text-2xl font-bold mb-4"
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {t('boutiqueSection.comingSoon')}
                  </motion.span>
                  <motion.p
                    className="text-white/90 mb-6"
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {t('boutiqueSection.exclusiveCollection')}
                  </motion.p>
                  <motion.button
                    className="bg-white text-purple-700 px-6 py-2 rounded-full font-medium hover:bg-purple-50"
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1, scale: 1.05 }}
                    transition={{ delay: 0.3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('boutiqueSection.notifyMe')}
                  </motion.button>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* Decorative elements */}
        <div className="relative mt-16">
          <motion.div
            className="absolute -top-20 -left-20 w-40 h-40 bg-purple-200 rounded-full opacity-20 blur-xl"
            animate={{ 
              x: [0, 20, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 w-60 h-60 bg-indigo-200 rounded-full opacity-20 blur-xl"
            animate={{ 
              x: [0, -30, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          
          <motion.div
            className="relative text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('boutiqueSection.viewMore')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BoutiqueSection; 
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, Shirt, Watch, Gift } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const BoutiqueSection = () => {
  const { t } = useLanguage();
  const [clickedItem, setClickedItem] = useState(null);

  const categories = [
    {
      id: 'clothing',
      name: t('boutiqueSection.categories.clothing'),
      icon: <Shirt className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-purple-500" />,
      description: t('boutiqueSection.categoryDescriptions.clothing'),
      image: '/ropaBoutique.png',
      color: 'from-purple-600 to-purple-400'
    },
    {
      id: 'accessories',
      name: t('boutiqueSection.categories.accessories'),
      icon: <Watch className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-pink-500" />,
      description: t('boutiqueSection.categoryDescriptions.accessories'),
      image: '/accesoriosBoutique.png',
      color: 'from-pink-600 to-pink-400'
    },
    {
      id: 'souvenirs',
      name: t('boutiqueSection.categories.souvenirs'),
      icon: <Gift className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-amber-500" />,
      description: t('boutiqueSection.categoryDescriptions.souvenirs'),
      image: '/souvenirBoutique.png',
      color: 'from-amber-600 to-amber-400'
    }
  ];

  const handleItemClick = (itemId) => {
    setClickedItem(itemId);
    setTimeout(() => setClickedItem(null), 2000);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4 sm:mb-6">
            <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mr-2 sm:mr-3" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{t('sections.boutique')}</h2>
          </div>
          <p className="mt-3 sm:mt-4 text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('boutiqueSection.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group h-52 sm:h-56 md:h-80"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleItemClick(category.id)}
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 filter blur-[0.8px]"
                />
                
                <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-10 transition-opacity duration-300 group-hover:opacity-20`}></div>
              
                <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-8">
                  <div className="flex items-center mb-3 sm:mb-4">
                    {category.icon}
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white ml-3 sm:ml-4 drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
                      {category.name}
                    </h3>
                  </div>
                  
                  <p className="text-sm sm:text-base text-white mb-4 sm:mb-6 max-w-2xl drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
                    {category.description}
                  </p>
                  
                  <div className="flex items-center text-white mt-auto bg-black/15 px-3 py-2 rounded-lg inline-flex">
                    <span className="text-sm sm:text-base font-medium drop-shadow-md" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{t('boutiqueSection.viewMore')}</span>
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

              <AnimatePresence>
                {clickedItem === category.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-purple-600/90 backdrop-blur-sm flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="text-center p-6"
                    >
                      <span className="text-white text-xl font-bold block mb-2">{t('boutiqueSection.comingSoon')}</span>
                      <span className="text-white/80 text-sm">{t('boutiqueSection.clickToSee')}</span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-10 sm:mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="inline-flex items-center bg-purple-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg text-base sm:text-lg font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/boutique'}
          >
            {t('boutiqueSection.viewCatalog')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default BoutiqueSection; 
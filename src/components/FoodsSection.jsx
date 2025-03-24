import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Flame, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FoodsSection = () => {
  const { t } = useLanguage();

  const foods = [
    {
      id: 1,
      name: 'Arepas Venezolanas',
      image: 'https://cdn.pixabay.com/photo/2016/05/08/15/02/arepa-1379236_1280.jpg',
      country: 'Venezuela',
      category: 'Plato Principal',
      spicyLevel: 1
    },
    {
      id: 2,
      name: 'Tacos al Pastor',
      image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80',
      country: 'México',
      category: 'Antojitos',
      spicyLevel: 3
    },
    {
      id: 3,
      name: 'Ceviche Peruano',
      image: 'https://cdn.pixabay.com/photo/2020/01/02/21/31/shrimp-4736867_1280.jpg',
      country: 'Perú',
      category: 'Entradas',
      spicyLevel: 2
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100 
      }
    }
  };

  const SpicyLevel = ({ level }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <Flame 
            key={index} 
            className={`h-4 w-4 ${index < level ? 'text-red-500' : 'text-gray-300'}`}
            fill={index < level ? 'currentColor' : 'none'}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <Utensils className="h-8 w-8 text-amber-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">{t('sections.foods')}</h2>
          </div>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            {t('foodSection.description')}
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {foods.map((food) => (
              <motion.div
                key={food.id}
                className="bg-white rounded-2xl overflow-hidden shadow-xl"
                variants={cardVariants}
                whileHover={{ y: -10 }}
              >
                <div className="relative h-72 overflow-hidden">
                  <motion.img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-amber-700">
                    {food.country}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-amber-600 font-semibold bg-amber-100 px-2 py-1 rounded-full">
                        {food.category}
                      </span>
                      <h3 className="mt-2 text-xl font-bold text-gray-900">{food.name}</h3>
                    </div>
                    <motion.div 
                      whileHover={{ rotate: 15 }}
                      className="text-2xl"
                    >
                      {food.id === 1 ? '🇻🇪' : food.id === 2 ? '🇲🇽' : '🇵🇪'}
                    </motion.div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{t('foodSection.spicyLevel')}:</p>
                      <SpicyLevel level={food.spicyLevel} />
                    </div>
                    <motion.button
                      className="bg-amber-100 hover:bg-amber-200 text-amber-700 p-3 rounded-full"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Overlay con mensaje de proximamente */}
                <div className="absolute inset-0 bg-amber-600/90 backdrop-blur-sm flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xl font-bold">{t('foodSection.comingSoon')}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Decoración */}
          <motion.div 
            className="absolute -top-12 -left-12 h-24 w-24 bg-amber-200 rounded-full opacity-20"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 180, 270, 360]
            }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -bottom-12 -right-12 h-32 w-32 bg-orange-200 rounded-full opacity-30"
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [360, 270, 180, 90, 0]
            }}
            transition={{ duration: 20, repeat: Infinity }}
          />
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="inline-flex items-center bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('foodSection.viewAll')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FoodsSection; 
import React, { useState } from 'react';
import { MapPin, ChevronRight, Globe2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const RegionsSection = () => {
  const { t } = useLanguage();
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const regions = [
    {
      key: 'northAmerica',
      image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&q=80",
      countries: ['México', 'Canadá', 'Estados Unidos'],
      iconColor: "text-blue-500"
    },
    {
      key: 'centralAmerica',
      image: "https://cdn.pixabay.com/photo/2019/07/29/14/14/old-town-panama-4370667_1280.jpg",
      countries: ['Guatemala', 'Costa Rica', 'Panamá', 'Honduras'],
      iconColor: "text-emerald-500"
    },
    {
      key: 'southAmerica',
      image: "https://images.unsplash.com/photo-1619546952812-520e98064a52?auto=format&fit=crop&q=80",
      countries: ['Brasil', 'Perú', 'Argentina', 'Chile', 'Colombia'],
      iconColor: "text-amber-500"
    }
  ];

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-indigo-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <motion.div 
        className="absolute -top-20 -left-20 w-60 sm:w-80 h-60 sm:h-80 bg-indigo-300 rounded-full mix-blend-multiply opacity-20 blur-3xl"
        animate={{ 
          x: [0, 20, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div 
        className="absolute -bottom-20 -right-20 w-60 sm:w-80 h-60 sm:h-80 bg-blue-300 rounded-full mix-blend-multiply opacity-20 blur-3xl"
        animate={{ 
          x: [0, -20, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.div 
            className="inline-flex items-center justify-center mb-4 sm:mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Globe2 className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600 mr-2 sm:mr-3" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{t('sections.regions')}</h2>
          </motion.div>
          <p className="mt-3 sm:mt-4 text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('regionSection.description')}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {regions.map((region, index) => (
            <motion.div
              key={region.key}
              className="relative group"
              variants={itemVariants}
              onHoverStart={() => setHoveredRegion(region.key)}
              onHoverEnd={() => setHoveredRegion(null)}
            >
              <div className="relative h-[350px] sm:h-[400px] lg:h-[450px] overflow-hidden rounded-2xl shadow-xl">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-10"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 0.85 }}
                  transition={{ duration: 0.3 }}
                />
                
                <motion.img
                  src={region.image}
                  alt={t(`regions.${region.key}.title`)}
                  className="h-full w-full object-cover"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 1 }}
                />
                
                <div className="absolute inset-0 z-20 p-6 sm:p-8 flex flex-col justify-end">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
                      {t(`regions.${region.key}.title`)}
                    </h3>
                    
                    <p className="text-sm sm:text-base text-gray-200 mb-4 sm:mb-6 line-clamp-2">
                      {t(`regions.${region.key}.description`)}
                    </p>
                    
                    <motion.div 
                      className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      {region.countries.map((country, idx) => (
                        <motion.span 
                          key={idx}
                          className="bg-white/10 backdrop-blur-sm text-white text-xs sm:text-sm uppercase tracking-wider font-medium px-3 py-1.5 rounded-full"
                          whileHover={{ 
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            scale: 1.05 
                          }}
                        >
                          {country}
                        </motion.span>
                      ))}
                    </motion.div>
                    
                    <motion.button 
                      className="flex items-center text-white hover:text-indigo-200 transition-colors gap-2 group"
                      whileHover={{ x: 5 }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <span className="font-medium text-sm sm:text-base">{t('hero.explore')}</span>
                      <motion.div
                        animate={{ 
                          x: hoveredRegion === region.key ? 5 : 0
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </motion.div>
                    </motion.button>
                  </motion.div>
                </div>
              </div>
              
              {/* Floating effect on hover */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl z-0 opacity-0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.5 }}
                transition={{ duration: 0.3 }}
                style={{ filter: 'blur(12px)' }}
              />
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{t('regionSection.exploreAll')}</span>
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default RegionsSection;
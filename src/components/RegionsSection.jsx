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
      image: "https://images.unsplash.com/photo-1589659072419-2fce34e35f04?auto=format&fit=crop&q=80",
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
    <section className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <motion.div 
        className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply opacity-20 blur-3xl"
        animate={{ 
          x: [0, 20, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div 
        className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply opacity-20 blur-3xl"
        animate={{ 
          x: [0, -20, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.div 
            className="inline-flex items-center justify-center mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Globe2 className="h-8 w-8 text-indigo-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">{t('sections.regions')}</h2>
          </motion.div>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            {t('regionSection.description')}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
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
              <div className="relative h-[450px] overflow-hidden rounded-2xl shadow-xl">
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
                
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-8">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    viewport={{ once: true }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      hoveredRegion === region.key ? 'bg-white' : 'bg-white/20'
                    }`}
                  >
                    <MapPin className={`h-6 w-6 ${region.iconColor}`} />
                  </motion.div>
                  
                  <div>
                    <motion.h3 
                      className="text-3xl font-bold text-white mb-3"
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {t(`regions.${region.key}.title`)}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-gray-200 mb-6"
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      {t(`regions.${region.key}.description`)}
                    </motion.p>
                    
                    <motion.div
                      className="flex flex-wrap gap-2 mb-6"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      {region.countries.map((country, idx) => (
                        <motion.span 
                          key={idx}
                          className="bg-white/10 backdrop-blur-sm text-white text-xs uppercase tracking-wider font-medium px-3 py-1 rounded-full"
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
                      className="flex items-center text-white hover:text-indigo-200 transition-colors gap-1 group"
                      whileHover={{ x: 5 }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <span className="font-medium">{t('hero.explore')}</span>
                      <motion.div
                        animate={{ 
                          x: hoveredRegion === region.key ? 5 : 0
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </motion.div>
                    </motion.button>
                  </div>
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
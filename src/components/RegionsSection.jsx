import React from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const RegionsSection = () => {
  const { t } = useLanguage();

  const regions = [
    {
      key: 'northAmerica',
      image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&q=80"
    },
    {
      key: 'centralAmerica',
      image: "https://images.unsplash.com/photo-1589659072419-2fce34e35f04?auto=format&fit=crop&q=80"
    },
    {
      key: 'southAmerica',
      image: "https://images.unsplash.com/photo-1619546952812-520e98064a52?auto=format&fit=crop&q=80"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900">{t('sections.regions')}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {regions.map((region, index) => (
            <motion.div
              key={region.key}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="relative h-96 overflow-hidden rounded-xl">
                <motion.img
                  src={region.image}
                  alt={t(`regions.${region.key}.title`)}
                  className="h-full w-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <motion.div 
                  className="absolute bottom-0 p-6"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {t(`regions.${region.key}.title`)}
                  </h3>
                  <p className="text-gray-200">
                    {t(`regions.${region.key}.description`)}
                  </p>
                  <motion.button 
                    className="mt-4 flex items-center text-white hover:text-indigo-200 transition-colors"
                    whileHover={{ x: 10 }}
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    {t('hero.explore')}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegionsSection;
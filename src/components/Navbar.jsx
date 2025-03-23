import React from 'react';
import { Globe2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { t } = useLanguage();

  return (
    <motion.nav 
      className="fixed w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Globe2 className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Tour de las Americas</span>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">{t('nav.home')}</a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">{t('nav.products')}</a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">{t('nav.foods')}</a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">{t('nav.boutique')}</a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">{t('nav.regions')}</a>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
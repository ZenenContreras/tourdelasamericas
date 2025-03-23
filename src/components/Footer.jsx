import React from 'react';
import { Globe2, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <Globe2 className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold">Tour de las Americas</span>
            </motion.div>
            <p className="mt-4 text-gray-400">{t('footer.about')}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('nav.home')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('nav.products')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('nav.regions')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('nav.about')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.categories')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('nav.foods')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('nav.boutique')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-2">
              <motion.li 
                className="flex items-center"
                whileHover={{ x: 10 }}
              >
                <Mail className="h-5 w-5 mr-2 text-indigo-400" />
                <a href="mailto:info@tourdelasamericas.com" className="text-gray-400 hover:text-white transition-colors">
                  info@tourdelasamericas.com
                </a>
              </motion.li>
              <motion.li 
                className="flex items-center"
                whileHover={{ x: 10 }}
              >
                <Phone className="h-5 w-5 mr-2 text-indigo-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </motion.li>
              <motion.li 
                className="flex items-center"
                whileHover={{ x: 10 }}
              >
                <MapPin className="h-5 w-5 mr-2 text-indigo-400" />
                <span className="text-gray-400">América</span>
              </motion.li>
            </ul>
          </div>
        </motion.div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 Tour de las Americas. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
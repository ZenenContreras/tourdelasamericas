import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe2 } from 'lucide-react';
import { motion } from 'framer-motion';

const LanguageSelector = ({ inverted = false, isMobile = false }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languageOptions = [
    { value: 'es', label: 'Español', flag: '🇪🇸' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' }
  ];

  const currentLanguage = languageOptions.find(option => option.value === language);
  
  // Variante más pequeña para dispositivos móviles
  if (isMobile) {
    return (
      <motion.div 
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.05 }}
      >
        <motion.button
          className={`flex items-center justify-center rounded-full w-8 h-8 ${
            inverted 
              ? 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20' 
              : 'bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100'
          } transition-all fast-transition animate-gpu`}
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.95 }}
          aria-label="Seleccionar idioma"
        >
          <Globe2 className="h-4 w-4" />
        </motion.button>

        {isOpen && (
          <motion.div 
            className="absolute mt-2 right-0 w-36 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-100"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            {languageOptions.map((option) => (
              <motion.button
                key={option.value}
                className={`w-full text-left px-3 py-2 flex items-center gap-2 text-sm ${
                  language === option.value ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => {
                  setLanguage(option.value);
                  setIsOpen(false);
                }}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{option.flag}</span>
                <span>{option.label}</span>
                {language === option.value && (
                  <motion.span 
                    className="ml-auto text-indigo-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.div>
    );
  }

  // Versión original para escritorio
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.button
        className={`flex items-center gap-2 px-3 py-2 rounded-full ${
          inverted 
            ? 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20' 
            : 'bg-white/10 backdrop-blur-sm border border-indigo-100 text-indigo-600 hover:bg-indigo-50'
        } transition-all shadow-sm swift-transition`}
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
      >
        <Globe2 className="h-4 w-4" />
        <span className="font-medium">{currentLanguage?.flag} {currentLanguage?.label}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▼
        </motion.span>
      </motion.button>

      {isOpen && (
        <motion.div 
          className="absolute mt-2 right-0 w-40 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-100"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {languageOptions.map((option) => (
            <motion.button
              key={option.value}
              className={`w-full text-left px-4 py-2 flex items-center gap-2 ${language === option.value ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={() => {
                setLanguage(option.value);
                setIsOpen(false);
              }}
              whileHover={{ x: 5 }}
            >
              <span>{option.flag}</span>
              <span>{option.label}</span>
              {language === option.value && (
                <motion.span 
                  className="ml-auto text-indigo-600"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 10 }}
                >
                  ✓
                </motion.span>
              )}
            </motion.button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default LanguageSelector;
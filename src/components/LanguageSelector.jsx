import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSelector = ({ inverted = false, isMobile = false, isTransparent = false, onLanguageChange = null }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const languageOptions = [
    { value: 'es', label: 'Español', flag: '🇪🇸' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' }
  ];

  const currentLanguage = languageOptions.find(option => option.value === language);
  
  // Manejar clics fuera del componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
  
  // Cambiar el idioma y notificar al componente padre si es necesario
  const handleLanguageChange = (langValue) => {
    setLanguage(langValue);
    setIsOpen(false);
    
    // Notificar al componente padre (útil para cerrar el menú móvil)
    if (onLanguageChange) {
      onLanguageChange();
    }
  };
  
  // Versión compacta para móvil pero con el mismo estilo que escritorio
  if (isMobile) {
    return (
      <motion.div 
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        ref={ref}
      >
        <motion.button
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/10 border border-indigo-100 text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm duration-200"
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.95 }}
          aria-label="Seleccionar idioma"
        >
          <span className="font-medium text-base">{currentLanguage?.flag}</span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-indigo-600 text-sm"
          >
            ▼
          </motion.span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="absolute mt-2 right-0 w-36 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-100"
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              {languageOptions.map((option) => (
                <motion.button
                  key={option.value}
                  className={`w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 text-base ${
                    language === option.value ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleLanguageChange(option.value)}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-lg">{option.flag}</span>
                  <span>{option.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Versión para escritorio
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      ref={ref}
    >
      <motion.button
        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 border border-indigo-100 text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm duration-200"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
      >
        <Globe2 className="h-5 w-5" />
        <span className="font-medium text-base">{currentLanguage?.flag} {currentLanguage?.label}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-indigo-600"
        >
          ▼
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute mt-2 right-0 w-44 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-100"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {languageOptions.map((option) => (
              <motion.button
                key={option.value}
                className={`w-full text-left px-4 py-2.5 flex items-center gap-2.5 text-base ${language === option.value ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => handleLanguageChange(option.value)}
                whileHover={{ x: 5 }}
              >
                <span className="text-lg">{option.flag}</span>
                <span>{option.label}</span>
                {language === option.value && (
                  <motion.span 
                    className="ml-auto text-indigo-600 text-lg"
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
      </AnimatePresence>
    </motion.div>
  );
};

export default LanguageSelector;
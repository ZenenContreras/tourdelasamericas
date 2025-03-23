import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Globe2, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Navbar = ({ scrollToRef, homeRef }) => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Verificar si estamos en la página de inicio para ajustar la transparencia
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  // Controlar la transparencia del navbar al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función mejorada para navegar y hacer scroll
  const handleNavClick = (path, ref) => {
    navigate(path);
    if (scrollToRef && ref) {
      scrollToRef(ref);
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { path: '/', name: t('nav.home'), ref: homeRef },
    { path: '/products', name: t('nav.products') },
    { path: '/foods', name: t('nav.foods') },
    { path: '/boutique', name: t('nav.boutique') },
    { path: '/regions', name: t('nav.regions') }
  ];

  const activeNavLinkClass = "text-indigo-600 font-medium";
  const normalNavLinkClass = "text-gray-700 hover:text-indigo-600 transition-colors duration-200";
  
  // Variantes para animación de entrada y salida (más rápidas)
  const mobileMenuVariants = {
    closed: { 
      opacity: 0,
      y: -10,
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1,
        duration: 0.2
      }
    },
    open: { 
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, y: -5 },
    open: { opacity: 1, y: 0 }
  };

  return (
    <motion.nav 
      className={`fixed w-full z-50 transition-all duration-200 ${
        isScrolled || !isHomePage || isMobileMenuOpen 
          ? "bg-white shadow-md" 
          : "bg-transparent"
      }`}
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <button 
              onClick={() => handleNavClick('/', homeRef)} 
              className="flex items-center"
              aria-label="Ir al inicio"
            >
              <Globe2 className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 ${isScrolled || !isHomePage ? 'text-indigo-600' : 'text-white'}`} />
              <span className={`ml-2 text-base sm:text-lg md:text-xl font-bold truncate ${isScrolled || !isHomePage ? 'text-gray-900' : 'text-white'}`}>
                Tour de las Americas
              </span>
            </button>
          </motion.div>
          
          {/* Navegación para escritorio */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {navLinks.map((link) => (
              <motion.button
                key={link.path}
                onClick={() => handleNavClick(link.path, link.ref)}
                className={
                  location.pathname === link.path 
                    ? activeNavLinkClass 
                    : `${normalNavLinkClass} ${!isScrolled && isHomePage ? 'text-white hover:text-indigo-100' : ''}`
                }
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {link.name}
              </motion.button>
            ))}
            <LanguageSelector inverted={!isScrolled && isHomePage} />
          </div>
          
          {/* Botón de menú móvil */}
          <div className="md:hidden flex items-center">
            <LanguageSelector inverted={!isScrolled && isHomePage} />
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
              className={`ml-2 p-2 rounded-md ${isScrolled || !isHomePage ? 'text-gray-700' : 'text-white'}`}
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-white shadow-xl"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
          >
            <div className="px-2 pt-1 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <motion.div key={link.path} variants={itemVariants}>
                  <button
                    className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                      location.pathname === link.path 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleNavClick(link.path, link.ref)}
                  >
                    {link.name}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
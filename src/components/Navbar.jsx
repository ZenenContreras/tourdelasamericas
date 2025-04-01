import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

/**
 * Componente de navegación principal
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.scrollToRef - Función para desplazamiento a referencias
 * @param {Object} props.homeRef - Referencia a la sección de inicio
 * @param {string} props.currentSection - Sección actual para resaltar en la navegación
 */
const Navbar = ({ scrollToRef, homeRef, currentSection = 'home' }) => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Verificar si estamos en la página de inicio para ajustar la transparencia
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  // Controlar la transparencia del navbar al hacer scroll
  useEffect(() => {
    const checkScroll = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollPosition > 50);
    };
    
    checkScroll();
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  // Detectar tipo de dispositivo
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width < 1024);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Evitar desplazamiento del fondo cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (id) => {
    setIsMobileMenuOpen(false);
    const newPath = id === 'home' ? '/' : `/${id}`;
    window.history.pushState({}, '', newPath);
    
    if (id === 'home') {
      if (homeRef && homeRef.current) {
        homeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    
    const targetElement = document.getElementById(id);
    if (targetElement) {
      setTimeout(() => {
        targetElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 10);
    }
  };

  const navLinks = [
    { id: 'home', label: t('nav.home') },
    { id: 'products', label: t('nav.products') },
    { id: 'foods', label: t('nav.foods') },
    { id: 'boutique', label: t('nav.boutique') }
  ];

  // Clases para los enlaces de navegación
  const activeNavLinkClass = "text-indigo-600 font-medium";
  const normalNavLinkClass = "text-gray-700 hover:text-indigo-600 transition-colors duration-200";
  
  // Animaciones del menú móvil
  const mobileMenuVariants = {
    closed: { 
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    open: { 
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const overlayVariants = {
    closed: { 
      opacity: 0,
      pointerEvents: "none",
      transition: { duration: 0.2 }
    },
    open: { 
      opacity: 0.5,
      pointerEvents: "auto",
      transition: { duration: 0.3 }
    }
  };

  const staggerChildrenVariants = {
    open: {
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    closed: { 
      opacity: 0, 
      x: -15,
      transition: { 
        duration: 0.2,
        ease: "easeInOut"
      } 
    },
    open: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      } 
    }
  };

  return (
    <>
      <motion.header 
        className="fixed w-full z-50 transition-all duration-300 bg-white shadow-md"
        initial={false}
        animate={{ y: 0 }}
        transition={{ duration: 0.2 }}
        role="banner"
      >
        <nav className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8" aria-label="Navegación principal">
          <div className="flex justify-between items-center h-14 sm:h-16 md:h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <button 
                onClick={() => handleNavClick('home')} 
                className="flex flex-row items-center"
                aria-label="Ir al inicio"
              >
                <img 
                  src="/america.png" 
                  alt="Logo Tour de las Americas" 
                  className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain" 
                  width="48"
                  height="48"
                />
                <div className="pl-1 sm:pl-2 flex flex-col items-center">
                  <span className="text-xs sm:text-sm md:text-base italic font-medium text-gray-600">
                    Origen
                  </span>
                  <span className="text-sm sm:text-base md:text-lg font-bold truncate text-gray-900">
                    America
                  </span>
                </div>
              </button>
            </motion.div>
            
            {/* Navegación de escritorio */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <ul className="flex space-x-3 lg:space-x-5">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => handleNavClick(link.id)}
                      className={`${currentSection === link.id ? activeNavLinkClass : normalNavLinkClass} px-2 py-1 font-medium rounded-md text-sm lg:text-base`}
                      aria-current={currentSection === link.id ? 'page' : undefined}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
              <LanguageSelector />
            </div>
            
            {/* Botón de menú móvil */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-indigo-600 transition-colors p-1"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>
      
      {/* Overlay para cuando el menú móvil está abierto */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black z-40"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Menú móvil */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed top-14 sm:top-16 left-0 right-0 bg-white z-40 overflow-hidden shadow-lg"
            id="mobile-menu"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <motion.nav 
              className="max-w-7xl mx-auto px-4 py-3"
              variants={staggerChildrenVariants}
              role="navigation"
              aria-label="Menú móvil"
            >
              <ul className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <motion.li key={link.id} variants={itemVariants}>
                    <button
                      onClick={() => handleNavClick(link.id)}
                      className={`${currentSection === link.id ? 'text-indigo-600 bg-indigo-50' : 'text-gray-800 hover:bg-gray-50'} block w-full text-left px-3 py-2 rounded-md font-medium transition-colors`}
                      aria-current={currentSection === link.id ? 'page' : undefined}
                    >
                      <span className="flex items-center">
                        {link.label}
                        {currentSection === link.id && (
                          <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
                        )}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>
              
              <div className="mt-4 border-t pt-4">
                <LanguageSelector isMobile={true} />
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
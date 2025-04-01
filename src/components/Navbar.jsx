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

  // Enlaces a redes sociales
  const socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com/touramericas', icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
      </svg>
    )},
    { name: 'Twitter', url: 'https://twitter.com/touramericas', icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
      </svg>
    )},
    { name: 'Instagram', url: 'https://instagram.com/touramericas', icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
      </svg>
    )}
  ];

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
                  className="h-9 w-9 sm:h-11 sm:w-11 md:h-13 md:w-13 object-contain" 
                  width="52"
                  height="52"
                />
                <div className="pl-1.5 sm:pl-2.5 flex flex-col items-center">
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg italic font-medium text-gray-600">
                    Origen
                  </span>
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold truncate text-gray-900">
                    America
                  </span>
                </div>
              </button>
            </motion.div>
            
            {/* Navegación de escritorio */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <ul className="flex space-x-4 lg:space-x-6">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => handleNavClick(link.id)}
                      className={`${currentSection === link.id ? activeNavLinkClass : normalNavLinkClass} px-2.5 py-1.5 font-medium rounded-md text-sm lg:text-base xl:text-lg`}
                      aria-current={currentSection === link.id ? 'page' : undefined}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
              <LanguageSelector />
            </div>
            
            {/* Botones móviles (Idioma + Menú) */}
            <div className="flex md:hidden items-center space-x-2">
              <LanguageSelector isMobile={true} />
              
              {/* Botón de menú móvil */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-indigo-600 transition-colors p-1.5"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {isMobileMenuOpen ? (
                  <X className="h-7 w-7" aria-hidden="true" />
                ) : (
                  <Menu className="h-7 w-7" aria-hidden="true" />
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
              className="max-w-7xl mx-auto px-4 py-4"
              variants={staggerChildrenVariants}
              role="navigation"
              aria-label="Menú móvil"
            >
              <ul className="flex flex-col space-y-1.5">
                {navLinks.map((link) => (
                  <motion.li key={link.id} variants={itemVariants}>
                    <button
                      onClick={() => handleNavClick(link.id)}
                      className={`${currentSection === link.id ? 'text-indigo-600 bg-indigo-50' : 'text-gray-800 hover:bg-gray-50'} block w-full text-left px-4 py-3 rounded-md font-medium transition-colors text-base`}
                      aria-current={currentSection === link.id ? 'page' : undefined}
                    >
                      <span className="flex items-center">
                        {link.label}
                        {currentSection === link.id && (
                          <ChevronRight className="ml-2 h-5 w-5" aria-hidden="true" />
                        )}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>
              
              {/* Descripción de la tienda y enlaces sociales */}
              <motion.div 
                className="mt-6 pt-4 border-t border-gray-100"
                variants={itemVariants}
              >
                <p className="px-3 py-2 text-base text-gray-600 mb-4">
                  {t('storeDescription')}
                </p>
                
                <div className="flex space-x-5 px-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.name}
                    >
                      {React.cloneElement(social.icon, { className: "h-7 w-7" })}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
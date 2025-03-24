import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Globe2, Menu, X, ChevronRight } from 'lucide-react';
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

  // Controlar la transparencia del navbar al hacer scroll - VERSIÓN CORREGIDA
  useEffect(() => {
    // Verificar scroll inicial inmediatamente
    const checkScroll = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollPosition > 50);
      console.log('Scroll position:', scrollPosition, 'isScrolled:', scrollPosition > 50);
    };
    
    // Verificar estado inicial
    checkScroll();
    
    // Añadir event listener con throttling para mejor rendimiento
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Limpiar event listener
    return () => window.removeEventListener('scroll', handleScroll);
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

  // Función mejorada para navegar y hacer scroll a las secciones
  const handleNavClick = (id) => {
    // Cerrar el menú móvil si está abierto
    setIsMobileMenuOpen(false);
    
    // Actualizar la URL sin usar router (para no causar recargas)
    const newPath = id === 'home' ? '/' : `/${id}`;
    window.history.pushState({}, '', newPath);
    
    // Para home, usar referencia si está disponible o ir al inicio
    if (id === 'home') {
      if (homeRef && homeRef.current) {
        homeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    
    // Para las demás secciones, usar scrollIntoView (con un pequeño retraso para asegurar que el DOM esté listo)
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
    { id: 'home', name: t('nav.home') },
    { id: 'products', name: t('nav.products') },
    { id: 'foods', name: t('nav.foods') },
    { id: 'boutique', name: t('nav.boutique') },
    { id: 'regions', name: t('nav.regions') }
  ];

  const activeNavLinkClass = "text-indigo-600 font-medium";
  const normalNavLinkClass = "text-gray-700 hover:text-indigo-600 transition-colors duration-200";
  
  // Variantes para animación de entrada y salida del menú móvil (más fluidas)
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

  // Fondo oscuro detrás del menú (overlay)
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

  // Optimización para animaciones en dispositivos móviles
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

  // Mejor transición para los elementos del menú
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

  // Determinar la ruta actual para resaltar el enlace activo
  const getActiveLink = () => {
    const path = location.pathname;
    if (path === '/' || path === '/home') return 'home';
    // Eliminar la barra inicial y cualquier parámetro después de la ruta
    return path.replace('/', '').split('?')[0].split('#')[0];
  };

  const activeLink = getActiveLink();

  // Determinar las clases del navbar basado en si estamos en inicio y si hemos hecho scroll
  const getNavbarClasses = () => {
    console.log('getNavbarClasses - isHomePage:', isHomePage, 'isScrolled:', isScrolled);
    
    // Si no estamos en la página de inicio, o estamos scrolleados, usar fondo blanco
    if (!isHomePage || isScrolled) {
      return "fixed w-full z-50 transition-all duration-300 bg-white shadow-md";
    }
    
    // Si estamos en la página de inicio y no hemos scrolleado, ser transparente
    return "fixed w-full z-50 transition-all duration-300 bg-transparent";
  };
  
  // Determinar si los textos deben ser blancos (en home sin scroll) o normales
  const isTransparentNav = isHomePage && !isScrolled;

  return (
    <>
      <motion.nav 
        className={getNavbarClasses()}
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-16">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <button 
                onClick={() => handleNavClick('home')} 
                className="flex items-center"
                aria-label="Ir al inicio"
              >
                <Globe2 className={`h-6 w-6 sm:h-6 sm:w-6 md:h-7 md:w-7 ${isTransparentNav ? 'text-white' : 'text-indigo-600'}`} />
                <span className={`ml-2 text-base sm:text-base md:text-lg font-bold truncate ${isTransparentNav ? 'text-white' : 'text-gray-900'}`}>
                  Tour de las Americas
                </span>
              </button>
            </motion.div>
            
            {/* Navegación para escritorio */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
              {navLinks.map((link) => (
                <motion.button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={activeLink === link.id 
                    ? isTransparentNav 
                      ? "text-white font-medium" 
                      : activeNavLinkClass 
                    : isTransparentNav 
                      ? "text-white/90 hover:text-white transition-colors duration-200"
                      : normalNavLinkClass}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {link.name}
                </motion.button>
              ))}
              <LanguageSelector isTransparent={isTransparentNav} />
            </div>
            
            {/* Botones móviles (idioma y menú) - Aumentados de tamaño */}
            <div className="md:hidden flex items-center space-x-3">
              <LanguageSelector 
                isMobile={true} 
                isTransparent={isTransparentNav}
                onLanguageChange={() => setIsMobileMenuOpen(false)}
              />
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-full w-10 h-10 flex items-center justify-center ${
                  isTransparentNav 
                    ? 'bg-white/20 text-white hover:bg-white/30' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors fast-transition`}
                aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Overlay de fondo para el menú móvil */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="fixed inset-0 bg-black z-40 md:hidden"
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Menú móvil mejorado y más grande para mejor accesibilidad */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="absolute top-16 left-0 right-0 bg-white shadow-xl overflow-hidden z-40 md:hidden"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
            >
              <motion.div 
                className="px-4 py-4 max-h-[calc(100vh-4rem)] overflow-auto"
                variants={staggerChildrenVariants}
              >
                {navLinks.map((link, index) => (
                  <motion.div 
                    key={link.id} 
                    variants={itemVariants}
                    custom={index}
                    className="mb-3" // Más espacio entre elementos
                  >
                    <button
                      className={`flex w-full items-center justify-between px-4 py-4 rounded-lg text-lg font-medium ${
                        activeLink === link.id
                          ? 'bg-indigo-50 text-indigo-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      } transition-colors fast-transition animate-gpu`}
                      onClick={() => handleNavClick(link.id)}
                    >
                      <span>{link.name}</span>
                      <ChevronRight className={`h-5 w-5 ${activeLink === link.id ? 'text-indigo-500' : 'text-gray-400'}`} />
                    </button>
                  </motion.div>
                ))}
                
                {/* Línea divisoria */}
                <motion.div 
                  className="h-px bg-gray-100 my-4"
                  variants={itemVariants}
                ></motion.div>
                
                {/* Información adicional - Texto más grande */}
                <motion.div 
                  className="px-4 py-4 text-base text-gray-500"
                  variants={itemVariants}
                >
                  <p className="mb-2">Descubre las Américas a través de productos auténticos y experiencias únicas.</p>
                  <div className="flex mt-4 space-x-5">
                    <a href="#" className="text-indigo-600 hover:text-indigo-800 transition-colors">
                      <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                      </svg>
                    </a>
                    <a href="#" className="text-indigo-600 hover:text-indigo-800 transition-colors">
                      <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                      </svg>
                    </a>
                    <a href="#" className="text-indigo-600 hover:text-indigo-800 transition-colors">
                      <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                      </svg>
                    </a>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;
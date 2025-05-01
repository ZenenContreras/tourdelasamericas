import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, ShoppingCart, User, Heart, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { useAuth } from '../contexts/AuthContext';
import { signInWithEmail, signUp, signInWithGoogle } from '../services/authService';
import { toast } from 'react-hot-toast';
import AuthModal from './AuthModal';

/**
 * Componente de navegación principal
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.scrollToRef - Función para desplazamiento a referencias
 * @param {Object} props.homeRef - Referencia a la sección de inicio
 * @param {string} props.currentSection - Sección actual para resaltar en la navegación
 * @param {Function} props.setCurrentSection - Función para actualizar la sección actual
 */
const Navbar = ({ scrollToRef, homeRef, currentSection = 'home', setCurrentSection }) => {
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [error, setError] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [registerValidation, setRegisterValidation] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Verificar si estamos en la página de inicio para ajustar la transparencia
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  // Actualizar la sección actual basada en la ruta
  useEffect(() => {
    const path = location.pathname;
    if (path === "/" || path === "/home") {
      setCurrentSection && setCurrentSection('home');
    } else if (path === "/productos") {
      setCurrentSection && setCurrentSection('products');
    } else if (path === "/comidas") {
      setCurrentSection && setCurrentSection('foods');
    } else if (path === "/boutique") {
      setCurrentSection && setCurrentSection('boutique');
    }
  }, [location.pathname, setCurrentSection]);

  // Verificar si el usuario está autenticado
  useEffect(() => {
    console.log('Estado del usuario:', user); // Para depuración
  }, [user]);

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
      // Usar un punto de corte más bajo para mostrar antes el menú de tablets
      setIsTablet(width >= 640 && width < 1024);
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

  // Función mejorada para manejar clics en la navegación
  const handleNavClick = useCallback((id) => {
    let targetPath = '/';
    
    switch (id) {
      case 'home':
        targetPath = '/';
        setCurrentSection && setCurrentSection('home');
        break;
      case 'products':
        targetPath = '/productos';
        setCurrentSection && setCurrentSection('products');
        break;
      case 'foods':
        targetPath = '/comidas';
        setCurrentSection && setCurrentSection('foods');
        break;
      case 'boutique':
        targetPath = '/boutique';
        setCurrentSection && setCurrentSection('boutique');
        break;
      default:
        targetPath = '/';
        setCurrentSection && setCurrentSection('home');
    }
    
    // Si ya estamos en la misma ruta, solo hacer scroll al inicio
    if (location.pathname === targetPath) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Navegar a la nueva ruta y después hacer scroll al inicio
      navigate(targetPath);
      // Después de la navegación, scroll al inicio
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'auto'
        });
      }, 100);
    }
    
    // Cerrar el menú móvil
    setIsMobileMenuOpen(false);
  }, [navigate, location.pathname, setCurrentSection]);

  const handleLogoClick = useCallback(() => {
    navigate('/');
    setCurrentSection && setCurrentSection('home');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setIsMobileMenuOpen(false);
  }, [navigate, setCurrentSection]);

  const navLinks = [
    { id: 'home', label: t('nav.home') },
    { id: 'products', label: t('nav.products') },
    { id: 'foods', label: t('nav.foods') },
    { id: 'boutique', label: t('nav.boutique') }
  ];

  // Clases mejoradas para los enlaces de navegación con transición más suave
  const activeNavLinkClass = "text-indigo-600 font-medium relative";
  const normalNavLinkClass = "text-gray-700 hover:text-indigo-600 transition-all duration-300 hover:bg-indigo-50 relative";
  
  // Crear un ID único para el layoutId de la animación de subrayado
  const underlineLayoutId = "nav-underline";
  
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

  const validateRegister = (formData) => {
    let valid = true;
    let errors = { nombre: '', email: '', password: '', confirmPassword: '' };
    // Nombre
    if (!formData.get('nombre') || formData.get('nombre').trim().length < 2) {
      errors.nombre = 'El nombre es obligatorio.';
      valid = false;
    }
    // Email
    if (!formData.get('email') || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.get('email'))) {
      errors.email = t('auth.errors.invalidEmail');
      valid = false;
    }
    // Password
    if (!formData.get('password') || formData.get('password').length < 6) {
      errors.password = t('auth.errors.invalidPassword');
      valid = false;
    }
    // Confirm Password
    if (authMode === 'register' && formData.get('password') !== formData.get('confirmPassword')) {
      errors.confirmPassword = t('auth.errors.passwordsDontMatch');
      valid = false;
    }
    setRegisterValidation(errors);
    return valid;
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      let result;
      if (authMode === 'login') {
        result = await signInWithEmail(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error(t('auth.errors.passwordsDontMatch'));
        }
        result = await signUp(formData.email, formData.password);
      }

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (authMode === 'register') {
        setSuccess(t('auth.register.success'));
        setAuthMode('login');
        setFormData({ email: '', password: '', confirmPassword: '' });
      } else {
        setIsAuthModalOpen(false);
        toast.success(t('auth.login.success'));
      }
    } catch (error) {
      console.error('Error en autenticación:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    setIsResending(true);
    setError(null);
    try {
      // Supabase envía automáticamente el correo, pero aquí podrías llamar a una función para reenviarlo si tienes endpoint
      // Por ahora solo mostramos feedback
      setTimeout(() => {
        setIsResending(false);
      }, 1500);
    } catch (err) {
      setError('Error al reenviar el correo.');
      setIsResending(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { data, error } = await signInWithGoogle();
      if (error) throw error;
      setIsLoginOpen(false);
      setIsRegisterOpen(false);
      setIsUserMenuOpen(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const getUserAvatar = (user) => {
    if (!user) return null;
    return user.user_metadata?.avatar_url || 
           user.user_metadata?.picture || 
           user.avatar_url || 
           null;
  };

  const handleProfileClick = () => {
    navigate('/perfil');
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleFavoritesClick = () => {
    navigate('/favoritos');
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleOrdersClick = () => {
    navigate('/pedidos');
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
      navigate('/');
      // Scroll al inicio
      window.scrollTo({ top: 0, behavior: 'auto' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const renderUserMenu = () => (
    <div className="relative">
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center space-x-1 lg:space-x-2 focus:outline-none"
      >
        <div className="h-7 w-7 lg:h-8 lg:w-8 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-2 border-indigo-200">
          {getUserAvatar(user) ? (
            <img 
              src={getUserAvatar(user)} 
              alt={user.email} 
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${user.email.charAt(0)}&background=818cf8&color=fff`;
              }}
            />
          ) : (
            <span className="text-indigo-600 font-medium text-xs lg:text-sm">
              {user.email.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <ChevronDown className={`h-3 w-3 lg:h-4 lg:w-4 text-gray-600 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isUserMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50"
          >
            <button
              onClick={handleProfileClick}
              className="flex items-center w-full px-4 py-2 text-xs lg:text-sm text-gray-700 hover:bg-gray-100"
            >
              <User className="h-3.5 w-3.5 lg:h-4 lg:w-4 mr-2" />
              {t('auth.userMenu.profile')}
            </button>
            <button
              onClick={handleOrdersClick}
              className="flex items-center w-full px-4 py-2 text-xs lg:text-sm text-gray-700 hover:bg-gray-100"
            >
              <ShoppingCart className="h-3.5 w-3.5 lg:h-4 lg:w-4 mr-2" />
              {t('auth.userMenu.orders')}
            </button>
            <button
              onClick={handleFavoritesClick}
              className="flex items-center w-full px-4 py-2 text-xs lg:text-sm text-gray-700 hover:bg-gray-100"
            >
              <Heart className="h-3.5 w-3.5 lg:h-4 lg:w-4 mr-2" />
              {t('auth.userMenu.favorites')}
            </button>
            <div className="border-t border-gray-100 my-1"></div>
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-xs lg:text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-3.5 w-3.5 lg:h-4 lg:w-4 mr-2" />
              {t('auth.userMenu.logout')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      <motion.header 
        className={'fixed w-full z-50 transition-all duration-300 bg-white shadow-md'}
        initial={false}
        animate={{ y: 0 }}
        transition={{ duration: 0.2 }}
        role="banner"
      >
        <nav className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 lg:px-6" aria-label="Navegación principal">
          <div className="flex justify-between items-center h-14 sm:h-16 md:h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center relative z-10 flex-shrink-0"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 15 
              }}
            >
              <button 
                onClick={handleLogoClick} 
                className="flex flex-row items-center group"
                aria-label="Ir al inicio"
              >
                <div className="relative">
                  <motion.img 
                    src="/LogoAunClic.svg" 
                    alt="Logo A un clic" 
                    className="h-[60px] w-[60px] xs:h-[60px] xs:w-[60px] sm:h-[65px] sm:w-[65px] md:h-[70px] md:w-[70px] filter drop-shadow-md" 
                    width="88"
                    height="88"
                    whileHover={{ 
                      rotate: [0, -5, 5, -5, 0],
                      transition: { duration: 0.5 }
                    }}
                  />
                </div>
                <div className="-ml-2 xs:-ml-3 flex flex-col flex-start mt-1">
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-lg xs:text-sm sm:text-base md:text-lg lg:text-xl tracking-tight leading-none">
                    A un clic la
                  </span>

                  <motion.div 
                    className="h-0.5 w-0 bg-gradient-to-r from-indigo-500 to-purple-500 mt-0.5 group-hover:w-full"
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </button>
            </motion.div>
            
            {/* Navegación de escritorio */}
            <div className="hidden sm:hidden md:flex items-center justify-end space-x-3 lg:space-x-6 xl:space-x-8 flex-grow ml-4">
              <ul className="flex space-x-2 lg:space-x-4 xl:space-x-6">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => handleNavClick(link.id)}
                      className={`${currentSection === link.id ? activeNavLinkClass : normalNavLinkClass} px-2 py-1.5 font-medium rounded-md text-sm lg:text-base xl:text-lg transition-all duration-300`}
                      aria-current={currentSection === link.id ? 'page' : undefined}
                    >
                      <span className="relative">
                        {link.label}
                        {currentSection === link.id && (
                          <motion.div 
                            className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                            layoutId={underlineLayoutId}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 500, 
                              damping: 30,
                              mass: 1
                            }}
                          />
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Botones de acción */}
              <div className="flex items-center space-x-2 lg:space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-1.5 lg:p-2 text-gray-700 hover:text-indigo-600 transition-colors"
                  aria-label="Carrito de compras"
                >
                  <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6" />
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    0
                  </span>
                </motion.button>

                {user && user.email ? (
                  renderUserMenu()
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 lg:px-4 lg:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    aria-label="Iniciar sesión"
                  >
                    <User className="h-5 w-5 lg:h-6 lg:w-6" />
                    <span className="text-xs lg:text-sm font-medium">{t('auth.login.submit')}</span>
                  </motion.button>
                )}

                <LanguageSelector />
              </div>
            </div>
            
            {/* Menú para tablets (640-1023px) - Versión simplificada */}
            <div className="hidden sm:flex md:hidden items-center justify-end space-x-2 flex-grow ml-1">
              <ul className="flex space-x-1">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => handleNavClick(link.id)}
                      className={`${currentSection === link.id ? 'text-indigo-600 font-medium' : 'text-gray-700 hover:text-indigo-600'} px-1 py-0.5 text-xs rounded-md transition-all duration-300`}
                      aria-current={currentSection === link.id ? 'page' : undefined}
                    >
                      <span className="relative whitespace-nowrap">
                        {link.label}
                        {currentSection === link.id && (
                          <motion.div 
                            className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                            layoutId="tablet-underline"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 500, 
                              damping: 30,
                              mass: 1
                            }}
                          />
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex items-center space-x-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-1 text-gray-700 hover:text-indigo-600 transition-colors"
                  aria-label="Carrito de compras"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[8px] rounded-full h-3.5 w-3.5 flex items-center justify-center">
                    0
                  </span>
                </motion.button>

                <LanguageSelector isMobile={true} />
              </div>
            </div>
            
            {/* Botones móviles */}
            <div className="flex sm:hidden items-center space-x-1.5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-1.5 text-gray-700 hover:text-indigo-600 transition-colors"
                aria-label="Carrito de compras"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                  0
                </span>
              </motion.button>

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
            className="fixed top-14 left-0 right-0 bg-white z-40 overflow-hidden shadow-lg"
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
                      className={`${currentSection === link.id ? 'text-indigo-600 bg-indigo-50 font-medium' : 'text-gray-800 hover:bg-gray-50'} block w-full text-left px-4 py-3 rounded-md transition-colors text-base`}
                      aria-current={currentSection === link.id ? 'page' : undefined}
                    >
                      <span className="flex items-center">
                        {link.label}
                        {currentSection === link.id && (
                          <ChevronRight className="ml-2 h-5 w-5 text-indigo-600" aria-hidden="true" />
                        )}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>
              
              {/* Sección de usuario móvil */}
              {user && user.email ? (
                <motion.div variants={itemVariants} className="mt-4 space-y-2">
                  <div className="px-4 py-3 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                        {getUserAvatar(user) ? (
                          <img 
                            src={getUserAvatar(user)} 
                            alt={user.email} 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=818cf8&color=fff`;
                            }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-indigo-200">
                            <span className="text-indigo-600 font-medium text-sm">
                              {user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.user_metadata?.nombre || user.email.split('@')[0]}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      navigate('/perfil');
                      setIsMobileMenuOpen(false);
                      // Scroll al inicio
                      window.scrollTo({ top: 0, behavior: 'auto' });
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <User className="h-5 w-5" />
                    <span>{t('auth.userMenu.profile')}</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/pedidos');
                      setIsMobileMenuOpen(false);
                      // Scroll al inicio
                      window.scrollTo({ top: 0, behavior: 'auto' });
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>{t('auth.userMenu.orders')}</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/favoritos');
                      setIsMobileMenuOpen(false);
                      // Scroll al inicio
                      window.scrollTo({ top: 0, behavior: 'auto' });
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <Heart className="h-5 w-5" />
                    <span>{t('auth.userMenu.favorites')}</span>
                  </button>

                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                      navigate('/');
                      // Scroll al inicio
                      window.scrollTo({ top: 0, behavior: 'auto' });
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>{t('auth.userMenu.logout')}</span>
                  </button>
                </motion.div>
              ) : (
                <motion.div variants={itemVariants} className="mt-4">
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span className="text-base font-medium">{t('auth.login.submit')}</span>
                  </button>
                </motion.div>
              )}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de autenticación */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Mensaje de confirmación de correo */}
      {showEmailConfirmation && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowEmailConfirmation(false)}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center border-2 border-indigo-200"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <img src="/america.png" alt="A un clic" className="mx-auto mb-2 h-12 w-12" />
            <h2 className="text-2xl font-bold text-indigo-700 mb-2">¡Bienvenido a A un clic!</h2>
            <p className="text-gray-700 mb-4">Gracias por registrarte. Para activar tu cuenta, revisa tu correo y haz clic en el enlace de confirmación.</p>
            <div className="mb-4">
              <span className="block text-lg font-semibold text-indigo-600">{confirmationEmail}</span>
              <span className="block text-gray-500 mt-2">¿No recibiste el correo? Puedes reenviarlo.</span>
            </div>
            <button
              onClick={handleResendConfirmation}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
              disabled={isResending}
            >
              {isResending ? 'Reenviando...' : 'Reenviar correo de confirmación'}
            </button>
            <div className="mt-6">
              <button
                onClick={() => setShowEmailConfirmation(false)}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Navbar;
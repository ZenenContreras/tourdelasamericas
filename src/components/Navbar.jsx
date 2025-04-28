import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, ShoppingCart, User, Heart, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { useAuth } from '../contexts/AuthContext';
import { signInWithEmail, signUp, signInWithGoogle } from '../services/authService';
import { toast } from 'react-hot-toast';

/**
 * Componente de navegación principal
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.scrollToRef - Función para desplazamiento a referencias
 * @param {Object} props.homeRef - Referencia a la sección de inicio
 * @param {string} props.currentSection - Sección actual para resaltar en la navegación
 */
const Navbar = ({ scrollToRef, homeRef, currentSection = 'home' }) => {
  const { t } = useLanguage();
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
    if (id === 'home') {
      if (location.pathname !== '/') {
        navigate('/', { replace: true });
        setTimeout(() => {
          if (homeRef && homeRef.current) {
            homeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 300);
      } else {
        if (homeRef && homeRef.current) {
          homeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
      return;
    }
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
      setTimeout(() => {
        const targetElement = document.getElementById(id);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 350);
    } else {
      const targetElement = document.getElementById(id);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 10);
      }
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
    if (user.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    } else if (user.user_metadata?.picture) {
      return user.user_metadata.picture;
    } else if (user.avatar_url) {
      return user.avatar_url;
    }
    return null;
  };

  const renderUserMenu = () => {
    if (!user) {
      return (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              {t('auth.login.title')}
            </button>
            <button
              onClick={() => {
                setIsAuthModalOpen(true);
                setAuthMode('register');
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              {t('auth.register.title')}
            </button>
            <div className="border-t border-gray-100"></div>
            <button
              onClick={() => scrollToRef(homeRef)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              {t('nav.home')}
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('products');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              {t('nav.products')}
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('foods');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              {t('nav.foods')}
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('boutique');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              {t('nav.boutique')}
            </button>
            <div className="border-t border-gray-100"></div>
            <button
              onClick={() => {
                const element = document.getElementById('about');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              {t('nav.about')}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
          <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
            {t('auth.userMenu.greeting', { name: user.email.split('@')[0] })}
          </div>
          <button
            onClick={() => window.location.href = '/perfil'}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            {t('auth.userMenu.profile')}
          </button>
          <button
            onClick={() => window.location.href = '/pedidos'}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            {t('auth.userMenu.orders')}
          </button>
          <button
            onClick={() => window.location.href = '/favoritos'}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            {t('auth.userMenu.favorites')}
          </button>
          <div className="border-t border-gray-100"></div>
          <button
            onClick={() => {
              signOut();
              setIsUserMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            role="menuitem"
          >
            {t('auth.userMenu.logout')}
          </button>
        </div>
      </div>
    );
  };

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
                  alt="Logo A un clic" 
                  className="h-9 w-9 sm:h-11 sm:w-11 md:h-13 md:w-13 object-contain" 
                  width="52"
                  height="52"
                />
                <div className="pl-1.5 sm:pl-2.5 flex flex-col items-center">
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold truncate text-gray-900">
                    Á un clic
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

              {/* Botones de acción */}
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors"
                  aria-label="Carrito de compras"
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    0
                  </span>
                </motion.button>

                {user && user.email ? (
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
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
                      <span className="text-sm font-medium">
                        {user.user_metadata?.nombre || user.email.split('@')[0]}
                      </span>
                    </button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm text-gray-500">Bienvenido</p>
                            <p className="text-sm font-medium text-gray-900">{user.email}</p>
                          </div>
                          
                          <button
                            onClick={() => {
                              navigate('/perfil');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center space-x-2"
                          >
                            <User className="h-4 w-4" />
                            <span>{t('auth.userMenu.profile')}</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              navigate('/pedidos');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center space-x-2"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span>{t('auth.userMenu.orders')}</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              navigate('/favoritos');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center space-x-2"
                          >
                            <Heart className="h-4 w-4" />
                            <span>{t('auth.userMenu.favorites')}</span>
                          </button>
                          
                          <div className="border-t border-gray-100 my-1"></div>
                          
                          <button
                            onClick={() => {
                              signOut();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>{t('auth.userMenu.logout')}</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    aria-label="Iniciar sesión"
                  >
                    <User className="h-6 w-6" />
                    <span className="text-sm font-medium">{t('auth.login.submit')}</span>
                  </motion.button>
                )}

                <LanguageSelector />
              </div>
            </div>
            
            {/* Botones móviles */}
            <div className="flex md:hidden items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors"
                aria-label="Carrito de compras"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
                      setIsLoginOpen(true);
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
      <AnimatePresence>
        {(isLoginOpen || isRegisterOpen) && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsLoginOpen(false);
              setIsRegisterOpen(false);
              setError(null);
            }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t(`auth.${authMode}.title`)}
                </h2>
                <p className="text-gray-600 mt-2">
                  {t(`auth.${authMode}.subtitle`)}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Tu nombre"
                      onChange={e => {
                        setRegisterValidation(v => ({ ...v, nombre: '' }));
                      }}
                    />
                    {registerValidation.nombre && <p className="text-xs text-red-500 mt-1">{registerValidation.nombre}</p>}
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t(`auth.${authMode}.email`)}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="tu@email.com"
                    onChange={e => {
                      setRegisterValidation(v => ({ ...v, email: '' }));
                    }}
                  />
                  {registerValidation.email && <p className="text-xs text-red-500 mt-1">{registerValidation.email}</p>}
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    {t(`auth.${authMode}.password`)}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                    onChange={e => {
                      setRegisterValidation(v => ({ ...v, password: '' }));
                    }}
                  />
                  {registerValidation.password && <p className="text-xs text-red-500 mt-1">{registerValidation.password}</p>}
                </div>
                {authMode === 'register' && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('auth.register.confirmPassword')}
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="••••••••"
                      onChange={e => {
                        setRegisterValidation(v => ({ ...v, confirmPassword: '' }));
                      }}
                    />
                    {registerValidation.confirmPassword && <p className="text-xs text-red-500 mt-1">{registerValidation.confirmPassword}</p>}
                  </div>
                )}
                {authMode === 'login' && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        {t('auth.login.rememberMe')}
                      </label>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      {t('auth.login.forgotPassword')}
                    </button>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg 
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                      >
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        />
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>
                        {authMode === 'login' 
                          ? t('auth.login.submitting') || 'Iniciando sesión...'
                          : t('auth.register.submitting') || 'Registrando...'}
                      </span>
                    </div>
                  ) : (
                    <span>
                      {authMode === 'login' 
                        ? t('auth.login.submit') || 'Iniciar sesión'
                        : t('auth.register.submit') || 'Registrarse'}
                    </span>
                  )}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      {t(`auth.${authMode}.orContinueWith`)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="mt-3 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <img 
                    src="/google-icon.svg" 
                    alt="Google" 
                    className="h-5 w-5 mr-2" 
                  />
                  {t('auth.login.orContinueWith')} Google
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {t(`auth.${authMode}.${authMode === 'login' ? 'noAccount' : 'haveAccount'}`)}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode(authMode === 'login' ? 'register' : 'login');
                      setError(null);
                    }}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    {t(`auth.${authMode}.${authMode === 'login' ? 'register' : 'login'}`)}
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
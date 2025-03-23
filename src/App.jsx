import React, { useEffect, useRef, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useLanguage } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ImageCarousel from './components/ImageCarousel';

// Carga perezosa para mejorar el rendimiento inicial
const ProductsSection = lazy(() => import('./components/ProductsSection'));
const FoodsSection = lazy(() => import('./components/FoodsSection'));
const BoutiqueSection = lazy(() => import('./components/BoutiqueSection'));
const RegionsSection = lazy(() => import('./components/RegionsSection'));

// Componente de carga mientras se cargan las secciones
const Loading = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

function App() {
  const { t } = useLanguage();
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200, // Aumentado para respuesta más rápida
    damping: 15,    // Reducido para menos "rebote"
    restDelta: 0.0005
  });

  // Referencias para cada sección
  const homeRef = useRef(null);
  const productsRef = useRef(null);
  const foodsRef = useRef(null);
  const boutiqueRef = useRef(null);
  const regionsRef = useRef(null);

  // Función para desplazamiento suave optimizado
  const scrollToRef = (ref) => {
    if (ref && ref.current) {
      const yOffset = -80; // Ajuste para el navbar
      const element = ref.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  // Manejar la navegación por rutas con transición más rápida
  useEffect(() => {
    // Función para desplazarse a la sección correspondiente según la ruta
    const scrollToSection = () => {
      let targetRef = null;

      switch (location.pathname) {
        case '/products':
          targetRef = productsRef;
          break;
        case '/foods':
          targetRef = foodsRef;
          break;
        case '/boutique':
          targetRef = boutiqueRef;
          break;
        case '/regions':
          targetRef = regionsRef;
          break;
        case '/':
        default:
          targetRef = homeRef;
          break;
      }

      if (targetRef && targetRef.current) {
        scrollToRef(targetRef);
      }
    };

    // Tiempo reducido para una respuesta más rápida
    const timer = setTimeout(scrollToSection, 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Observer para detectar secciones visibles y actualizar URL sin navegación
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const handleIntersect = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const path = id === 'home' ? '/' : `/${id}`;
          
          if (location.pathname !== path) {
            // Actualiza la URL sin causar navegación
            window.history.replaceState(null, '', path);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, options);

    // Observar todas las secciones
    if (homeRef.current) observer.observe(homeRef.current);
    if (productsRef.current) observer.observe(productsRef.current);
    if (foodsRef.current) observer.observe(foodsRef.current);
    if (boutiqueRef.current) observer.observe(boutiqueRef.current);
    if (regionsRef.current) observer.observe(regionsRef.current);

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Barra de progreso */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 z-50 origin-left"
        style={{ scaleX }}
      />
      
      <Navbar scrollToRef={scrollToRef} homeRef={homeRef} />
      
      {/* Sección de inicio */}
      <div ref={homeRef} id="home" className="relative h-screen w-full">
        <ImageCarousel />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <motion.div 
            className="flex flex-col justify-center h-full pt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }} // Más rápido
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-3xl">
              {t('hero.title')}
            </h1>
            <p className="mt-4 md:mt-6 text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl">
              {t('hero.subtitle')}
            </p>
            <div className="mt-6 md:mt-10 flex flex-wrap gap-4">
              <motion.button 
                className="bg-indigo-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center"
                whileHover={{ scale: 1.03 }} // Menos exagerado
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollToRef(productsRef)}
              >
                {t('hero.explore')}
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </motion.button>
              <motion.button 
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {t('hero.learnMore')}
              </motion.button>
            </div>
          </motion.div>
        </div>
        
        {/* Indicador de desplazamiento */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }} // Más rápido
        >
          <span className="text-sm uppercase tracking-widest mb-2">{t('scrollDown')}</span>
          <motion.div 
            className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2 cursor-pointer"
            animate={{ y: [0, 8, 0] }} // Menos movimiento
            transition={{ duration: 1.2, repeat: Infinity }} // Más rápido
            onClick={() => scrollToRef(productsRef)}
          >
            <motion.div className="w-1.5 h-1.5 bg-white rounded-full" />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Secciones con Suspense para carga lenta */}
      <Suspense fallback={<Loading />}>
        {/* Sección de productos */}
        <div ref={productsRef} id="products">
          <ProductsSection />
        </div>
        
        {/* Sección de comidas */}
        <div ref={foodsRef} id="foods">
          <FoodsSection />
        </div>
        
        {/* Sección de boutique */}
        <div ref={boutiqueRef} id="boutique">
          <BoutiqueSection />
        </div>
        
        {/* Sección de regiones */}
        <div ref={regionsRef} id="regions">
          <RegionsSection />
        </div>
      </Suspense>
      
      <Footer />
      
      {/* Rutas para mantener la navegación por URL */}
      <Routes location={location}>
        <Route path="/" element={<></>} />
        <Route path="/products" element={<></>} />
        <Route path="/foods" element={<></>} />
        <Route path="/boutique" element={<></>} />
        <Route path="/regions" element={<></>} />
      </Routes>
    </div>
  );
}

export default App;
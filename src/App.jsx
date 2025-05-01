import React, { useEffect, useRef, Suspense, lazy, useState, useCallback, memo } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useLanguage } from './contexts/LanguageContext';
import { useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SEO from './components/SEO';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

// Memoizado del componente de carga
const LoadingFallback = memo(() => (
  <div className="flex justify-center items-center py-20 h-[50vh]">
    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
  </div>
));

// Carga perezosa de componentes con preload solo de la página de inicio para carga rápida
const LandingPage = lazy(() => import('./pages/LandingPage'));

// Otras páginas con carga bajo demanda
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const FoodPage = lazy(() => import('./pages/FoodPage'));
const BoutiquePage = lazy(() => import('./pages/BoutiquePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));

// Componente para rutas protegidas optimizado
const ProtectedRoute = memo(({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
});

// Componente de error optimizado
const ErrorBoundary = memo(({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error) => {
      console.error('Error en la aplicación:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Algo salió mal</h1>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  return children;
});

// Precargar las páginas principales cuando el usuario está inactivo
const usePreloadPages = () => {
  useEffect(() => {
    // Función para precargar componentes importantes cuando el usuario esté inactivo
    const idleCallback = () => {
      const preloadComponents = async () => {
        try {
          // Precargar las páginas principales solo cuando el usuario esté inactivo
          await Promise.all([
            import('./pages/ProductsPage'),
            import('./pages/FoodPage')
          ]);
        } catch (err) {
          console.error('Error precargando componentes:', err);
        }
      };
      
      preloadComponents();
    };

    // Usar requestIdleCallback si está disponible, sino usar un timeout
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(idleCallback, { timeout: 2000 });
    } else {
      const timeoutId = setTimeout(idleCallback, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, []);
};

function App() {
  const { t } = useLanguage();
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const [currentSection, setCurrentSection] = useState('home');
  
  // Optimización: Remover el estado de isLoading para reducir renderizados iniciales
  // Usar los hooks de optimización
  usePreloadPages();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 15,
    restDelta: 0.0005
  });

  // Referencias para cada sección
  const homeRef = useRef(null);

  // Determinar la sección actual basada en la ruta
  useEffect(() => {
    const path = location.pathname;
    if (path === "/" || path === "/home") {
      setCurrentSection('home');
    } else if (path === "/productos") {
      setCurrentSection('products');
    } else if (path === "/comidas") {
      setCurrentSection('foods');
    } else if (path === "/boutique") {
      setCurrentSection('boutique');
    }
  }, [location.pathname]);

  // Memoizar la función de scroll
  const scrollToRef = useCallback((ref) => {
    if (ref && ref.current) {
      const yOffset = -80;
      const element = ref.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  }, []);

  // Memoizar la función para actualizar la sección actual
  const handleSectionChange = useCallback((section) => {
    setCurrentSection(section);
  }, []);

  // Memoizar la configuración de SEO
  const seoConfig = {
    home: {
      title: `${t('hero.origen')} ${t('hero.america')} | ${t('nav.home')}`,
      description: t('storeDescription'),
      ogImage: '/og-home.png'
    },
    products: {
      title: `${t('sections.products')} | ${t('hero.origen')} ${t('hero.america')}`,
      description: t('productSection.description'),
      ogImage: '/og-products.png'
    },
    foods: {
      title: `${t('sections.foods')} | ${t('hero.origen')} ${t('hero.america')}`,
      description: t('foodSection.description'),
      ogImage: '/og-foods.png'
    },
    boutique: {
      title: `${t('sections.boutique')} | ${t('hero.origen')} ${t('hero.america')}`,
      description: t('boutiqueSection.description'),
      ogImage: '/og-boutique.png'
    }
  };

  const currentSectionConfig = seoConfig[currentSection] || seoConfig.home;

  // Establecer dimensiones fijas para evitar Cumulative Layout Shift
  return (
    <ErrorBoundary>
      <CartProvider>
        <div className="min-h-screen bg-gray-50 relative">
          {/* Barra de progreso de scroll con dimensiones predefinidas */}
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 origin-left z-50"
            style={{ scaleX, height: '4px' }}
          />

          {/* SEO */}
          <SEO {...currentSectionConfig} />

          {/* Navbar - pasando la función setCurrentSection */}
          <Navbar
            scrollToRef={scrollToRef}
            homeRef={homeRef}
            currentSection={currentSection}
            setCurrentSection={handleSectionChange}
          />

          {/* Rutas con dimensiones predefinidas mínimas para evitar CLS */}
          <div className="min-h-[calc(100vh-80px)]">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <div ref={homeRef}>
                      <LandingPage />
                    </div>
                  }
                />
                <Route path="/productos" element={<ProductsPage />} />
                <Route path="/comidas" element={<FoodPage />} />
                <Route path="/boutique" element={<BoutiquePage />} />
                <Route
                  path="/perfil"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pedidos"
                  element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/carrito" element={<CartPage />} />
                <Route
                  path="/favoritos"
                  element={
                    <ProtectedRoute>
                      <FavoritesPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </div>

          {/* Footer */}
          <Footer />

          {/* Analytics - Carga asíncrona para no bloquear */}
          {typeof window !== 'undefined' && (
            <>
              <Analytics />
              <SpeedInsights />
            </>
          )}
        </div>
      </CartProvider>
    </ErrorBoundary>
  );
}

export default memo(App);
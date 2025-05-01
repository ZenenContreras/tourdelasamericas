import React, { useEffect, useRef, Suspense, lazy, useState, useCallback, memo } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useLanguage } from './contexts/LanguageContext';
import { useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ImageCarousel from './components/ImageCarousel';
import SEO from './components/SEO';
import LoadingScreen from './components/LoadingScreen';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

// Carga perezosa de componentes con prefetch
const ProductsSection = lazy(() => import(/* webpackPrefetch: true */ './components/ProductsSection'));
const FoodsSection = lazy(() => import(/* webpackPrefetch: true */ './components/FoodsSection'));
const BoutiqueSection = lazy(() => import(/* webpackPrefetch: true */ './components/BoutiqueSection'));
const ProductsPage = lazy(() => import(/* webpackPrefetch: true */ './pages/ProductsPage'));
const FoodPage = lazy(() => import(/* webpackPrefetch: true */ './pages/FoodPage'));
const BoutiquePage = lazy(() => import(/* webpackPrefetch: true */ './pages/BoutiquePage'));
const ProfilePage = lazy(() => import(/* webpackPrefetch: true */ './pages/ProfilePage'));
const OrdersPage = lazy(() => import(/* webpackPrefetch: true */ './pages/OrdersPage'));
const CartPage = lazy(() => import(/* webpackPrefetch: true */ './pages/CartPage'));
const FavoritesPage = lazy(() => import(/* webpackPrefetch: true */ './pages/FavoritesPage'));

// Componente de carga optimizado
const Loading = memo(() => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
));

// Componente para rutas protegidas optimizado
const ProtectedRoute = memo(({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
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

function App() {
  const { t } = useLanguage();
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const [currentSection, setCurrentSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 15,
    restDelta: 0.0005
  });

  // Referencias para cada sección
  const homeRef = useRef(null);
  const productsRef = useRef(null);
  const foodsRef = useRef(null);
  const boutiqueRef = useRef(null);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          {/* Barra de progreso de scroll */}
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 origin-left z-50"
            style={{ scaleX }}
          />

          {/* SEO */}
          <SEO {...currentSectionConfig} />

          {/* Navbar */}
          <Navbar
            scrollToRef={scrollToRef}
            homeRef={homeRef}
            currentSection={currentSection}
          />

          {/* Rutas */}
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <div ref={homeRef}>
                      <ImageCarousel />
                    </div>
                    <div ref={productsRef}>
                      <ProductsSection />
                    </div>
                    <div ref={foodsRef}>
                      <FoodsSection />
                    </div>
                    <div ref={boutiqueRef}>
                      <BoutiqueSection />
                    </div>
                  </>
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

          {/* Footer */}
          <Footer />

          {/* Analytics */}
          <Analytics />
          <SpeedInsights />
        </div>
      </CartProvider>
    </ErrorBoundary>
  );
}

export default memo(App);
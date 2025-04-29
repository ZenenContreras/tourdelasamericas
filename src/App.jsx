import React, { useEffect, useRef, Suspense, lazy, useState } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useLanguage } from './contexts/LanguageContext';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ImageCarousel from './components/ImageCarousel';
import SEO from './components/SEO';
import LoadingScreen from './components/LoadingScreen';
import { Analytics } from "@vercel/analytics/react"


// Carga perezosa de componentes
const ProductsSection = lazy(() => import('./components/ProductsSection'));
const FoodsSection = lazy(() => import('./components/FoodsSection'));
const BoutiqueSection = lazy(() => import('./components/BoutiqueSection'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));

// Componente de carga
const Loading = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

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

  const scrollToRef = (ref) => {
    if (ref && ref.current) {
      const yOffset = -80;
      const element = ref.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  // Configuración de SEO
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

  const HomePage = () => (
    <>
      <div 
        ref={homeRef} 
        id="home" 
        className="relative h-screen w-full section-container"
        style={{ scrollMarginTop: '80px' }}
      >
        <ImageCarousel />
      </div>
      
      <Suspense fallback={<Loading />}>
        <div 
          ref={productsRef} 
          id="products" 
          className="section-container"
          style={{ scrollMarginTop: '80px' }}
        >
          <ProductsSection />
        </div>
        
        <div 
          ref={foodsRef} 
          id="foods" 
          className="section-container"
          style={{ scrollMarginTop: '80px' }}
        >
          <FoodsSection />
        </div>
        
        <div 
          ref={boutiqueRef} 
          id="boutique" 
          className="section-container"
          style={{ scrollMarginTop: '80px' }}
        >
          <BoutiqueSection />
        </div>
      </Suspense>
    </>
  );

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <SEO 
        title={currentSectionConfig.title}
        description={currentSectionConfig.description}
        ogImage={currentSectionConfig.ogImage}
        section={currentSection}
      />
      
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 z-50 origin-left"
        style={{ scaleX }}
      />
      
      <Navbar scrollToRef={scrollToRef} homeRef={homeRef} currentSection={currentSection} />
      
      <main className="pt-16 sm:pt-20">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsSection />} />
            <Route path="/foods" element={<FoodsSection />} />
            <Route path="/boutique" element={<BoutiqueSection />} />
            
            {/* Rutas protegidas */}
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
            <Route 
              path="/carrito" 
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/favoritos" 
              element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta para manejar páginas no encontradas */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      
      <Footer />
      <Analytics />
    </div>
  );
}

export default App;
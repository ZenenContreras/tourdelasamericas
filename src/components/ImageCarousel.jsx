import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { ShoppingBag, Utensils, Store, ChevronDown } from 'lucide-react';
import AuthModal from './AuthModal';

// Componentes memoizados para evitar re-renders innecesarios
const CategoryCard = memo(({ icon: Icon, title, description, gradient }) => (
  <motion.div 
    className={`group relative bg-gradient-to-br ${gradient} p-4 sm:p-5 md:p-6 rounded-2xl flex items-center h-20 sm:h-24 md:h-28 border border-white/10 shadow-lg backdrop-blur-sm hover:backdrop-blur-md transition-all duration-300 overflow-hidden`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient.replace('/20', '/0')} group-hover:${gradient.replace('/20', '/10')} transition-all duration-300`} />
    <div className="relative z-10 flex items-center w-full">
      <div className="flex-shrink-0 mr-3">
        <Icon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white group-hover:scale-110 transition-transform duration-300" />
      </div>
      <div className="flex-grow">
        <h3 className="text-white font-semibold text-base sm:text-lg md:text-xl mb-0.5 drop-shadow-lg" 
            style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' }}>
          {title}
        </h3>
        <p className="text-white/90 text-xs sm:text-sm md:text-base drop-shadow-md line-clamp-2" 
           style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)' }}>
          {description}
        </p>
      </div>
    </div>
  </motion.div>
));

const MobileCategoryCard = memo(({ icon: Icon, title, gradient }) => (
  <motion.div 
    className={`group relative bg-gradient-to-br ${gradient} p-3 sm:p-4 rounded-xl flex flex-col items-center justify-center h-20 sm:h-24 border border-white/10 backdrop-blur-sm hover:backdrop-blur-md transition-all duration-300 overflow-hidden`}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient.replace('/20', '/0')} group-hover:${gradient.replace('/20', '/10')} transition-all duration-300`} />
    <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white mb-2 group-hover:scale-110 transition-transform duration-300" />
    <span className="text-white font-medium text-xs sm:text-sm text-center drop-shadow-lg relative z-10 px-1" 
          style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)' }}>
      {title}
    </span>
  </motion.div>
));

const ImageCarousel = () => {
  const { t } = useLanguage();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Memoizar la función de verificación de dispositivo
  const checkDevice = useCallback(() => {
    const width = window.innerWidth;
    setIsMobile(width < 768);
    setIsTablet(width >= 768 && width < 1024);
  }, []);

  useEffect(() => {
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, [checkDevice]);

  // Precargar imágenes
  useEffect(() => {
    // Establecer dimensiones inmediatamente para prevenir CLS
    setIsImageLoaded(false);
    
    const imagePaths = {
      mobile: "/fondoMobile2.png",
      tablet: "/fondoTablet.png",
      desktop: "/fondoEscritorio.png"
    };
    
    // Precarga todas las imágenes al iniciar
    Object.values(imagePaths).forEach(path => {
      const img = new Image();
      img.src = path;
      
      // Solo actualizar el estado cuando la imagen actual se carga
      if ((isMobile && path === imagePaths.mobile) || 
          (isTablet && path === imagePaths.tablet) || 
          (!isMobile && !isTablet && path === imagePaths.desktop)) {
        img.onload = () => setIsImageLoaded(true);
      }
    });
  }, [isMobile, isTablet]);

  // Memoizar las categorías
  const categories = [
    {
      icon: ShoppingBag,
      title: t('categories.products'),
      description: t('categories.productsDescription'),
      gradient: 'from-indigo-600/20 to-blue-600/20'
    },
    {
      icon: Utensils,
      title: t('categories.foods'),
      description: t('categories.foodsDescription'),
      gradient: 'from-amber-500/20 to-orange-500/20'
    },
    {
      icon: Store,
      title: t('categories.boutiqueSouvenirs'),
      description: t('categories.boutiqueDescription'),
      gradient: 'from-purple-500/20 to-pink-500/20'
    }
  ];

  // Dimensiones predefinidas para cada tipo de dispositivo
  const imageDimensions = {
    mobile: { width: 640, height: 960 },
    tablet: { width: 1024, height: 1366 },
    desktop: { width: 1920, height: 1080 }
  };

  // Determinar las dimensiones actuales
  const currentDimensions = isMobile 
    ? imageDimensions.mobile 
    : isTablet 
      ? imageDimensions.tablet 
      : imageDimensions.desktop;

  return (
    <div className="relative w-full h-screen min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px] max-h-[900px] overflow-hidden">
      <div className="relative h-full">
        {/* Contenedor con dimensiones fijas para evitar CLS */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50"
          style={{ 
            width: '100%',
            height: '100%',
            minHeight: 'inherit'
          }}
        >
          {/* Imagen de fondo con dimensiones predefinidas */}
          <picture className="block w-full h-full">
            <source media="(min-width: 1024px)" srcSet="/fondoEscritorio.png" />
            <source media="(min-width: 768px)" srcSet="/fondoTablet.png" />
            <source media="(max-width: 767px)" srcSet="/fondoMobile2.png" />
            <img
              src={isMobile ? "/fondoMobile2.png" : isTablet ? "/fondoTablet.png" : "/fondoEscritorio.png"}
              alt="Fondo de la página"
              className={`w-full h-full object-cover filter blur-[0.5px] transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              width={currentDimensions.width}
              height={currentDimensions.height}
              loading="eager"
              fetchpriority="high"
              style={{ 
                backgroundColor: '#f3f4f6',
                objectPosition: 'center'
              }}
            />
          </picture>
          
          {/* Gradiente superpuesto */}
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"
          />
        </div>
      
        {/* Contenido principal con mejor organización */}
        <div className="absolute inset-0 flex flex-col justify-center px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8 items-center">
              {/* Columna izquierda - Título y descripción */}
              <motion.div
                className="text-left"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Título con tipografía mejorada */}
                <motion.div
                  className="mb-3 sm:mb-4 md:mb-6 lg:mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <div className="flex flex-col items-start">
                      <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none tracking-tight mb-2" 
                          style={{ 
                            fontFamily: "'Playfair Display', serif",
                            textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                            background: 'linear-gradient(to right, #ffffff, #ffffff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}>
                        A un
                      </h1>
                      <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none tracking-tight relative" 
                          style={{ 
                            fontFamily: "'Playfair Display', serif",
                            textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                            background: 'linear-gradient(to right, #ffffff, #ffffff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}>
                        Clic la
                        <motion.div 
                          className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.8, delay: 0.9 }}
                        />
                      </h1>
                    </div>
                  </motion.div>
                </motion.div>
            
                {/* Descripción con mejor legibilidad */}
                <motion.p 
                  className="text-sm xs:text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl leading-relaxed mt-8 sm:mt-10 md:mt-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  style={{ 
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  {t('storeDescription')}
                </motion.p>
                
                {/* Botón de registro mejorado */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="mb-4 sm:mb-6 md:mb-0"
                >
                  <motion.button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 rounded-xl text-base sm:text-lg md:text-xl font-medium transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/30 flex items-center space-x-3 overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10">{t('hero.registerEarlyAccess')}</span>
                    <motion.div 
                      className="relative z-10"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ChevronDown className="h-5 w-5 transform rotate-90" />
                    </motion.div>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                  </motion.button>
                </motion.div>
              </motion.div>
              
              {/* Columna derecha - Categorías en tablet y desktop */}
              <motion.div
                className="hidden md:block"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="grid grid-cols-1 gap-4 sm:gap-5 max-w-md mx-auto">
                  {categories.map((category, index) => (
                    <CategoryCard key={index} {...category} />
                  ))}
                </div>
              </motion.div>
              
              {/* Categorías en móvil (3 columnas) */}
              <motion.div
                className="md:hidden w-full mt-6 sm:mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {categories.map((category, index) => (
                    <MobileCategoryCard key={index} icon={category.icon} title={category.title} gradient={category.gradient} />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ImageCarousel;
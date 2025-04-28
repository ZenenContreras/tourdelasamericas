import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { ShoppingBag, Utensils, Store, ChevronDown } from 'lucide-react';

const ImageCarousel = () => {
  const { t } = useLanguage();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  useEffect(() => {
    const imagePath = isMobile ? "/fondoMobile2.png" : isTablet ? "/fondoTablet.png" : "/fondoEscritorio.png";
    const img = new Image();
    img.src = imagePath;
    img.onload = () => setIsImageLoaded(true);
  }, [isMobile, isTablet]);

  return (
    <div className="relative w-full h-screen min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px] max-h-[900px] overflow-hidden">
      <div className="relative h-full">
        {/* Fondo de carga con animación suave */}
      <div 
          className={`absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 transition-opacity duration-700 ${isImageLoaded ? 'opacity-0' : 'opacity-100'}`} 
      />
      
        {/* Imagen de fondo con optimización */}
        <picture>
          <source media="(min-width: 1024px)" srcSet="/fondoEscritorio.png" />
          <source media="(min-width: 768px)" srcSet="/fondoTablet.png" />
          <source media="(max-width: 767px)" srcSet="/fondoMobile2.png" />
        <img
            src={isMobile ? "/fondoMobile2.png" : isTablet ? "/fondoTablet.png" : "/fondoEscritorio.png"}
            alt="Origen America"
            className="w-full h-full object-cover filter blur-[0.5px]"
            loading="eager"
            fetchpriority="high"
        />
      </picture>
      
        {/* Gradiente mejorado para mejor legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      
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
                  <span className="block mb-1 sm:mb-2 md:mb-3">
                    <span className="italic font-light text-white text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl drop-shadow-xl" 
                          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '2px', textShadow: '0 4px 12px rgba(0, 0, 0, 0.4)' }}>
                      {t('hero.origen')}
                    </span>
                  </span>
                  <span className="text-white block text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold drop-shadow-xl" 
                        style={{ textShadow: '0 4px 16px rgba(0, 0, 0, 0.5)' }}>
                    {t('hero.america')}
                  </span>
            </motion.div>
            
                {/* Descripción con mejor legibilidad */}
            <motion.p 
                  className="text-sm xs:text-base sm:text-lg md:text-xl text-white/90 mb-4 sm:mb-6 max-w-xl leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}
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
                    className="bg-indigo-600 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-xl text-sm sm:text-base md:text-lg font-medium hover:bg-indigo-500 transition-all duration-300 shadow-xl border border-indigo-400/30 hover:shadow-2xl hover:shadow-indigo-500/30"
                    whileHover={{ scale: 1.03, backgroundColor: "#4F46E5" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {t('hero.registerEarlyAccess')}
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
                <div className="grid grid-cols-1 gap-3 sm:gap-4 max-w-md mx-auto">
                  <motion.div 
                    className="bg-indigo-600/10 p-3 sm:p-4 md:p-6 rounded-2xl flex items-center h-20 sm:h-24 md:h-28 border border-white/10 shadow-lg group backdrop-blur-sm hover:bg-indigo-600/20 transition-all duration-300"
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(79, 70, 229, 0.15)" }}
                  >
                    <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white mr-2 sm:mr-3 md:mr-4 group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="text-white font-semibold text-base sm:text-lg md:text-xl drop-shadow-md" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' }}>
                        {t('categories.products')}
                      </h3>
                      <p className="text-white/90 text-xs sm:text-sm md:text-base drop-shadow-md" style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)' }}>{t('productSection.description')}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-amber-500/10 p-3 sm:p-4 md:p-6 rounded-2xl flex items-center h-20 sm:h-24 md:h-28 border border-white/10 shadow-lg group backdrop-blur-sm hover:bg-amber-500/20 transition-all duration-300"
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(245, 158, 11, 0.15)" }}
                  >
                    <Utensils className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white mr-2 sm:mr-3 md:mr-4 group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="text-white font-semibold text-base sm:text-lg md:text-xl drop-shadow-md" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' }}>
                        {t('categories.foods')}
                      </h3>
                      <p className="text-white/90 text-xs sm:text-sm md:text-base drop-shadow-md" style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)' }}>{t('foodSection.description')}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-purple-500/15 p-3 sm:p-4 md:p-6 rounded-2xl flex items-center h-20 sm:h-24 md:h-28 border border-white/10 shadow-lg group backdrop-blur-sm hover:bg-purple-500/25 transition-all duration-300"
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(168, 85, 247, 0.2)" }}
                  >
                    <Store className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white mr-2 sm:mr-3 md:mr-4 group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="text-white font-semibold text-base sm:text-lg md:text-xl drop-shadow-md" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' }}>
                        {t('categories.boutiqueSouvenirs')}
                      </h3>
                      <p className="text-white/90 text-xs sm:text-sm md:text-base drop-shadow-md" style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)' }}>{t('boutiqueSection.description')}</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Categorías versión móvil mejorada */}
              <motion.div 
                className="grid grid-cols-3 gap-2 sm:gap-3 w-full md:hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <motion.div 
                  className="bg-indigo-600/10 p-2 sm:p-3 rounded-xl flex flex-col items-center justify-center h-16 sm:h-20 border border-white/10 backdrop-blur-sm hover:bg-indigo-600/20 transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-white mb-1 sm:mb-2" />
                  <span className="text-white font-medium text-xs sm:text-sm text-center drop-shadow-md" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)' }}>
                    {t('categories.products')}
                  </span>
                </motion.div>
                
                <motion.div 
                  className="bg-amber-500/10 p-2 sm:p-3 rounded-xl flex flex-col items-center justify-center h-16 sm:h-20 border border-white/10 backdrop-blur-sm hover:bg-amber-500/20 transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Utensils className="h-5 w-5 sm:h-6 sm:w-6 text-white mb-1 sm:mb-2" />
                  <span className="text-white font-medium text-xs sm:text-sm text-center drop-shadow-md" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)' }}>
                    {t('categories.foods')}
                  </span>
                </motion.div>
            
            <motion.div
                  className="bg-purple-500/15 p-2 sm:p-3 rounded-xl flex flex-col items-center justify-center h-16 sm:h-20 border border-white/10 backdrop-blur-sm hover:bg-purple-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
            >
                  <Store className="h-5 w-5 sm:h-6 sm:w-6 text-white mb-1 sm:mb-2" />
                  <span className="text-white font-medium text-xs sm:text-sm text-center drop-shadow-md" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)' }}>
                    {t('categories.boutiqueSouvenirs')}
              </span>
            </motion.div>
          </motion.div>
      </div>
      </div>
    </div>
        
        {/* Indicador de desplazamiento mejorado */}
        <motion.div 
          className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 mx-auto flex flex-col items-center text-white w-full pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <span className="text-xs sm:text-sm uppercase tracking-widest mb-1 sm:mb-2 md:mb-3 font-light drop-shadow-md" style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)' }}>
            {t('scrollDown')}
          </span>
          <motion.div 
            className="w-4 h-6 sm:w-5 sm:h-8 md:w-6 md:h-10 border border-white/50 rounded-full flex justify-center pt-1 sm:pt-1.5 md:pt-2 mx-auto bg-black/5 shadow-lg pointer-events-auto cursor-pointer hover:bg-black/10 transition-colors"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            onClick={() => {
              const element = document.getElementById('products');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <motion.div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ImageCarousel;
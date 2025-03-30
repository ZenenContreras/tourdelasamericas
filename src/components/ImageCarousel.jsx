import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { ShoppingBag, Utensils, Store } from 'lucide-react';

const ImageCarousel = () => {
  const { t } = useLanguage();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Precargar la imagen para mejor experiencia de usuario
  useEffect(() => {
    const img = new Image();
    img.src = "/fondoProductos.png";
    img.onload = () => setIsImageLoaded(true);
  }, []);

  return (
    <div className="relative w-full h-full">
      <div className="relative h-full">
        {/* Fondo de carga */}
        <div 
          className={`absolute inset-0 bg-gray-800 transition-opacity duration-500 ${isImageLoaded ? 'opacity-0' : 'opacity-100'}`} 
        />
        
        {/* Imagen estática */}
        <img
          src="/fondoProductos.png"
          alt="Origen America"
          className="w-full h-full object-cover"
          loading="eager"
          fetchpriority="high"
        />
        
        {/* Gradiente sobre la imagen - más claro */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20" />
        
        {/* Contenido principal */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            className="w-full max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2 
              className="mb-3 sm:mb-5 lg:mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="block mb-0 sm:mb-1">
                <span className="italic font-light text-indigo-300 text-5xl sm:text-4xl md:text-5xl drop-shadow-lg">{t('hero.origen')}</span>
              </span>
              <span className="text-indigo-500 block text-6xl sm:text-6xl md:text-7xl lg:text-8xl font-bold drop-shadow-xl text-shadow-lg">{t('hero.america')}</span>
            </motion.h2>
            
            <motion.p 
              className="text-sm sm:text-base md:text-lg text-gray-200 mb-5 sm:mb-6 md:mb-8 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {t('storeDescription')}
            </motion.p>
            
            {/* Botón de registro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-6 sm:mb-8 md:mb-10"
            >
              <motion.button
                className="bg-indigo-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg text-base sm:text-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('hero.registerEarlyAccess')}
              </motion.button>
            </motion.div>
            
            {/* Categorías - Layout responsivo mejorado */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <motion.div 
                className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-xl flex flex-col items-center justify-center h-24 sm:h-28 md:h-32"
                whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.25)" }}
              >
                <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-indigo-300 mb-2" />
                <span className="text-white font-medium text-sm sm:text-base">{t('categories.products')}</span>
              </motion.div>
              
              <motion.div 
                className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-xl flex flex-col items-center justify-center h-24 sm:h-28 md:h-32"
                whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.25)" }}
              >
                <Utensils className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-amber-300 mb-2" />
                <span className="text-white font-medium text-sm sm:text-base">{t('categories.foods')}</span>
              </motion.div>
              
              <motion.div 
                className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-xl flex flex-col items-center justify-center h-24 sm:h-28 md:h-32"
                whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.25)" }}
              >
                <Store className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-purple-300 mb-2" />
                <span className="text-white font-medium text-sm sm:text-base">{t('categories.boutiqueSouvenirs')}</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Indicador de desplazamiento centrado y mejorado para móvil */}
        <motion.div 
          className="absolute bottom-5 sm:bottom-8 left-0 right-0 mx-auto flex flex-col items-center text-white w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.3 }}
        >
          <span className="text-xs sm:text-sm uppercase tracking-widest mb-1 sm:mb-2 font-light">{t('scrollDown')}</span>
          <motion.div 
            className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white rounded-full flex justify-center pt-2 cursor-pointer mx-auto"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
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
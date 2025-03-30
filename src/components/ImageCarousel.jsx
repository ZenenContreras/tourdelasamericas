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
    const imagePath = isMobile ? "/america1.png" : "/fondoProductos.png";
    const img = new Image();
    img.src = imagePath;
    img.onload = () => setIsImageLoaded(true);
  }, [isMobile]);

  return (
    <div className="relative w-full h-full">
      <div className="relative h-full">
        {/* Fondo de carga */}
        <div 
          className={`absolute inset-0 bg-indigo-50 transition-opacity duration-500 ${isImageLoaded ? 'opacity-0' : 'opacity-100'}`} 
        />
        
        {/* Imagen específica según el dispositivo - Implementación mejorada */}
        <picture>
          <source media="(min-width: 768px)" srcSet="/fondoProductos.png" />
          <source media="(max-width: 767px)" srcSet="/america1.png" />
          <img
            src={isMobile ? "/america1.png" : "/america.png"}
            alt="Origen America"
            className="w-full h-full object-cover"
            loading="eager"
            fetchpriority="high"
          />
        </picture>
        
        {/* Gradiente suave sobre la imagen */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/15 to-transparent" />
        
        {/* Contenido principal - Mejor proporcionado */}
        <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Columna izquierda - Título y descripción */}
              <motion.div
                className="text-left"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Título con mejor espaciado */}
                <motion.div 
                  className="mb-6 sm:mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  <span className="block mb-1 sm:mb-2">
                    <span className="italic font-light text-white text-4xl sm:text-5xl md:text-6xl drop-shadow-md" 
                          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '1px', textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }}>
                      {t('hero.origen')}
                    </span>
                  </span>
                  <span className="text-white block text-5xl sm:text-6xl md:text-7xl font-bold drop-shadow-xl" 
                        style={{ textShadow: '0 2px 15px rgba(0, 0, 0, 0.4)' }}>
                    {t('hero.america')}
                  </span>
                </motion.div>

                {/* Descripción - Mejor legibilidad */}
                <motion.p 
                  className="text-sm sm:text-base md:text-lg text-white mb-8 max-w-xl bg-black/10 backdrop-blur-sm py-3 px-4 rounded-lg border border-white/10 shadow-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}
                >
                  {t('storeDescription')}
                </motion.p>
                
                {/* Botón de registro */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mb-8 sm:mb-0"
                >
                  <motion.button
                    className="bg-indigo-600 text-white px-6 py-3 sm:px-8 sm:py-3.5 rounded-lg text-base sm:text-lg font-medium hover:bg-indigo-500 transition-colors shadow-lg border border-indigo-400/30"
                    whileHover={{ scale: 1.03, backgroundColor: "#4F46E5" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {t('hero.registerEarlyAccess')}
                  </motion.button>
                </motion.div>
              </motion.div>
              
              {/* Columna derecha - Categorías en desktop, ocultas en móvil */}
              <motion.div
                className="hidden md:block"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="grid grid-cols-1 gap-5 max-w-md mx-auto">
                  <motion.div 
                    className="bg-indigo-600/20 backdrop-blur-md p-5 rounded-xl flex items-center h-24 border border-white/20 shadow-lg group"
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(79, 70, 229, 0.25)" }}
                  >
                    <ShoppingBag className="h-8 w-8 text-white mr-4 group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="text-white font-semibold text-lg" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>
                        {t('categories.products')}
                      </h3>
                      <p className="text-white/80 text-sm">Productos auténticos de América</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-amber-500/20 backdrop-blur-md p-5 rounded-xl flex items-center h-24 border border-white/20 shadow-lg group"
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(245, 158, 11, 0.25)" }}
                  >
                    <Utensils className="h-8 w-8 text-white mr-4 group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="text-white font-semibold text-lg" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>
                        {t('categories.foods')}
                      </h3>
                      <p className="text-white/80 text-sm">Sabores regionales tradicionales</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-purple-500/20 backdrop-blur-md p-5 rounded-xl flex items-center h-24 border border-white/20 shadow-lg group"
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(168, 85, 247, 0.25)" }}
                  >
                    <Store className="h-8 w-8 text-white mr-4 group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="text-white font-semibold text-lg" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>
                        {t('categories.boutiqueSouvenirs')}
                      </h3>
                      <p className="text-white/80 text-sm">Artesanías y recuerdos únicos</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Categorías version móvil - Solo visible en móvil */}
              <motion.div 
                className="grid grid-cols-3 gap-3 w-full md:hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <motion.div 
                  className="bg-indigo-600/20 backdrop-blur-sm p-3 rounded-xl flex flex-col items-center justify-center h-20 border border-white/20"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ShoppingBag className="h-6 w-6 text-white mb-1" />
                  <span className="text-white font-medium text-xs text-center" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>
                    {t('categories.products')}
                  </span>
                </motion.div>
                
                <motion.div 
                  className="bg-amber-500/20 backdrop-blur-sm p-3 rounded-xl flex flex-col items-center justify-center h-20 border border-white/20"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Utensils className="h-6 w-6 text-white mb-1" />
                  <span className="text-white font-medium text-xs text-center" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>
                    {t('categories.foods')}
                  </span>
                </motion.div>
                
                <motion.div 
                  className="bg-purple-500/20 backdrop-blur-sm p-3 rounded-xl flex flex-col items-center justify-center h-20 border border-white/20"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Store className="h-6 w-6 text-white mb-1" />
                  <span className="text-white font-medium text-xs text-center" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>
                    {t('categories.boutiqueSouvenirs')}
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Indicador de desplazamiento - Mejor posicionado */}
        <motion.div 
          className="absolute bottom-8 left-0 right-0 mx-auto flex flex-col items-center text-white w-full pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <span className="text-xs uppercase tracking-widest mb-2 font-light bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 shadow-md">
            {t('scrollDown')}
          </span>
          <motion.div 
            className="w-6 h-10 border border-white/50 rounded-full flex justify-center pt-2 mx-auto bg-black/10 backdrop-blur-sm shadow-md pointer-events-auto cursor-pointer"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            onClick={() => {
              const element = document.getElementById('products');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <motion.div className="w-1.5 h-1.5 bg-white rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ImageCarousel;
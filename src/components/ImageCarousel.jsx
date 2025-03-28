import React, { memo, useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation, A11y } from 'swiper/modules';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Optimizadas para carga rápida - tamaños diferentes para dispositivos diferentes con mejor relación de aspecto
const images = [
  {
    url: {
      mobile: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=70&w=640&h=960",
      tablet: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=75&w=1024&h=1024",
      desktop: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1920&h=1080"
    },
    category: "products",
    tagline: "products",
    color: "indigo-600"
  },
  {
    url: {
      mobile: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=70&w=640&h=960",
      tablet: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=75&w=1024&h=1024",
      desktop: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=1920&h=1080"
    },
    category: "food",
    tagline: "food",
    color: "amber-600"
  },
  {
    url: {
      mobile: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=70&w=640&h=960",
      tablet: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=75&w=1024&h=1024",
      desktop: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1920&h=1080"
    },
    category: "boutique",
    tagline: "boutique",
    color: "purple-600"
  }
];

// Componente de diapositiva optimizado con memo para evitar rerenderizaciones innecesarias
const CarouselSlide = memo(({ image, t, isActive }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Cargar imagen en segundo plano antes de mostrarla
  useEffect(() => {
    const img = new Image();
    img.src = image.url.mobile;
    img.onload = () => setIsImageLoaded(true);
  }, [image.url.mobile]);

  return (
    <div ref={ref} className="relative h-full">
      {/* Div con color de fondo mientras carga la imagen */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b from-gray-900 to-black transition-opacity duration-300 ${isImageLoaded ? 'opacity-0' : 'opacity-100'}`} 
      />
      
      {/* Imagen principal con picture para responsividad */}
      <picture className="h-full">
        <source media="(min-width: 1024px)" srcSet={image.url.desktop} />
        <source media="(min-width: 640px)" srcSet={image.url.tablet} />
        <img
          src={image.url.mobile}
          alt={t(`categoryLabels.${image.category}`)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading={isActive ? "eager" : "lazy"}
          fetchpriority={isActive ? "high" : "low"}
          onLoad={() => setIsImageLoaded(true)}
        />
      </picture>
      
      {/* Gradiente sobre la imagen - más oscuro en móviles para mejor legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30" />
      
      {/* Contenido y texto del carrusel - optimizado para productos */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
        {inView && (
          <motion.div
            className="w-full max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="mb-3 sm:mb-4 md:mb-6 inline-block"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <div className="backdrop-blur-sm text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl inline-block shadow-lg shadow-indigo-600/20">
                <span className="text-base sm:text-lg md:text-xl uppercase tracking-wider font-bold">
                  {t('comingSoon')}
                </span>
              </div>
            </motion.div>
            
            <motion.h2 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-4 sm:mb-6 md:mb-8 leading-tight"
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.4 }
              }}
            >
              <span className={`text-${image.color} block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight'}`}>
                Amériques
              </span>
              <span className="block mt-3 sm:mt-4 md:mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white/90 font-extrabold">
                {t(`categoryLabels.${image.category}`)}
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {t('storeDescription')}
            </motion.p>
            
            <motion.div
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center items-center"
            >
              <button className={`group relative inline-flex items-center justify-center bg-${image.color} text-white px-8 py-4 sm:px-10 sm:py-5 rounded-xl text-lg sm:text-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-${image.color}/30 overflow-hidden`}>
                <span className="relative z-10">{t('storeComingSoon')}</span>
                <div className={`absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
      
      {/* Categoría del producto - más visible en móvil */}
      <div className={`absolute bottom-20 sm:bottom-16 right-4 sm:right-8 text-white text-base sm:text-lg md:text-xl font-bold bg-${image.color} backdrop-blur-sm px-4 py-2 sm:px-6 sm:py-3 rounded-xl shadow-lg shadow-${image.color}/20`}>
        {t(`categoryLabels.${image.category}`)}
      </div>
    </div>
  );
});

const ImageCarousel = () => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [isBeginning, setIsBeginning] = useState(true);
  const swiperRef = useRef(null);

  // Detectar si es dispositivo táctil
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  return (
    <div className="relative w-full h-full">
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, EffectFade, Pagination, Navigation, A11y]}
        effect="fade"
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          renderBullet: function (index, className) {
            return `<span class="${className} w-3 h-3 sm:w-4 sm:h-4" aria-label="Ir a la diapositiva ${index + 1}"></span>`;
          },
        }}
        loop={true}
        speed={800}
        watchSlidesProgress={true}
        className="absolute inset-0"
        a11y={{
          prevSlideMessage: 'Diapositiva anterior',
          nextSlideMessage: 'Siguiente diapositiva',
          firstSlideMessage: 'Esta es la primera diapositiva',
          lastSlideMessage: 'Esta es la última diapositiva',
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <CarouselSlide 
              image={image} 
              t={t} 
              isActive={index === activeIndex} 
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Controles de navegación personalizados - solo visibles en escritorio (no táctil y no móvil) */}
      {!isTouchDevice && window.innerWidth > 768 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-4 top-1/2 z-10 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 sm:p-2 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 hidden md:block"
            aria-label="Diapositiva anterior"
          >
            <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 z-10 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 sm:p-2 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 hidden md:block"
            aria-label="Siguiente diapositiva"
          >
            <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>
        </>
      )}

      {/* Indicador de progreso mejorado para móviles */}
      <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center">
        <div className="swiper-pagination"></div>
      </div>
    </div>
  );
};

export default memo(ImageCarousel);
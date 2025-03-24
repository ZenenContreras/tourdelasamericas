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
      mobile: "https://images.unsplash.com/photo-1489914099268-1dad649f76bf?auto=format&fit=crop&q=70&w=640&h=960",
      tablet: "https://images.unsplash.com/photo-1489914099268-1dad649f76bf?auto=format&fit=crop&q=75&w=1024&h=1024",
      desktop: "https://images.unsplash.com/photo-1489914099268-1dad649f76bf?auto=format&fit=crop&q=80&w=1920&h=1080"
    },
    location: "Machu Picchu, Perú",
    tagline: "storeTagline.peru",
    color: "indigo-400"
  },
  {
    url: {
      mobile: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&q=70&w=640&h=960",
      tablet: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&q=75&w=1024&h=1024",
      desktop: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&q=80&w=1920&h=1080"
    },
    location: "Ciudad de México, México",
    tagline: "storeTagline.mexico",
    color: "amber-400"
  },
  {
    url: {
      mobile: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=70&w=640&h=960",
      tablet: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=75&w=1024&h=1024",
      desktop: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=1920&h=1080"
    },
    location: "Rio de Janeiro, Brasil",
    tagline: "storeTagline.brazil",
    color: "green-400"
  },
  {
    url: {
      mobile: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&q=70&w=640&h=960",
      tablet: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&q=75&w=1024&h=1024",
      desktop: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&q=80&w=1920&h=1080"
    },
    location: "Parque Nacional Torres del Paine, Chile",
    tagline: "storeTagline.chile",
    color: "blue-400"
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
    img.onload = () => {
      setIsImageLoaded(true);
    };
  }, [image.url.mobile]);

  // Animación para texto más fluida
  const textAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2 }
  };

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
          alt={image.location}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading={isActive ? "eager" : "lazy"}
          fetchpriority={isActive ? "high" : "low"}
          onLoad={() => setIsImageLoaded(true)}
        />
      </picture>
      
      {/* Gradiente sobre la imagen - más oscuro en móviles para mejor legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/40" />
      
      {/* Contenido y texto del carrusel - optimizado para móviles */}
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
              <div className="bg-indigo-600/90 backdrop-blur-sm text-white px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-lg inline-block">
                <span className="text-sm sm:text-base uppercase tracking-wider font-semibold">{t('comingSoon')}</span>
              </div>
            </motion.div>
            
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight"
              variants={textAnimation}
            >
              <span className="text-indigo-400 block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">Tour de las Americas</span>
              <span className="block mt-2 sm:mt-3 md:mt-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">{t(image.tagline)}</span>
            </motion.h2>
            
            <motion.p 
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed"
              variants={{
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              {t('storeDescription')}
            </motion.p>
            
            <motion.div
              variants={{
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              <span className="inline-block animate-pulse bg-white/20 backdrop-blur-sm text-white px-4 py-2 sm:px-5 sm:py-3 rounded-lg text-sm sm:text-base font-medium">
                {t('storeComingSoon')}
              </span>
            </motion.div>
          </motion.div>
        )}
      </div>
      
      {/* Ubicación de la imagen - más visible en móvil */}
      <div className="absolute bottom-20 sm:bottom-16 right-4 sm:right-8 text-white text-sm sm:text-base md:text-xl font-medium bg-black/60 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-2 rounded-lg">
        {image.location}
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
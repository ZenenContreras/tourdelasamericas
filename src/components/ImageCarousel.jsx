import React, { memo, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

// Optimizadas para carga rápida - tamaños diferentes para dispositivos diferentes
const images = [
  {
    url: {
      mobile: "https://images.unsplash.com/photo-1489914099268-1dad649f76bf?auto=format&fit=crop&q=60&w=400",
      tablet: "https://images.unsplash.com/photo-1489914099268-1dad649f76bf?auto=format&fit=crop&q=70&w=800",
      desktop: "https://images.unsplash.com/photo-1489914099268-1dad649f76bf?auto=format&fit=crop&q=70&w=1920"
    },
    location: "Machu Picchu, Perú",
    tagline: "storeTagline.peru"
  },
  {
    url: {
      mobile: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&q=60&w=400",
      tablet: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&q=70&w=800",
      desktop: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&q=70&w=1920"
    },
    location: "Ciudad de México, México",
    tagline: "storeTagline.mexico"
  },
  {
    url: {
      mobile: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=60&w=400",
      tablet: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=70&w=800",
      desktop: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=70&w=1920"
    },
    location: "Rio de Janeiro, Brasil",
    tagline: "storeTagline.brazil"
  },
  {
    url: {
      mobile: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&q=60&w=400",
      tablet: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&q=70&w=800",
      desktop: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&q=70&w=1920"
    },
    location: "Parque Nacional Torres del Paine, Chile",
    tagline: "storeTagline.chile"
  }
];

// Componente de diapositiva optimizado con memo para evitar rerenderizaciones innecesarias
const CarouselSlide = memo(({ image, t, isActive }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  // Función para obtener la URL correcta según el tamaño de pantalla
  const getResponsiveImage = () => {
    if (window.innerWidth < 640) {
      return image.url.mobile;
    } else if (window.innerWidth < 1024) {
      return image.url.tablet;
    }
    return image.url.desktop;
  };

  // Animación para texto más fluida
  const textAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2 }
  };

  return (
    <div ref={ref} className="relative h-full">
      <picture>
        <source media="(min-width: 1024px)" srcSet={image.url.desktop} />
        <source media="(min-width: 640px)" srcSet={image.url.tablet} />
        <img
          src={image.url.mobile}
          alt={image.location}
          className="w-full h-full object-cover"
          loading="lazy"
          fetchpriority={isActive ? "high" : "low"}
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      
      {/* Texto llamativo de la tienda */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
        {inView && (
          <motion.div
            className="w-full max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="mb-3 sm:mb-6 inline-block"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <div className="bg-indigo-600/90 backdrop-blur-sm text-white px-3 py-1 sm:px-6 sm:py-2 rounded-lg inline-block">
                <span className="text-xs sm:text-sm uppercase tracking-wider font-semibold">Próximamente</span>
              </div>
            </motion.div>
            
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-4 leading-tight"
              variants={textAnimation}
            >
              <span className="text-indigo-400">Tour de las Americas</span>
              <br />
              <span>{t(image.tagline)}</span>
            </motion.h2>
            
            <motion.p 
              className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-4 sm:mb-8 max-w-2xl mx-auto"
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
              <span className="inline-block animate-pulse bg-white/20 backdrop-blur-sm text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base font-medium">
                {t('storeComingSoon')}
              </span>
            </motion.div>
          </motion.div>
        )}
      </div>
      
      {/* Ubicación de la imagen */}
      <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 text-white text-sm sm:text-base md:text-xl font-light bg-black/30 backdrop-blur-sm px-2 py-1 sm:px-4 sm:py-2 rounded-lg">
        {image.location}
      </div>
    </div>
  );
});

const ImageCarousel = () => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <Swiper
      modules={[Autoplay, EffectFade, Pagination]}
      effect="fade"
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      loop={true}
      speed={600} // Transición más rápida pero no demasiado
      watchSlidesProgress={true}
      className="absolute inset-0"
      onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
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
  );
};

export default memo(ImageCarousel);
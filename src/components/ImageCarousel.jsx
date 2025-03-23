import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

const images = [
  {
    url: "https://images.unsplash.com/photo-1489914099268-1dad649f76bf?auto=format&fit=crop&q=80",
    location: "Machu Picchu, Perú"
  },
  {
    url: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&q=80",
    location: "Ciudad de México, México"
  },
  {
    url: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80",
    location: "Rio de Janeiro, Brasil"
  },
  {
    url: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&q=80",
    location: "Parque Nacional Torres del Paine, Chile"
  }
];

const ImageCarousel = () => {
  return (
    <Swiper
      modules={[Autoplay, EffectFade]}
      effect="fade"
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      loop={true}
      className="absolute inset-0"
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <div className="relative h-full">
            <img
              src={image.url}
              alt={image.location}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute bottom-8 right-8 text-white text-xl font-light">
              {image.location}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageCarousel;
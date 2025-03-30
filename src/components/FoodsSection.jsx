import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, ArrowRight, Globe2, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FoodsSection = () => {
  const { t } = useLanguage();

  // Regiones gastronómicas de América
  const regions = [
    {
      id: 'norte-america',
      name: 'Norte América',
      icon: <MapPin className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-red-500" />,
      description: 'Descubre los sabores de Estados Unidos, Canadá y México, desde hamburguesas y pizza hasta tacos y poutine',
      image: '/norteamerica.jpg',
      color: 'from-red-600 to-red-400',
      countries: ['Estados Unidos', 'Canadá', 'México']
    },
    {
      id: 'centro-america',
      name: 'Centro América',
      icon: <MapPin className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-green-500" />,
      description: 'Explora la gastronomía colorida de Guatemala, Costa Rica, Panamá, Honduras y más países centroamericanos',
      image: '/centroamerica.jpg',
      color: 'from-green-600 to-green-400',
      countries: ['Guatemala', 'Costa Rica', 'Panamá', 'Honduras']
    },
    {
      id: 'sur-america',
      name: 'Sur América',
      icon: <MapPin className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-yellow-500" />,
      description: 'Disfruta de los platos típicos de Argentina, Brasil, Perú, Colombia y otros países sudamericanos',
      image: '/sudamerica.jpg',
      color: 'from-yellow-600 to-yellow-400',
      countries: ['Argentina', 'Brasil', 'Perú', 'Colombia', 'Chile']
    }
  ];

  // Animación para entrada escalonada de elementos
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  // Animación para cada región
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-10 sm:py-16 md:py-20 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4 sm:mb-6">
            <Utensils className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600 mr-2 sm:mr-3" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{t('sections.foods')}</h2>
          </div>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explora nuestra colección de platos auténticos y sabores tradicionales de las diversas regiones de América.
          </p>
        </motion.div>

        {/* Regiones gastronómicas */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {regions.map((region) => (
            <motion.div
              key={region.id}
              className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group h-64 sm:h-72 md:h-80"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = `/gastronomia/${region.id}`}
            >
              {/* Fondo de la región con imagen y overlay */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img 
                  src={region.image} 
                  alt={region.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Gradiente para mejor legibilidad - opacidad reducida */}
                <div className={`absolute inset-0 bg-gradient-to-r ${region.color} opacity-40 transition-opacity duration-300 group-hover:opacity-50`}></div>
              
                {/* Contenido de la región */}
                <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-8">
                  <div className="flex items-center mb-3 sm:mb-4 inline-block">
                    {region.icon}
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white ml-3 sm:ml-4 drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
                      {region.name}
                    </h3>
                  </div>
                  
                  <p className="text-sm sm:text-base text-white mb-4 sm:mb-6 max-w-2xl drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
                    {region.description}
                  </p>
                  
                  {/* Etiquetas de países */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {region.countries.map((country, index) => (
                      <span 
                        key={index}
                        className="bg-white/30 text-white text-xs uppercase tracking-wider font-medium px-2 py-1 rounded-full border border-white/20 shadow-sm"
                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
                      >
                        {country}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-white mt-auto bg-black/15 px-3 py-2 rounded-lg inline-flex">
                    <span className="text-sm sm:text-base font-medium drop-shadow-md" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Ver gastronomía</span>
                    <motion.div 
                      className="ml-2"
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                    >
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Botón para ver todo el catálogo */}
        <motion.div
          className="mt-10 sm:mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="inline-flex items-center bg-amber-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg text-base sm:text-lg font-medium hover:bg-amber-700 transition-colors shadow-lg shadow-amber-500/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/gastronomia'}
          >
            Ver catálogo completo
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FoodsSection; 
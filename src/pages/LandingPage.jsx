import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Utensils, Store, ArrowRight, Package, Sandwich, UtensilsCrossed, Shirt, Watch, Gift } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ImageCarousel from '../components/ImageCarousel';

// Componente memoizado para cada sección
const Section = memo(({ title, description, icon: Icon, color, iconColor, children }) => (
  <section className={`py-12 sm:py-16 md:py-20 bg-gradient-to-br ${color}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 sm:mb-16"
      >
        <div className="inline-flex items-center justify-center mb-4 sm:mb-6">
          <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${iconColor} mr-2 sm:mr-3`} />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
        </div>
        <p className="mt-3 sm:mt-4 text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      </motion.div>
      {children}
    </div>
  </section>
));

const LandingPage = () => {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

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

  // Categorías de productos
  const productCategories = [
    {
      id: 'harina-masa',
      name: t('productSection.categories.flour'),
      icon: <UtensilsCrossed className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-yellow-500" />,
      description: t('productSection.categoryDescriptions.flour'),
      image: '/harinasMasas.png',
      color: 'from-yellow-600 to-yellow-400',
      viewText: t('productSection.viewProducts'),
      subcategoria_id: '1'
    },
    {
      id: 'salsas-aderezos',
      name: t('productSection.categories.sauces'),
      icon: <Sandwich className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-red-500" />,
      description: t('productSection.categoryDescriptions.sauces'),
      image: '/salsasAderezos.png',
      color: 'from-red-600 to-red-400',
      viewText: t('productSection.viewProducts'),
      subcategoria_id: '2'
    },
    {
      id: 'paquetes-snacks',
      name: t('productSection.categories.snacks'),
      icon: <Package className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-green-500" />,
      description: t('productSection.categoryDescriptions.snacks'),
      image: '/paquetesSnacks.png',
      color: 'from-green-600 to-green-400',
      viewText: t('productSection.viewProducts'),
      subcategoria_id: '3'
    }
  ];

  // Regiones de comida
  const foodRegions = [
    {
      id: 'northAmerica',
      name: t('foodSection.regions.northAmerica.name'),
      description: t('foodSection.regions.northAmerica.description'),
      countries: t('foodSection.regions.northAmerica.countries'),
      image: '/norteAmerica.png',
      color: 'from-blue-600 to-blue-400',
      viewText: t('foodSection.viewFood'),
      subcategoria_id: '4'
    },
    {
      id: 'centralAmerica',
      name: t('foodSection.regions.centralAmerica.name'),
      description: t('foodSection.regions.centralAmerica.description'),
      countries: t('foodSection.regions.centralAmerica.countries'),
      image: '/centroAmerica.png',
      color: 'from-emerald-600 to-emerald-400',
      viewText: t('foodSection.viewFood'),
      subcategoria_id: '5'
    },
    {
      id: 'southAmerica',
      name: t('foodSection.regions.southAmerica.name'),
      description: t('foodSection.regions.southAmerica.description'),
      countries: t('foodSection.regions.southAmerica.countries'),
      image: '/surAmerica.png',
      color: 'from-amber-600 to-amber-400',
      viewText: t('foodSection.viewFood'),
      subcategoria_id: '6'
    }
  ];

  // Categorías de boutique
  const boutiqueCategories = [
    {
      id: 'clothing',
      name: t('boutiqueSection.categories.clothing'),
      icon: <Shirt className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-purple-500" />,
      description: t('boutiqueSection.categoryDescriptions.clothing'),
      image: '/ropaBoutique.png',
      color: 'from-purple-600 to-purple-400',
      viewText: t('boutiqueSection.viewMore'),
      subcategoria_id: '7'
    },
    {
      id: 'accessories',
      name: t('boutiqueSection.categories.accessories'),
      icon: <Watch className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-pink-500" />,
      description: t('boutiqueSection.categoryDescriptions.accessories'),
      image: '/accesoriosBoutique.png',
      color: 'from-pink-600 to-pink-400',
      viewText: t('boutiqueSection.viewMore'),
      subcategoria_id: '8'
    },
    {
      id: 'souvenirs',
      name: t('boutiqueSection.categories.souvenirs'),
      icon: <Gift className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-amber-500" />,
      description: t('boutiqueSection.categoryDescriptions.souvenirs'),
      image: '/souvenirBoutique.png',
      color: 'from-amber-600 to-amber-400',
      viewText: t('boutiqueSection.viewMore'),
      subcategoria_id: '9'
    }
  ];

  // Componente memoizado para las tarjetas de categoría
  const CategoryCard = memo(({ category, onClick }) => (
    <motion.div
      key={category.id}
      className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group h-52 sm:h-56 md:h-80"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img 
          src={category.image} 
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 filter blur-[0.8px]"
          width="800"
          height="600"
          style={{ 
            aspectRatio: '4/3',
            backgroundColor: '#f3f4f6',
            minHeight: 'inherit'
          }}
        />
        
        <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-10 transition-opacity duration-300 group-hover:opacity-20`}></div>
      
        <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-8">
          <div className="flex items-center mb-3 sm:mb-4">
            {category.icon}
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white ml-3 sm:ml-4 drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
              {category.name}
            </h3>
          </div>
          
          <p className="text-sm sm:text-base text-white mb-4 sm:mb-6 max-w-2xl drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
            {category.description}
          </p>
          
          <div className="flex items-center text-white mt-auto bg-black/15 px-3 py-2 rounded-lg inline-flex">
            <span className="text-sm sm:text-base font-medium drop-shadow-md" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
              {category.viewText}
            </span>
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
  ));

  return (
    <div className="min-h-screen">
      <ImageCarousel />
      
      {/* Sección de Productos */}
      <Section
        title={t('sections.products')}
        description={t('productSection.description')}
        icon={ShoppingBag}
        color="from-indigo-50 to-blue-50"
        iconColor="text-indigo-600"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {productCategories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => window.location.href = `/productos?subcategoria=${category.subcategoria_id}`}
            />
          ))}
        </div>
        <motion.div
          className="mt-10 sm:mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="inline-flex items-center bg-indigo-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg text-base sm:text-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/productos'}
          >
            {t('productSection.viewCatalog')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.button>
        </motion.div>
      </Section>

      {/* Sección de Comidas */}
      <Section
        title={t('sections.foods')}
        description={t('foodSection.description')}
        icon={Utensils}
        color="from-amber-50 to-orange-50"
        iconColor="text-amber-600"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {foodRegions.map(region => (
            <CategoryCard
              key={region.id}
              category={region}
              onClick={() => window.location.href = `/comidas?subcategoria=${region.subcategoria_id}`}
            />
          ))}
        </div>
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
            onClick={() => window.location.href = '/comidas'}
          >
            {t('foodSection.viewCatalog')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.button>
        </motion.div>
      </Section>

      {/* Sección de Boutique */}
      <Section
        title={t('sections.boutique')}
        description={t('boutiqueSection.description')}
        icon={Store}
        color="from-purple-50 to-pink-50"
        iconColor="text-purple-600"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {boutiqueCategories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => window.location.href = `/boutique?subcategoria=${category.subcategoria_id}`}
            />
          ))}
        </div>
        <motion.div
          className="mt-10 sm:mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="inline-flex items-center bg-purple-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg text-base sm:text-lg font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/boutique'}
          >
            {t('boutiqueSection.viewCatalog')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.button>
        </motion.div>
      </Section>
    </div>
  );
};

export default memo(LandingPage); 
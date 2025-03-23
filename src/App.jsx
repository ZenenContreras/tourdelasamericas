import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import ImageCarousel from './components/ImageCarousel';
import RegionsSection from './components/RegionsSection';
import Footer from './components/Footer';

function App() {
  const { t } = useLanguage();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section with Carousel */}
      <div className="relative h-screen">
        <ImageCarousel />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <motion.div 
            className="flex flex-col justify-center h-full pt-20"
            initial="initial"
            animate="animate"
            variants={fadeIn}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white max-w-3xl">
              {t('hero.title')}
            </h1>
            <p className="mt-6 text-xl text-gray-200 max-w-2xl">
              {t('hero.subtitle')}
            </p>
            <div className="mt-10 flex gap-4">
              <motion.button 
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('hero.explore')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
              <motion.button 
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('hero.learnMore')}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Sections */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <RegionsSection />
      </motion.div>

      <Footer />
    </div>
  );
}

export default App;
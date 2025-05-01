import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <motion.div
      className="fixed inset-0 bg-white z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ height: '100vh', width: '100vw' }}
    >
      <div className="flex flex-col items-center space-y-4" style={{ width: '100%', maxWidth: '300px', height: 'auto' }}>
        <motion.div
          className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ 
            width: '64px', 
            height: '64px',
            display: 'block',
            boxSizing: 'border-box'
          }}
        />
        <motion.p
          className="text-indigo-600 font-medium text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ height: '28px', display: 'block' }}
        >
          Cargando...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoadingScreen; 
import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div
      className="fixed inset-0 bg-white z-50 flex items-center justify-center"
      style={{ 
        height: '100vh', 
        width: '100vw', 
        position: 'fixed',
        top: 0,
        left: 0 
      }}
    >
      <div 
        className="flex flex-col items-center space-y-4" 
        style={{ 
          width: '100%', 
          maxWidth: '300px', 
          height: '100px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"
          style={{ 
            width: '64px', 
            height: '64px',
            display: 'block',
            boxSizing: 'border-box'
          }}
        />
        <p
          className="text-indigo-600 font-medium text-lg"
          style={{ 
            height: '28px', 
            display: 'block',
            margin: '0',
            padding: '0'
          }}
        >
          Cargando...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen; 
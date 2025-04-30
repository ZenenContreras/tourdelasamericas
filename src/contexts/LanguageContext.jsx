import React, { createContext, useState, useContext } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('es');

  const getNestedTranslation = (obj, path) => {
    return path.split('.').reduce((acc, part) => {
      if (acc === undefined) return undefined;
      return acc[part];
    }, obj);
  };

  const value = {
    language,
    setLanguage,
    t: (key) => {
      const translation = getNestedTranslation(translations[language], key);
      if (translation === undefined) {
        console.warn(`Translation key not found: ${key} for language: ${language}`);
        return key;
      }
      return translation;
    }
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Intentar obtener el idioma guardado en localStorage
    const savedLanguage = localStorage.getItem('language');
    // Verificar si el idioma guardado es válido
    return savedLanguage && translations[savedLanguage] ? savedLanguage : 'es';
  });

  // Memoizar la función de traducción
  const getNestedTranslation = useCallback((obj, path) => {
    return path.split('.').reduce((acc, part) => {
      if (acc === undefined) return undefined;
      return acc[part];
    }, obj);
  }, []);

  // Memoizar el valor del contexto
  const value = useMemo(() => ({
    language,
    setLanguage: (newLanguage) => {
      if (translations[newLanguage]) {
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
      }
    },
    t: (key) => {
      const translation = getNestedTranslation(translations[language], key);
      if (translation === undefined) {
        console.warn(`Translation key not found: ${key} for language: ${language}`);
        return key;
      }
      return translation;
    }
  }), [language, getNestedTranslation]);

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
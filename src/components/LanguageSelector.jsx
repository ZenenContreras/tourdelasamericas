import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe2 } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe2 className="h-5 w-5 text-indigo-600" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-transparent text-gray-700 hover:text-indigo-600 cursor-pointer"
      >
        <option value="es">Español</option>
        <option value="en">English</option>
        <option value="fr">Français</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
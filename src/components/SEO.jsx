import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Componente SEO para gestionar metadatos de la página
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la página
 * @param {string} props.description - Descripción de la página para metadatos
 * @param {string} props.canonicalUrl - URL canónica de la página
 * @param {string} props.ogImage - URL de la imagen para Open Graph
 * @param {string} props.section - Sección actual de la página
 */
const SEO = ({ 
  title, 
  description, 
  canonicalUrl, 
  ogImage = '/og-image.png',
  section = 'home'
}) => {
  const { language } = useLanguage();
  
  // URL base del sitio
  const siteUrl = 'https://tourdelasamericas.com';
  
  // Construir URL canónica
  const canonical = canonicalUrl || `${siteUrl}/${section === 'home' ? '' : section}`;
  
  // Locales para los idiomas soportados
  const locales = {
    es: 'es_ES',
    en: 'en_US',
    fr: 'fr_FR'
  };

  return (
    <Helmet>
      {/* Metadatos básicos */}
      <html lang={language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      
      {/* Metadatos Open Graph para redes sociales */}
      <meta property="og:site_name" content="Tour de las Américas" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:type" content={section === 'home' ? 'website' : 'article'} />
      <meta property="og:locale" content={locales[language]} />
      
      {/* Metadatos Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Metadatos estructurados para Google (JSON-LD) */}
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "${section === 'home' ? 'WebSite' : 'WebPage'}",
            "url": "${canonical}",
            "name": "${title}",
            "description": "${description}",
            "publisher": {
              "@type": "Organization",
              "name": "Tour de las Américas",
              "logo": {
                "@type": "ImageObject",
                "url": "${siteUrl}/america.png"
              }
            }
          }
        `}
      </script>
    </Helmet>
  );
};

export default SEO; 
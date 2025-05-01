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
      
      {/* Precarga de fuentes críticas para evitar CLS */}
      <link 
        rel="preload" 
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" 
        as="style" 
        crossOrigin="anonymous" 
      />
      <link 
        rel="preload" 
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" 
        as="style" 
        crossOrigin="anonymous" 
      />

      {/* Carga efectiva de fuentes */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap"
        rel="stylesheet"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
        crossOrigin="anonymous"
      />
      
      {/* Precarga imágenes críticas para rutas principales */}
      <link 
        rel="preload" 
        href="/fondoEscritorio.png" 
        as="image" 
        media="(min-width: 1024px)" 
      />
      <link 
        rel="preload" 
        href="/fondoTablet.png" 
        as="image" 
        media="(min-width: 768px) and (max-width: 1023px)" 
      />
      <link 
        rel="preload" 
        href="/fondoMobile2.png" 
        as="image" 
        media="(max-width: 767px)" 
      />
      
      {/* Metadatos Open Graph para redes sociales */}
      <meta property="og:site_name" content="Tour de las Américas" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={section === 'home' ? 'website' : 'article'} />
      <meta property="og:locale" content={locales[language]} />
      
      {/* Metadatos Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
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
      
      {/* Mejoras para móviles */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta name="theme-color" content="#4f46e5" />
      
      {/* Dimensiones reservadas para elementos críticos */}
      <style type="text/css">{`
        body {
          overflow-x: hidden;
        }
        
        /* Reservar espacio para imágenes críticas */
        .hero-image-container {
          min-height: 500px;
          height: 100vh;
          max-height: 900px;
          width: 100%;
          background-color: #f3f4f6;
          contain: layout size style;
        }
        
        /* Reservar espacio para tarjetas de productos */
        .product-card {
          min-height: 400px;
          aspect-ratio: 3/4;
          contain: layout size style;
        }
        
        /* Reservar espacio para imágenes de productos */
        .product-image {
          aspect-ratio: 1/1;
          background-color: #f3f4f6;
          contain: layout size style;
        }
        
        @media screen and (min-width: 768px) {
          .hero-image-container {
            min-height: 600px;
          }
        }
      `}</style>
    </Helmet>
  );
};

export default SEO; 
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Database, Share2, Lock, User, Cookie, Bell, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  const sections = [
    {
      icon: <Database className="h-6 w-6 text-indigo-500" />,
      title: 'Información que Recopilamos',
      content: 'Recopilamos información que usted nos proporciona directamente cuando:',
      list: [
        'Crea una cuenta',
        'Realiza una compra',
        'Se suscribe a nuestro boletín',
        'Se comunica con nosotros'
      ]
    },
    {
      icon: <Share2 className="h-6 w-6 text-indigo-500" />,
      title: 'Uso de la Información',
      content: 'Utilizamos su información para:',
      list: [
        'Procesar sus pedidos y pagos',
        'Enviar actualizaciones sobre su pedido',
        'Proporcionar soporte al cliente',
        'Mejorar nuestros servicios'
      ]
    },
    {
      icon: <Lock className="h-6 w-6 text-indigo-500" />,
      title: 'Compartir Información',
      content: 'No vendemos ni alquilamos su información personal a terceros. Solo compartimos información con:',
      list: [
        'Proveedores de servicios de pago',
        'Servicios de envío',
        'Servicios de análisis'
      ]
    },
    {
      icon: <Shield className="h-6 w-6 text-indigo-500" />,
      title: 'Seguridad de Datos',
      content: 'Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal.'
    },
    {
      icon: <User className="h-6 w-6 text-indigo-500" />,
      title: 'Sus Derechos',
      content: 'Usted tiene derecho a:',
      list: [
        'Acceder a sus datos personales',
        'Corregir información inexacta',
        'Solicitar la eliminación de sus datos',
        'Oponerse al procesamiento de sus datos'
      ]
    },
    {
      icon: <Cookie className="h-6 w-6 text-indigo-500" />,
      title: 'Cookies',
      content: 'Utilizamos cookies para mejorar su experiencia de navegación y analizar el uso del sitio.'
    },
    {
      icon: <Bell className="h-6 w-6 text-indigo-500" />,
      title: 'Cambios en la Política',
      content: 'Nos reservamos el derecho de modificar esta política de privacidad en cualquier momento.'
    },
    {
      icon: <Mail className="h-6 w-6 text-indigo-500" />,
      title: 'Contacto',
      content: 'Para cualquier consulta sobre nuestra política de privacidad, contáctenos a través de nuestro formulario de contacto.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12">
      <div className="max-w-4xl mt-20 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Política de Privacidad
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Última actualización: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8 space-y-8">
            {sections.map((section, index) => (
              <div 
                key={index}
                className="relative pl-12 pb-8 last:pb-0"
              >
                <div className="absolute left-0 top-0 w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                  {section.icon}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {section.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {section.content}
                </p>
                {section.list && (
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    {section.list.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {index < sections.length - 1 && (
                  <div className="absolute bottom-0 left-6 w-px h-8 bg-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Al utilizar nuestro servicio, usted acepta nuestra política de privacidad.
            Si no está de acuerdo con alguna parte de esta política, por favor no utilice nuestro servicio.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 
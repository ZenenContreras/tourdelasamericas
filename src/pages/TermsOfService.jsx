import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, FileText, AlertCircle, Mail, Clock, Lock, ShoppingBag, CreditCard, Truck, Globe } from 'lucide-react';

const TermsOfService = () => {
  const { t } = useTranslation();

  const sections = [
    {
      icon: <Shield className="h-6 w-6 text-indigo-500" />,
      title: 'Aceptación de Términos',
      content: 'Al acceder y utilizar este sitio web, usted acepta estar sujeto a estos términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, por favor no utilice nuestro servicio.'
    },
    {
      icon: <ShoppingBag className="h-6 w-6 text-indigo-500" />,
      title: 'Productos y Servicios',
      content: 'Ofrecemos una selección única de productos auténticos de América Latina. Nos comprometemos a:',
      list: [
        'Garantizar la autenticidad de todos nuestros productos',
        'Proporcionar descripciones precisas de los productos',
        'Mantener precios competitivos y transparentes',
        'Ofrecer productos de la más alta calidad'
      ]
    },
    {
      icon: <CreditCard className="h-6 w-6 text-indigo-500" />,
      title: 'Pagos y Transacciones',
      content: 'Aceptamos varios métodos de pago y nos comprometemos a:',
      list: [
        'Procesar pagos de forma segura',
        'Proteger la información de su tarjeta',
        'Proporcionar facturas detalladas',
        'Manejar reembolsos de manera eficiente'
      ]
    },
    {
      icon: <Truck className="h-6 w-6 text-indigo-500" />,
      title: 'Envíos y Entregas',
      content: 'Nuestro servicio de envío incluye:',
      list: [
        'Envíos a nivel internacional',
        'Seguimiento en tiempo real',
        'Tiempos de entrega estimados',
        'Políticas de devolución claras'
      ]
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-indigo-500" />,
      title: 'Conducta del Usuario',
      content: 'Los usuarios deben mantener un comportamiento respetuoso y no realizar actividades que puedan dañar la plataforma, incluyendo:',
      list: [
        'No realizar actividades fraudulentas',
        'No compartir información falsa',
        'No realizar compras con tarjetas no autorizadas',
        'No realizar spam o publicidad no solicitada',
        'No infringir derechos de propiedad intelectual'
      ]
    },
    {
      icon: <Lock className="h-6 w-6 text-indigo-500" />,
      title: 'Propiedad Intelectual',
      content: 'Todo el contenido del sitio web está protegido por derechos de autor y otras leyes de propiedad intelectual, incluyendo:',
      list: [
        'Imágenes y fotografías de productos',
        'Descripciones y contenido textual',
        'Diseño y logotipos',
        'Software y código fuente'
      ]
    },
    {
      icon: <Globe className="h-6 w-6 text-indigo-500" />,
      title: 'Jurisdicción y Ley Aplicable',
      content: 'Estos términos se rigen por las leyes de [País] y cualquier disputa estará sujeta a la jurisdicción exclusiva de los tribunales de [Ciudad].'
    },
    {
      icon: <Clock className="h-6 w-6 text-indigo-500" />,
      title: 'Modificaciones',
      content: 'Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web.'
    },
    {
      icon: <Mail className="h-6 w-6 text-indigo-500" />,
      title: 'Contacto',
      content: 'Para cualquier consulta sobre estos términos, por favor contáctenos a través de nuestro formulario de contacto o al correo electrónico: support@aunclic.com'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12">
      <div className="max-w-4xl mt-20 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Términos de Servicio
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
            Al utilizar nuestro servicio, usted acepta estos términos y condiciones.
            Si no está de acuerdo con alguna parte de estos términos, por favor no utilice nuestro servicio.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 
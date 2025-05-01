import React from 'react';
import { motion } from 'framer-motion';
import { X, Mail, ArrowRight, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const EmailVerificationModal = ({ isOpen, onClose, email, onResend }) => {
  const { t } = useLanguage();
  const [isResending, setIsResending] = React.useState(false);
  const [resendSuccess, setResendSuccess] = React.useState(false);

  const handleResend = async () => {
    if (isResending) return;
    
    setIsResending(true);
    setResendSuccess(false);
    
    try {
      if (onResend) {
        await onResend(email);
        setResendSuccess(true);
      }
    } catch (error) {
      console.error('Error al reenviar el correo de verificación:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${!isOpen && 'pointer-events-none'}`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: isOpen ? 0 : 50, opacity: isOpen ? 1 : 0 }}
        transition={{ delay: 0.1, duration: 0.3, ease: 'easeOut' }}
        className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-6 py-8">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-100 rounded-full p-4">
              <Mail className="h-12 w-12 text-indigo-600" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {t('auth.verification.title', 'Verifica tu correo electrónico')}
            </h2>
            <p className="mt-3 text-gray-600">
              {t('auth.verification.description', 'Hemos enviado un correo de verificación a:')}
            </p>
            <p className="mt-1 font-medium text-indigo-600">{email}</p>
            <p className="mt-4 text-sm text-gray-600">
              {t('auth.verification.instructions', 'Haz clic en el enlace del correo para activar tu cuenta y poder iniciar sesión.')}
            </p>
          </div>

          {resendSuccess && (
            <div className="p-3 mb-4 bg-green-50 rounded-lg text-center">
              <p className="text-sm text-green-600">
                {t('auth.verification.resendSuccess', 'Correo de verificación reenviado con éxito.')}
              </p>
            </div>
          )}

          <div className="mt-6 space-y-4">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="w-full flex justify-center items-center py-3 px-4 border border-indigo-300 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              {isResending ? (
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-5 w-5 mr-2" />
              )}
              {t('auth.verification.resend', 'Reenviar correo de verificación')}
            </button>

            <div className="flex items-center text-sm my-4">
              <div className="h-px bg-gray-300 flex-1"></div>
              <span className="px-3 text-gray-500">{t('auth.verification.or', 'o')}</span>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <ArrowRight className="h-5 w-5 mr-2" />
              {t('auth.verification.backToLogin', 'Volver a inicio de sesión')}
            </button>
          </div>
        </div>

        <div className="bg-gray-100 px-6 py-4 text-sm text-center text-gray-600">
          {t('auth.verification.checkSpam', '¿No encuentras el correo? Revisa tu carpeta de spam o correo no deseado.')}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EmailVerificationModal; 
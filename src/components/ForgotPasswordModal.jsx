import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { resetPassword } from '../services/authService';

const ForgotPasswordModal = ({ isOpen, onClose, email: initialEmail = '' }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validar el formato del email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validar email
    if (!email || !validateEmail(email)) {
      setError(t('auth.errors.invalidEmail'));
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await resetPassword(email);
      
      if (error) throw error;
      
      setIsSuccess(true);
    } catch (error) {
      console.error('Error al enviar email de recuperación:', error);
      // Mostramos un mensaje genérico para evitar revelar si el email existe o no
      setError(t('auth.forgotPassword.error'));
    } finally {
      setIsLoading(false);
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
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="px-6 py-8 text-center">
            <div className="flex justify-center mb-6">
              <img src="/america.png" alt="Á un Clic" className="h-16 w-auto" />
            </div>
            
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('auth.forgotPassword.successTitle')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('auth.forgotPassword.successMessage')}
            </p>
            <button
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
            >
              {t('auth.forgotPassword.backToLogin')}
            </button>
          </div>
        ) : (
          <>
            <div className="px-6 py-8">
              <div className="flex justify-center mb-6">
                <img src="/america.png" alt="Á un Clic" className="h-16 w-auto" />
              </div>
              
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('auth.forgotPassword.title')}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {t('auth.forgotPassword.instruction')}
                </p>
              </div>

              {error && (
                <div className="p-3 mb-4 bg-red-50 rounded-lg flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {t('auth.forgotPassword.email')}
                  </label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors duration-200"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('auth.forgotPassword.sending')}
                      </span>
                    ) : (
                      t('auth.forgotPassword.submit')
                    )}
                  </button>
                </div>
              </form>
              
              <div className="mt-6 text-center">
                <button
                  onClick={onClose}
                  className="text-sm text-indigo-600 hover:text-indigo-500 font-medium hover:underline"
                >
                  <span className="flex items-center justify-center">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    {t('auth.forgotPassword.backToLogin')}
                  </span>
                </button>
              </div>
            </div>

            <div className="bg-gray-100 px-6 py-3 text-xs text-center text-gray-500 border-t border-gray-200">
              ¿No recibiste el correo? Revisa tu carpeta de spam o intenta con otro correo.
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ForgotPasswordModal; 
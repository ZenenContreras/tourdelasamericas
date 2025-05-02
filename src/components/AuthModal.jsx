import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, AlertCircle, User, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { resendVerificationEmail } from '../services/authService';
import ForgotPasswordModal from './ForgotPasswordModal';
import EmailVerificationModal from './EmailVerificationModal';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { t } = useLanguage();
  const { signInWithEmail, signInWithGoogle, signUp } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validateForm = () => {
    if (mode === 'register' && !formData.nombre) {
      setError(t('auth.errors.nombreRequired') || 'El nombre es requerido');
      return false;
    }

    if (!formData.email || !formData.password) {
      setError(t('auth.errors.invalidCredentials'));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t('auth.errors.invalidEmail'));
      return false;
    }

    if (formData.password.length < 6) {
      setError(t('auth.errors.invalidPassword'));
      return false;
    }

    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      setError(t('auth.errors.passwordsDontMatch'));
      return false;
    }

    return true;
  };

  const handleResendVerification = async (email) => {
    try {
      const { error } = await resendVerificationEmail(email);
      if (error) {
        console.error('Error al reenviar email de verificación:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error inesperado al reenviar verificación:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signInWithEmail(formData.email, formData.password);
        if (error) throw error;
        onClose();
      } else {
        const { error } = await signUp(formData.email, formData.password, formData.nombre);
        if (error) throw error;
        
        // Guardamos el email registrado y mostramos la pantalla de verificación
        setRegisteredEmail(formData.email);
        setShowEmailVerification(true);
      }
      
      setFormData({ nombre: '', email: '', password: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error de autenticación:', error);
      setError(error.message || t('auth.errors.genericError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { error } = await signInWithGoogle();
      if (error) throw error;
      onClose();
    } catch (error) {
      console.error('Error con Google Auth:', error);
      setError(t('auth.errors.genericError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <ForgotPasswordModal
        isOpen={isOpen}
        onClose={() => setShowForgotPassword(false)}
        email={formData.email}
      />
    );
  }

  if (showEmailVerification) {
    return (
      <EmailVerificationModal
        isOpen={isOpen}
        onClose={() => {
          setShowEmailVerification(false);
          onClose();
        }}
        email={registeredEmail}
        onResend={handleResendVerification}
      />
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 sm:p-6"
          style={{ 
            height: '100dvh',
            width: '100vw',
            touchAction: 'none'
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            style={{ maxHeight: '90dvh' }}
          >
            <div className="sticky top-0 p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-2">
                <User className={`h-5 w-5 text-${color}-600`} />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {mode === 'login' ? t('auth.login.title') : t('auth.register.title')}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                      {t('auth.register.nombre')}
                    </label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder={t('auth.register.nombre')}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {t('auth.login.email')}
                  </label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    {t('auth.login.password')}
                  </label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="********"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {mode === 'register' && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      {t('auth.register.confirmPassword')}
                    </label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="********"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === 'login' && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      {t('auth.login.forgotPassword')}
                    </button>
                  </div>
                )}

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
                        {t('loading')}
                      </span>
                    ) : (
                      t(mode === 'login' ? 'auth.login.submit' : 'auth.register.submit')
                    )}
                  </button>
                </div>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {t('auth.or')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  <img src="/google.svg" alt="Google" className="h-5 w-5" />
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('facebook')}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  <img src="/facebook.svg" alt="Facebook" className="h-5 w-5" />
                  Facebook
                </button>
              </div>

              <div className="text-center text-sm">
                <span className="text-gray-600">
                  {mode === 'login' ? t('auth.login.noAccount') : t('auth.register.haveAccount')}
                </span>
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className={`ml-1 text-${color}-600 hover:text-${color}-700 font-medium`}
                >
                  {mode === 'login' ? t('auth.login.register') : t('auth.register.login')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal; 
import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  const [rememberMe, setRememberMe] = useState(false);

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
        const { error } = await signInWithEmail(formData.email, formData.password, rememberMe);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 ${!isOpen && 'pointer-events-none'}`}
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        WebkitBackdropFilter: 'blur(4px)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: isOpen ? 0 : 50, opacity: isOpen ? 1 : 0 }}
        transition={{ delay: 0.1, duration: 0.3, ease: 'easeOut' }}
        className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden relative"
        style={{
          maxHeight: '95vh',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-center">
            <img src="/LogoAunClic.svg" alt="Á un Clic" className="h-24 sm:h-24 w-auto" />
          </div>

          <div className="text-center mb-2 sm:mb-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {t(mode === 'login' ? 'auth.login.title' : 'auth.register.title')}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-600">
              {t(mode === 'login' ? 'auth.login.subtitle' : 'auth.register.subtitle')}
            </p>
          </div>

          {error && (
            <div className="p-2 sm:p-3 mb-2 sm:mb-3 bg-red-50 rounded-xl flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
            {mode === 'register' && (
              <div>
                <label htmlFor="nombre" className="block text-xs sm:text-sm font-medium text-gray-700">
                  {t('auth.register.nombre')}
                </label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                    placeholder={t('auth.register.nombre')}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">
                {t('auth.login.email')}
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700">
                {t('auth.login.password')}
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-1.5 sm:py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700">
                  {t('auth.register.confirmPassword')}
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-1.5 sm:py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-xs sm:text-sm text-gray-600">
                    {t('auth.login.rememberMe')}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  {t('auth.login.forgotPassword')}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                t(mode === 'login' ? 'auth.login.submit' : 'auth.register.submit')
              )}
            </button>

            <div className="flex items-center text-xs sm:text-sm my-2 sm:my-3">
              <div className="h-px bg-gray-300 flex-1"></div>
              <span className="px-2 sm:px-3 text-gray-500">{t('auth.login.orContinueWith')}</span>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex justify-center items-center py-2 sm:py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 24 24" width="24" height="24">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                  </g>
                </svg>
                <span>Continuar con Google</span>
              </button>
            </div>
          </form>
        </div>

        <div className="px-3 sm:px-6 py-2 sm:py-3 bg-gray-50 text-xs sm:text-sm text-center border-t border-gray-200">
          {mode === 'login' ? (
            <p>
              {t('auth.login.noAccount')}{' '}
              <button
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                {t('auth.login.register')}
              </button>
            </p>
          ) : (
            <p>
              {t('auth.register.haveAccount')}{' '}
              <button
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                {t('auth.register.login')}
              </button>
            </p>
          )}
        </div>

        <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            {t('auth.errors.termsNotice')}{' '}
            <a href="/terminos-de-servicio" className="text-indigo-600 hover:text-indigo-500" target="_blank" rel="noopener noreferrer">
              {t('auth.errors.termsOfService')}
            </a>{' '}
            {t('auth.errors.and')}{' '}
            <a href="/politica-de-privacidad" className="text-indigo-600 hover:text-indigo-500" target="_blank" rel="noopener noreferrer">
              {t('auth.errors.privacyPolicy')}
            </a>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal; 
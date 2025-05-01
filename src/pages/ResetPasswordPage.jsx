import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, AlertCircle, Check, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { updatePassword } from '../services/authService';
import { supabase } from '../config/supabase';

const ResetPasswordPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Verificar el token de restablecimiento de contraseña
  useEffect(() => {
    const verifySession = async () => {
      try {
        // Supabase maneja automáticamente el token de la URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data.session) {
          setIsValidToken(true);
        } else {
          setError(t('auth.resetPassword.invalidToken'));
        }
      } catch (error) {
        console.error('Error verificando token:', error);
        setError(t('auth.resetPassword.invalidToken'));
      } finally {
        setIsCheckingToken(false);
      }
    };

    verifySession();
  }, [t]);

  // Redirigir después del éxito
  useEffect(() => {
    if (success && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (success && timeLeft === 0) {
      navigate('/');
    }
  }, [success, timeLeft, navigate]);

  const validatePassword = () => {
    if (password.length < 6) {
      setError(t('auth.errors.invalidPassword'));
      return false;
    }
    
    if (password !== confirmPassword) {
      setError(t('auth.errors.passwordsDontMatch'));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await updatePassword(password);
      
      if (error) throw error;
      
      setSuccess(true);
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      setError(t('auth.resetPassword.updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar estado de carga mientras verifica el token
  if (isCheckingToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin mx-auto"></div>
          <h2 className="mt-6 text-center text-xl font-bold text-gray-900">
            {t('auth.resetPassword.verifying')}
          </h2>
        </div>
      </div>
    );
  }

  // Mostrar error si el token no es válido
  if (!isValidToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <img 
              className="mx-auto h-16 w-auto" 
              src="/america.png" 
              alt="Á un Clic"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              {t('auth.resetPassword.error')}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {error}
            </p>
          </div>
          <div className="mt-6">
            <button
              onClick={() => navigate('/')}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
            >
              {t('auth.resetPassword.backToHome')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si el restablecimiento fue exitoso
  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 text-center">
          <img 
            className="mx-auto h-16 w-auto" 
            src="/america.png" 
            alt="Á un Clic"
          />
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            {t('auth.resetPassword.successTitle')}
          </h2>
          <p className="text-gray-600">
            {t('auth.resetPassword.successMessage')}
          </p>
          <p className="text-gray-600">
            {t('auth.resetPassword.redirecting', { seconds: timeLeft })}
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 inline-flex w-full items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            {t('auth.resetPassword.backToHome')}
          </button>
        </div>
      </div>
    );
  }

  // Formulario para cambiar la contraseña
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img 
            className="mx-auto h-16 w-auto" 
            src="/america.png" 
            alt="Á un Clic"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {t('auth.resetPassword.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('auth.resetPassword.instruction')}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 rounded-lg flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('auth.resetPassword.newPassword')}
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <p className="mt-1 text-xs text-gray-500">
                {t('auth.resetPassword.passwordRequirement')}
              </p>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                {t('auth.resetPassword.confirmPassword')}
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 transition-colors duration-200"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('auth.resetPassword.updating')}
                </span>
              ) : (
                t('auth.resetPassword.submit')
              )}
            </button>
          </div>
        </form>
        
        <div className="bg-gray-100 px-6 py-3 text-xs text-center text-gray-500 rounded-lg mt-4">
          ¿Necesitas ayuda? Contacta a nuestro soporte en support@aunclic.com
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 
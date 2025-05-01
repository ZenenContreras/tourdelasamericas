import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { useLanguage } from '../contexts/LanguageContext';

const AuthCallback = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase OAuth maneja automáticamente la respuesta
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        // Redireccionar al usuario a la página principal si la autenticación fue exitosa
        if (data.session) {
          navigate('/');
        } else {
          // Si no hay sesión, algo salió mal
          navigate('/');
        }
      } catch (err) {
        console.error('Error en callback de autenticación:', err);
        setError(err.message);
        // Redireccionar al usuario a la página principal después de un tiempo
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('auth.errors.genericError')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {error}
          </p>
          <p className="mt-1 text-center text-sm text-gray-500">
            {t('redirecting')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="mx-auto h-12 w-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {t('auth.signin.completing')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t('auth.signin.redirecting')}
        </p>
      </div>
    </div>
  );
};

export default AuthCallback; 
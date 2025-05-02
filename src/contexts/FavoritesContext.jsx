import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import { toast } from 'react-hot-toast';
import * as favoriteService from '../services/favoriteService';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar favoritos al iniciar sesión
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [user]);

  // Cargar favoritos del usuario
  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error } = await favoriteService.getUserFavorites(user);
      
      if (error) throw new Error(error);
      
      setFavorites(data || []);
    } catch (error) {
      console.error('Error cargando favoritos:', error);
      setError(error.message);
      toast.error(t('favorites.errorLoading'));
    } finally {
      setLoading(false);
    }
  }, [user, t]);

  // Verificar si un producto está en favoritos
  const isInFavorites = useCallback((productId) => {
    return favorites.some(fav => fav.producto_id === productId);
  }, [favorites]);

  // Agregar a favoritos
  const addToFavorites = useCallback(async (productId) => {
    if (!user) {
      toast.error(t('favorites.loginRequired'));
      return { error: 'login_required' };
    }

    try {
      const { data, error } = await favoriteService.addToFavorites(user, productId);
      
      if (error) throw new Error(error);

      // Solo actualizar los favoritos si el producto no estaba ya en la lista
      if (!isInFavorites(productId)) {
        setFavorites(prev => [...prev, data]);
      }
      
      toast.success(t('favorites.added'));
      return { error: null };
    } catch (error) {
      console.error('Error agregando a favoritos:', error);
      toast.error(error.message || t('favorites.errorAdding'));
      return { error: error.message };
    }
  }, [user, t, isInFavorites]);

  // Eliminar de favoritos
  const removeFromFavorites = useCallback(async (productId) => {
    if (!user) {
      toast.error(t('favorites.loginRequired'));
      return { error: 'login_required' };
    }

    try {
      const { error } = await favoriteService.removeFromFavorites(user, productId);
      
      if (error) throw new Error(error);

      setFavorites(prev => prev.filter(fav => fav.producto_id !== productId));
      toast.success(t('favorites.removed'));
      return { error: null };
    } catch (error) {
      console.error('Error eliminando de favoritos:', error);
      toast.error(error.message || t('favorites.errorRemoving'));
      return { error: error.message };
    }
  }, [user, t]);

  // Limpiar favoritos
  const clearFavorites = useCallback(async () => {
    if (!user) {
      toast.error(t('favorites.loginRequired'));
      return { error: 'login_required' };
    }

    try {
      setFavorites([]);
      toast.success(t('favorites.cleared'));
      return { error: null };
    } catch (error) {
      console.error('Error limpiando favoritos:', error);
      toast.error(error.message || t('favorites.errorClearing'));
      return { error: error.message };
    }
  }, [user, t]);

  // Valor del contexto
  const value = {
    favorites,
    loading,
    error,
    isInFavorites,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    loadFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}; 
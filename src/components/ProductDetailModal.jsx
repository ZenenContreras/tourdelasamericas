import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Heart, ShoppingCart, Plus, Minus, Trash2, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { toast } from 'react-hot-toast';
import * as reviewService from '../services/reviewService';
import AuthModal from './AuthModal';

const ProductDetailModal = ({ product, onClose, type = 'product' }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { addToCart, updateQuantity, isInCart, getItemQuantity } = useCart();
  const { isInFavorites, addToFavorites, removeFromFavorites } = useFavorites();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Configuración de colores según el tipo
  const typeConfig = {
    product: {
      accent: 'indigo',
      hover: 'indigo',
      button: 'indigo'
    },
    food: {
      accent: 'amber',
      hover: 'orange',
      button: 'amber'
    },
    boutique: {
      accent: 'purple',
      hover: 'purple',
      button: 'purple'
    }
  };

  const config = typeConfig[type];

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  useEffect(() => {
    if (product) {
      loadProductDetails();
    }
  }, [product, user]);

  const loadProductDetails = async () => {
    if (!product) return;

    try {
      // Cargar reviews
      const reviewsResult = await reviewService.getProductReviews(product.id);
      if (!reviewsResult.error) {
        setReviews(reviewsResult.data || []);
      }

      // Cargar rating promedio
      const ratingResult = await reviewService.getProductRating(product.id);
      if (!ratingResult.error) {
        setAverageRating(ratingResult.averageRating);
        setTotalReviews(ratingResult.totalReviews);
      }

      // Si hay usuario autenticado
      if (user) {
        // Verificar si el producto está en favoritos
        const isFav = isInFavorites(product.id);
        setIsFavorite(isFav);

        // Verificar si el usuario ya dejó una review
        const hasReviewedResult = await reviewService.hasUserReviewed(user, product.id);
        if (!hasReviewedResult.error && hasReviewedResult.hasReviewed) {
          const userReview = reviews.find(review => review.usuario_id === user.id);
          setUserReview(userReview);
        }
      }
    } catch (error) {
      console.error('Error cargando detalles:', error);
      toast.error('Error al cargar los detalles del producto');
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await addToCart(product.id);
      
      if (error) {
        if (error === 'login_required') {
          setIsAuthModalOpen(true);
        } else {
          throw new Error(error);
        }
        return;
      }

      toast.success(t('cart.addedToCart'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.message || t('cart.errorAdding'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (change) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      const currentQuantity = getItemQuantity(product.id);
      const newQuantity = Math.max(0, currentQuantity + change);

      if (newQuantity > product.stock) {
        toast.error(t('cart.stockLimit', { stock: product.stock }));
        return;
      }

      const { error } = await updateQuantity(product.id, newQuantity);
      
      if (error) {
        if (error === 'login_required') {
          setIsAuthModalOpen(true);
        } else {
          throw new Error(error);
        }
        return;
      }

      toast.success(newQuantity === 0 ? t('cart.removed') : t('cart.updated'));
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(error.message || t('cart.errorUpdating'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      if (isFavorite) {
        const { error } = await removeFromFavorites(product.id);
        if (error) throw error;
        setIsFavorite(false);
        toast.success('Producto eliminado de favoritos');
      } else {
        const { error } = await addToFavorites(product.id);
        if (error) throw error;
        setIsFavorite(true);
        toast.success('Producto agregado a favoritos');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      setIsAddingReview(true);
      const { data, error } = await reviewService.createReview(
        user,
        product.id,
        newReview.rating,
        newReview.comment
      );

      if (error) throw error;

      setReviews(prev => [data, ...prev]);
      setUserReview(data);
      setNewReview({ rating: 5, comment: '' });
      toast.success('Reseña agregada exitosamente');

      // Actualizar el rating promedio
      const ratingResult = await reviewService.getProductRating(product.id);
      if (!ratingResult.error) {
        setAverageRating(ratingResult.averageRating);
        setTotalReviews(ratingResult.totalReviews);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.message);
    } finally {
      setIsAddingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const { error } = await reviewService.deleteReview(reviewId, user);
      if (error) throw error;

      setReviews(prev => prev.filter(review => review.id !== reviewId));
      setUserReview(null);
      toast.success('Reseña eliminada exitosamente');

      // Actualizar el rating promedio
      const ratingResult = await reviewService.getProductRating(product.id);
      if (!ratingResult.error) {
        setAverageRating(ratingResult.averageRating);
        setTotalReviews(ratingResult.totalReviews);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error(error.message);
    }
  };

  const productInCart = isInCart(product?.id);
  const quantity = getItemQuantity(product?.id);

  if (!product) return null;

  // Simular múltiples imágenes (en producción esto vendría del producto)
  const images = [
    product.imagen_url || '/placeholder-product.png',
    // Aquí irían más imágenes del producto
  ];

  // Diseño móvil
  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed inset-y-0 right-0 w-full md:w-[600px] lg:w-[800px] bg-white shadow-2xl z-50 overflow-y-auto"
      >
        {/* Contenido actual del modal móvil */}
        {/* ... */}
      </motion.div>
    );
  }

  // Diseño desktop
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex"
      >
        {/* Columna izquierda - Galería de imágenes */}
        <div className="w-1/2 bg-gray-100 relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>

          <button
            onClick={handleToggleFavorite}
            disabled={isLoading}
            className={`absolute top-4 right-4 p-2 rounded-full shadow-md transition-colors z-10 ${
              isFavorite 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <div className="h-full">
            <img
              src={images[selectedImage]}
              alt={product.nombre}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Miniaturas */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    selectedImage === index ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Columna derecha - Información y acciones */}
        <div className="w-1/2 flex flex-col max-h-[90vh]">
          {/* Encabezado */}
          <div className="p-6 border-b border-gray-200">
            {product.categoria && (
              <span className={`text-sm font-medium text-${config.accent}-600 bg-${config.accent}-50 px-2 py-1 rounded-full`}>
                {product.categoria}
              </span>
            )}
            <h1 className="text-2xl font-bold text-gray-900 mt-2">{product.nombre}</h1>
            
            <div className="flex items-center mt-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= averageRating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                ({totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'})
              </span>
            </div>
          </div>

          {/* Contenido principal con scroll */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Descripción */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h2>
                <p className="text-gray-600">{product.descripcion}</p>
              </div>

              {/* Precio y acciones */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    {product.precio_anterior && (
                      <span className="text-sm text-gray-500 line-through block">
                        ${product.precio_anterior.toFixed(2)}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.precio.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm text-gray-600">
                      {product.stock > 0 
                        ? `${product.stock} unidades disponibles`
                        : 'Agotado'}
                    </span>
                  </div>
                </div>

                {productInCart ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-300 rounded-lg flex-1">
                      <button
                        onClick={() => handleUpdateQuantity(-1)}
                        disabled={isLoading}
                        className="p-3 hover:bg-gray-100 transition-colors flex-1"
                      >
                        <Minus className="h-5 w-5 text-gray-600 mx-auto" />
                      </button>
                      <span className="px-6 py-3 text-gray-900 font-medium border-x border-gray-300 flex-1 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(1)}
                        disabled={isLoading || quantity >= product.stock}
                        className="p-3 hover:bg-gray-100 transition-colors flex-1"
                      >
                        <Plus className="h-5 w-5 text-gray-600 mx-auto" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={isLoading || product.stock === 0}
                    className={`
                      w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium
                      ${product.stock === 0 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : `bg-${config.button}-600 hover:bg-${config.button}-700`}
                      disabled:opacity-50
                    `}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>
                      {product.stock === 0 
                        ? t('product.outOfStock')
                        : t('product.addToCart')}
                    </span>
                  </button>
                )}
              </div>

              {/* Reseñas */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Reseñas</h2>

                {/* Formulario para agregar reseña */}
                {user && !userReview && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Deja tu reseña</h3>
                    <div className="flex items-center mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                          className="p-1"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= newReview.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Escribe tu opinión sobre el producto..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows="3"
                    />
                    <button
                      onClick={handleSubmitReview}
                      disabled={isAddingReview || !newReview.comment.trim()}
                      className={`mt-3 px-4 py-2 bg-${config.button}-600 text-white rounded-lg hover:bg-${config.button}-700 disabled:opacity-50 w-full`}
                    >
                      {isAddingReview ? 'Enviando...' : 'Enviar reseña'}
                    </button>
                  </div>
                )}

                {/* Lista de reseñas */}
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {review.usuarios.nombre.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {review.usuarios.nombre}
                            </p>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.estrellas
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        {user && review.usuario_id === user.id && (
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <p className="mt-2 text-gray-600">{review.comentario}</p>
                    </div>
                  ))}

                  {reviews.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                      No hay reseñas aún. ¡Sé el primero en opinar!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </motion.div>
  );
};

export default ProductDetailModal; 
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar juegos
  const loadGames = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/juegos`);
      setGames(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los juegos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar reseñas
  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/reviews`);
      setReviews(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las reseñas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Agregar juego
  const addGame = async (gameData) => {
    try {
      const response = await axios.post(`${API_URL}/juegos`, gameData);
      setGames([...games, response.data]);
      return response.data;
    } catch (err) {
      setError('Error al agregar el juego');
      throw err;
    }
  };

  // Actualizar juego
  const updateGame = async (id, gameData) => {
    try {
      const response = await axios.put(`${API_URL}/juegos/${id}`, gameData);
      setGames(games.map(game => game._id === id ? response.data : game));
      return response.data;
    } catch (err) {
      setError('Error al actualizar el juego');
      throw err;
    }
  };

  // Eliminar juego
  const deleteGame = async (id) => {
    try {
      await axios.delete(`${API_URL}/juegos/${id}`);
      setGames(games.filter(game => game._id !== id));
      setReviews(reviews.filter(review => review.juegoId._id !== id));
    } catch (err) {
      setError('Error al eliminar el juego');
      throw err;
    }
  };

  // Agregar reseña
  const addReview = async (reviewData) => {
    try {
      console.log('Enviando reseña a:', `${API_URL}/reviews`);
      console.log('Datos de la reseña:', reviewData);
      const response = await axios.post(`${API_URL}/reviews`, reviewData);
      setReviews([...reviews, response.data]);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al agregar la reseña';
      setError(errorMessage);
      console.error('Error detallado:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
        url: err.config?.url
      });
      throw new Error(errorMessage);
    }
  };

  // Actualizar reseña
  const updateReview = async (id, reviewData) => {
    try {
      const response = await axios.put(`${API_URL}/reviews/${id}`, reviewData);
      setReviews(reviews.map(review => review._id === id ? response.data : review));
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al actualizar la reseña';
      setError(errorMessage);
      console.error('Error detallado:', err.response?.data || err);
      throw new Error(errorMessage);
    }
  };

  // Eliminar reseña
  const deleteReview = async (id) => {
    try {
      await axios.delete(`${API_URL}/reviews/${id}`);
      setReviews(reviews.filter(review => review._id !== id));
    } catch (err) {
      setError('Error al eliminar la reseña');
      throw err;
    }
  };

  useEffect(() => {
    loadGames();
    loadReviews();
  }, []);

  const value = {
    games,
    reviews,
    loading,
    error,
    loadGames,
    loadReviews,
    addGame,
    updateGame,
    deleteGame,
    addReview,
    updateReview,
    deleteReview
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};


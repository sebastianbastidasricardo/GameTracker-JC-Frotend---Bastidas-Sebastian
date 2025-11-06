import React, { useState, useContext } from 'react';
import { GameContext } from '../context/GameContext';
import FormularioReseña from './FormularioReseña';
import './ListaReseñas.css';

const ListaReseñas = () => {
  const { reviews, games, loading } = useContext(GameContext);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

  const handleEdit = (review) => {
    setEditingReview(review);
    setSelectedGame(review.juegoId);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingReview(null);
    setSelectedGame(null);
  };

  const handleNewReview = () => {
    setEditingReview(null);
    setSelectedGame(null);
    setShowForm(true);
  };

  if (loading) {
    return <div className="loading">Cargando reseñas...</div>;
  }

  return (
    <div className="reseñas-container">
      <div className="reseñas-header">
        <h1>⭐ Mis Reseñas</h1>
        <button className="btn-primary" onClick={handleNewReview}>
          ➕ Nueva Reseña
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="empty-state">
          <p>📝 No tienes reseñas aún</p>
          <p>Crea tu primera reseña para comenzar</p>
        </div>
      ) : (
        <div className="reseñas-list">
          {reviews.map(review => (
            <div key={review._id} className="reseña-card">
              <div className="reseña-header-card">
                <div className="reseña-juego-info">
                  <h3>{review.juegoId?.titulo || 'Juego eliminado'}</h3>
                  <p className="reseña-fecha">
                    {new Date(review.fechaCreacion).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="reseña-puntuacion">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < review.puntuacion ? 'estrella activa' : 'estrella'}
                    >
                      ⭐
                    </span>
                  ))}
                  <span className="puntuacion-numero">{review.puntuacion}/5</span>
                </div>
              </div>

              <div className="reseña-detalles">
                <div className="detalle-item">
                  <strong>⏱️ Horas Jugadas:</strong> {review.horasJugadas}h
                </div>
                <div className="detalle-item">
                  <strong>🎯 Dificultad:</strong> {review.dificultad}
                </div>
                <div className="detalle-item">
                  <strong>👍 Recomendaría:</strong>{' '}
                  {review.recomendaria ? '✅ Sí' : '❌ No'}
                </div>
              </div>

              <div className="reseña-texto">
                <p>{review.textoReseña}</p>
              </div>

              <div className="reseña-acciones">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(review)}
                >
                  ✏️ Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <FormularioReseña
              review={editingReview}
              selectedGame={selectedGame}
              onClose={handleCloseForm}
              games={games}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaReseñas;


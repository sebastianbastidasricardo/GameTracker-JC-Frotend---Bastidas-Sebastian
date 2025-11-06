import React, { useState, useContext, useEffect } from 'react';
import { GameContext } from '../context/GameContext';
import './FormularioReseña.css';

const FormularioReseña = ({ review, selectedGame, onClose, games }) => {
  const { addReview, updateReview } = useContext(GameContext);
  const [formData, setFormData] = useState({
    juegoId: selectedGame?._id || '',
    puntuacion: 5,
    textoReseña: '',
    horasJugadas: 0,
    dificultad: 'Normal',
    recomendaria: true
  });
  const [errors, setErrors] = useState({});
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    if (review) {
      setFormData({
        juegoId: review.juegoId?._id || review.juegoId || '',
        puntuacion: review.puntuacion || 5,
        textoReseña: review.textoReseña || '',
        horasJugadas: review.horasJugadas || 0,
        dificultad: review.dificultad || 'Normal',
        recomendaria: review.recomendaria !== undefined ? review.recomendaria : true
      });
    } else if (selectedGame) {
      setFormData(prev => ({ ...prev, juegoId: selectedGame._id }));
    }
  }, [review, selectedGame]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleStarClick = (rating) => {
    setFormData(prev => ({ ...prev, puntuacion: rating }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.juegoId) {
      newErrors.juegoId = 'Debes seleccionar un juego';
    }
    if (!formData.textoReseña.trim()) {
      newErrors.textoReseña = 'El texto de la reseña es obligatorio';
    }
    if (formData.horasJugadas < 0) {
      newErrors.horasJugadas = 'Las horas no pueden ser negativas';
    }
    if (formData.puntuacion < 1 || formData.puntuacion > 5) {
      newErrors.puntuacion = 'La puntuación debe estar entre 1 y 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      if (review) {
        await updateReview(review._id, formData);
      } else {
        await addReview(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Error al guardar la reseña';
      setErrors({ submit: errorMessage });
    }
  };

  const dificultades = ['Fácil', 'Normal', 'Difícil'];

  return (
    <div className="formulario-reseña">
      <div className="form-header">
        <h2>{review ? '✏️ Editar Reseña' : '⭐ Nueva Reseña'}</h2>
        <button className="btn-close" onClick={onClose}>✕</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="juegoId">Juego *</label>
          <select
            id="juegoId"
            name="juegoId"
            value={formData.juegoId}
            onChange={handleChange}
            className={errors.juegoId ? 'error' : ''}
            disabled={!!selectedGame}
          >
            <option value="">Selecciona un juego</option>
            {games.map(game => (
              <option key={game._id} value={game._id}>
                {game.titulo}
              </option>
            ))}
          </select>
          {errors.juegoId && <span className="error-message">{errors.juegoId}</span>}
        </div>

        <div className="form-group">
          <label>Puntuación *</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-button ${star <= (hoveredStar || formData.puntuacion) ? 'active' : ''}`}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                aria-label={`Calificar ${star} estrella${star > 1 ? 's' : ''}`}
              >
                ⭐
              </button>
            ))}
            <span className="puntuacion-display">{formData.puntuacion}/5</span>
          </div>
          {errors.puntuacion && <span className="error-message">{errors.puntuacion}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="horasJugadas">Horas Jugadas *</label>
            <input
              type="number"
              id="horasJugadas"
              name="horasJugadas"
              value={formData.horasJugadas}
              onChange={handleChange}
              className={errors.horasJugadas ? 'error' : ''}
              min="0"
              step="0.5"
            />
            {errors.horasJugadas && <span className="error-message">{errors.horasJugadas}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="dificultad">Dificultad</label>
            <select
              id="dificultad"
              name="dificultad"
              value={formData.dificultad}
              onChange={handleChange}
            >
              {dificultades.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="textoReseña">Reseña *</label>
          <textarea
            id="textoReseña"
            name="textoReseña"
            value={formData.textoReseña}
            onChange={handleChange}
            className={errors.textoReseña ? 'error' : ''}
            rows="6"
            placeholder="Escribe tu reseña detallada del juego..."
          />
          {errors.textoReseña && <span className="error-message">{errors.textoReseña}</span>}
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="recomendaria"
              checked={formData.recomendaria}
              onChange={handleChange}
            />
            <span>¿Recomendarías este juego?</span>
          </label>
        </div>

        {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-submit">
            {review ? '💾 Guardar Cambios' : '⭐ Publicar Reseña'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioReseña;


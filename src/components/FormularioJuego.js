import React, { useState, useContext, useEffect } from 'react';
import { GameContext } from '../context/GameContext';
import './FormularioJuego.css';

const FormularioJuego = ({ game, onClose }) => {
  const { addGame, updateGame } = useContext(GameContext);
  const [formData, setFormData] = useState({
    titulo: '',
    genero: '',
    plataforma: '',
    añoLanzamiento: new Date().getFullYear(),
    desarrollador: '',
    imagenPortada: '',
    descripcion: '',
    completado: false
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (game) {
      setFormData({
        titulo: game.titulo || '',
        genero: game.genero || '',
        plataforma: game.plataforma || '',
        añoLanzamiento: game.añoLanzamiento || new Date().getFullYear(),
        desarrollador: game.desarrollador || '',
        imagenPortada: game.imagenPortada || '',
        descripcion: game.descripcion || '',
        completado: game.completado || false
      });
    }
  }, [game]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    }
    if (!formData.genero.trim()) {
      newErrors.genero = 'El género es obligatorio';
    }
    if (!formData.plataforma.trim()) {
      newErrors.plataforma = 'La plataforma es obligatoria';
    }
    if (!formData.añoLanzamiento || formData.añoLanzamiento < 1970 || formData.añoLanzamiento > new Date().getFullYear() + 1) {
      newErrors.añoLanzamiento = 'El año debe ser válido';
    }
    if (!formData.desarrollador.trim()) {
      newErrors.desarrollador = 'El desarrollador es obligatorio';
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
      if (game) {
        await updateGame(game._id, formData);
      } else {
        await addGame(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
      setErrors({ submit: 'Error al guardar el juego' });
    }
  };

  const generos = ['Acción', 'Aventura', 'RPG', 'Estrategia', 'Simulación', 'Deportes', 'Carreras', 'Puzzle', 'Indie', 'Otro'];
  const plataformas = ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One', 'Nintendo Switch', 'Nintendo 3DS', 'Mobile', 'Otro'];

  return (
    <div className="formulario-juego">
      <div className="form-header">
        <h2>{game ? '✏️ Editar Juego' : '➕ Agregar Nuevo Juego'}</h2>
        <button className="btn-close" onClick={onClose}>✕</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="titulo">Título *</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className={errors.titulo ? 'error' : ''}
            placeholder="Ej: The Legend of Zelda: Breath of the Wild"
          />
          {errors.titulo && <span className="error-message">{errors.titulo}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="genero">Género *</label>
            <select
              id="genero"
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              className={errors.genero ? 'error' : ''}
            >
              <option value="">Selecciona un género</option>
              {generos.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            {errors.genero && <span className="error-message">{errors.genero}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="plataforma">Plataforma *</label>
            <select
              id="plataforma"
              name="plataforma"
              value={formData.plataforma}
              onChange={handleChange}
              className={errors.plataforma ? 'error' : ''}
            >
              <option value="">Selecciona una plataforma</option>
              {plataformas.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.plataforma && <span className="error-message">{errors.plataforma}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="añoLanzamiento">Año de Lanzamiento *</label>
            <input
              type="number"
              id="añoLanzamiento"
              name="añoLanzamiento"
              value={formData.añoLanzamiento}
              onChange={handleChange}
              className={errors.añoLanzamiento ? 'error' : ''}
              min="1970"
              max={new Date().getFullYear() + 1}
            />
            {errors.añoLanzamiento && <span className="error-message">{errors.añoLanzamiento}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="desarrollador">Desarrollador *</label>
            <input
              type="text"
              id="desarrollador"
              name="desarrollador"
              value={formData.desarrollador}
              onChange={handleChange}
              className={errors.desarrollador ? 'error' : ''}
              placeholder="Ej: Nintendo"
            />
            {errors.desarrollador && <span className="error-message">{errors.desarrollador}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="imagenPortada">URL de la Portada</label>
          <input
            type="url"
            id="imagenPortada"
            name="imagenPortada"
            value={formData.imagenPortada}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="4"
            placeholder="Describe el juego..."
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="completado"
              checked={formData.completado}
              onChange={handleChange}
            />
            <span>Marcar como completado</span>
          </label>
        </div>

        {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-submit">
            {game ? '💾 Guardar Cambios' : '➕ Agregar Juego'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioJuego;


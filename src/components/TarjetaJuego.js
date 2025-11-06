import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../context/GameContext';
import './TarjetaJuego.css';

const TarjetaJuego = ({ game, onEdit }) => {
  const { updateGame, deleteGame } = useContext(GameContext);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState('');

  // Validar y establecer la URL de la imagen
  useEffect(() => {
    if (game.imagenPortada && game.imagenPortada.trim() !== '') {
      const url = game.imagenPortada.trim();
      // Validar que sea una URL válida
      try {
        new URL(url);
        setImageSrc(url);
        setImageError(false);
        setImageLoading(true);
      } catch (e) {
        // URL inválida
        console.warn('URL de imagen inválida:', url);
        setImageSrc('');
        setImageError(true);
        setImageLoading(false);
      }
    } else {
      setImageSrc('');
      setImageError(true);
      setImageLoading(false);
    }
  }, [game.imagenPortada]);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
    console.log('✅ Imagen cargada correctamente:', game.imagenPortada);
  };

  const handleImageError = (e) => {
    console.warn('❌ Error al cargar imagen:', game.imagenPortada);
    setImageError(true);
    setImageLoading(false);
    // Prevenir bucle infinito
    if (e.target.src !== 'https://via.placeholder.com/300x400?text=No+Image') {
      e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
    }
  };

  const handleToggleCompletado = async () => {
    try {
      await updateGame(game._id, { ...game, completado: !game.completado });
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de eliminar "${game.titulo}"?`)) {
      try {
        await deleteGame(game._id);
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  // Determinar qué imagen mostrar
  const displayImage = imageError || !imageSrc 
    ? 'https://via.placeholder.com/300x400?text=No+Image' 
    : imageSrc;

  return (
    <div className={`tarjeta-juego ${game.completado ? 'completado' : ''}`}>
      <div className="tarjeta-imagen">
        {imageLoading && imageSrc && (
          <div className="image-loading">
            <div className="spinner"></div>
            <p>Cargando imagen...</p>
          </div>
        )}
        <img 
          src={displayImage}
          alt={game.titulo}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageLoading && imageSrc ? 'none' : 'block' }}
        />
        {game.completado && (
          <div className="badge-completado">✅ Completado</div>
        )}
      </div>
      
      <div className="tarjeta-contenido">
        <h3 className="tarjeta-titulo">{game.titulo}</h3>
        <div className="tarjeta-info">
          <p><strong>Género:</strong> {game.genero}</p>
          <p><strong>Plataforma:</strong> {game.plataforma}</p>
          <p><strong>Año:</strong> {game.añoLanzamiento}</p>
          <p><strong>Desarrollador:</strong> {game.desarrollador}</p>
        </div>
        
        {game.descripcion && (
          <p className="tarjeta-descripcion">{game.descripcion}</p>
        )}

        <div className="tarjeta-acciones">
          <button
            className={`btn-toggle ${game.completado ? 'completado' : ''}`}
            onClick={handleToggleCompletado}
          >
            {game.completado ? '✅ Completado' : '⏳ Por completar'}
          </button>
          <button
            className="btn-edit"
            onClick={() => onEdit(game)}
          >
            ✏️ Editar
          </button>
          <button
            className="btn-delete"
            onClick={handleDelete}
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TarjetaJuego;

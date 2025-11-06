import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import './TarjetaJuego.css';

const TarjetaJuego = ({ game, onEdit }) => {
  const { updateGame, deleteGame } = useContext(GameContext);

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

  return (
    <div className={`tarjeta-juego ${game.completado ? 'completado' : ''}`}>
      <div className="tarjeta-imagen">
        <img 
          src={game.imagenPortada || 'https://via.placeholder.com/300x400?text=No+Image'} 
          alt={game.titulo}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
          }}
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


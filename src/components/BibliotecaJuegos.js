import React, { useState, useContext } from 'react';
import { GameContext } from '../context/GameContext';
import TarjetaJuego from './TarjetaJuego';
import FormularioJuego from './FormularioJuego';
import './BibliotecaJuegos.css';

const BibliotecaJuegos = () => {
  const { games, loading, error } = useContext(GameContext);
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    genero: '',
    plataforma: '',
    completado: ''
  });

  // Filtrar juegos
  const filteredGames = games.filter(game => {
    const matchSearch = game.titulo.toLowerCase().includes(filters.search.toLowerCase()) ||
                       game.desarrollador.toLowerCase().includes(filters.search.toLowerCase());
    const matchGenero = !filters.genero || game.genero === filters.genero;
    const matchPlataforma = !filters.plataforma || game.plataforma === filters.plataforma;
    const matchCompletado = filters.completado === '' || 
                           (filters.completado === 'true' && game.completado) ||
                           (filters.completado === 'false' && !game.completado);
    
    return matchSearch && matchGenero && matchPlataforma && matchCompletado;
  });

  // Obtener valores únicos para filtros
  const generos = [...new Set(games.map(g => g.genero))].sort();
  const plataformas = [...new Set(games.map(g => g.plataforma))].sort();

  const handleEdit = (game) => {
    setEditingGame(game);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGame(null);
  };

  if (loading) {
    return <div className="loading">Cargando juegos...</div>;
  }

  return (
    <div className="biblioteca-container">
      <div className="biblioteca-header">
        <h1>📚 Mi Biblioteca de Videojuegos</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          ➕ Agregar Juego
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filtros */}
      <div className="filtros-container">
        <input
          type="text"
          placeholder="🔍 Buscar por título o desarrollador..."
          className="search-input"
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
        />
        
        <select
          className="filter-select"
          value={filters.genero}
          onChange={(e) => setFilters({...filters, genero: e.target.value})}
        >
          <option value="">Todos los géneros</option>
          {generos.map(genero => (
            <option key={genero} value={genero}>{genero}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filters.plataforma}
          onChange={(e) => setFilters({...filters, plataforma: e.target.value})}
        >
          <option value="">Todas las plataformas</option>
          {plataformas.map(plataforma => (
            <option key={plataforma} value={plataforma}>{plataforma}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filters.completado}
          onChange={(e) => setFilters({...filters, completado: e.target.value})}
        >
          <option value="">Todos</option>
          <option value="true">Completados</option>
          <option value="false">Por completar</option>
        </select>
      </div>

      {/* Estadísticas rápidas */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{games.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Completados:</span>
          <span className="stat-value">{games.filter(g => g.completado).length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Mostrando:</span>
          <span className="stat-value">{filteredGames.length}</span>
        </div>
      </div>

      {/* Grid de juegos */}
      {filteredGames.length === 0 ? (
        <div className="empty-state">
          <p>🎮 No se encontraron juegos</p>
          <p>Agrega tu primer juego para comenzar</p>
        </div>
      ) : (
        <div className="juegos-grid">
          {filteredGames.map(game => (
            <TarjetaJuego
              key={game._id}
              game={game}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Modal de formulario */}
      {showForm && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <FormularioJuego
              game={editingGame}
              onClose={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BibliotecaJuegos;


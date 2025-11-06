import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import './EstadisticasPersonales.css';

const EstadisticasPersonales = () => {
  const { games, reviews } = useContext(GameContext);

  // Calcular estadísticas
  const totalJuegos = games.length;
  const juegosCompletados = games.filter(g => g.completado).length;
  const juegosPorCompletar = totalJuegos - juegosCompletados;
  const porcentajeCompletados = totalJuegos > 0 
    ? Math.round((juegosCompletados / totalJuegos) * 100) 
    : 0;

  // Horas totales jugadas
  const horasTotales = reviews.reduce((sum, review) => sum + (review.horasJugadas || 0), 0);

  // Géneros más jugados
  const generosCount = {};
  games.forEach(game => {
    generosCount[game.genero] = (generosCount[game.genero] || 0) + 1;
  });
  const generosOrdenados = Object.entries(generosCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Plataformas más usadas
  const plataformasCount = {};
  games.forEach(game => {
    plataformasCount[game.plataforma] = (plataformasCount[game.plataforma] || 0) + 1;
  });
  const plataformasOrdenadas = Object.entries(plataformasCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Puntuación promedio
  const puntuacionPromedio = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + (review.puntuacion || 0), 0) / reviews.length).toFixed(1)
    : 0;

  // Reseñas por dificultad
  const dificultadesCount = {
    'Fácil': reviews.filter(r => r.dificultad === 'Fácil').length,
    'Normal': reviews.filter(r => r.dificultad === 'Normal').length,
    'Difícil': reviews.filter(r => r.dificultad === 'Difícil').length
  };

  // Juegos recomendados
  const juegosRecomendados = reviews.filter(r => r.recomendaria).length;
  const porcentajeRecomendados = reviews.length > 0
    ? Math.round((juegosRecomendados / reviews.length) * 100)
    : 0;

  return (
    <div className="estadisticas-container">
      <h1>📊 Mis Estadísticas Personales</h1>

      <div className="stats-grid">
        {/* Tarjetas principales */}
        <div className="stat-card primary">
          <div className="stat-icon">🎮</div>
          <div className="stat-content">
            <h3>Total de Juegos</h3>
            <p className="stat-value">{totalJuegos}</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Completados</h3>
            <p className="stat-value">{juegosCompletados}</p>
            <p className="stat-percentage">{porcentajeCompletados}%</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Por Completar</h3>
            <p className="stat-value">{juegosPorCompletar}</p>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <h3>Horas Totales</h3>
            <p className="stat-value">{horasTotales}h</p>
            <p className="stat-subtext">
              {horasTotales > 0 ? `≈ ${Math.round(horasTotales / 24)} días` : ''}
            </p>
          </div>
        </div>

        <div className="stat-card accent">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>Puntuación Promedio</h3>
            <p className="stat-value">{puntuacionPromedio}/5</p>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>Reseñas Escritas</h3>
            <p className="stat-value">{reviews.length}</p>
          </div>
        </div>
      </div>

      {/* Gráficos y listas */}
      <div className="charts-grid">
        {/* Géneros más jugados */}
        <div className="chart-card">
          <h3>🎯 Géneros Más Jugados</h3>
          {generosOrdenados.length > 0 ? (
            <div className="chart-list">
              {generosOrdenados.map(([genero, count], index) => (
                <div key={genero} className="chart-item">
                  <div className="chart-label">
                    <span className="chart-rank">#{index + 1}</span>
                    <span>{genero}</span>
                  </div>
                  <div className="chart-bar-container">
                    <div
                      className="chart-bar"
                      style={{
                        width: `${(count / totalJuegos) * 100}%`,
                        backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                      }}
                    />
                    <span className="chart-value">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-chart">No hay datos disponibles</p>
          )}
        </div>

        {/* Plataformas más usadas */}
        <div className="chart-card">
          <h3>🖥️ Plataformas Más Usadas</h3>
          {plataformasOrdenadas.length > 0 ? (
            <div className="chart-list">
              {plataformasOrdenadas.map(([plataforma, count], index) => (
                <div key={plataforma} className="chart-item">
                  <div className="chart-label">
                    <span className="chart-rank">#{index + 1}</span>
                    <span>{plataforma}</span>
                  </div>
                  <div className="chart-bar-container">
                    <div
                      className="chart-bar"
                      style={{
                        width: `${(count / totalJuegos) * 100}%`,
                        backgroundColor: `hsl(${index * 60 + 180}, 70%, 50%)`
                      }}
                    />
                    <span className="chart-value">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-chart">No hay datos disponibles</p>
          )}
        </div>

        {/* Reseñas por dificultad */}
        <div className="chart-card">
          <h3>🎮 Reseñas por Dificultad</h3>
          {reviews.length > 0 ? (
            <div className="difficulty-chart">
              {Object.entries(dificultadesCount).map(([dificultad, count]) => (
                <div key={dificultad} className="difficulty-item">
                  <span className="difficulty-label">{dificultad}</span>
                  <div className="difficulty-bar-container">
                    <div
                      className="difficulty-bar"
                      style={{
                        width: `${(count / reviews.length) * 100}%`,
                        backgroundColor: dificultad === 'Fácil' ? '#48bb78' : 
                                        dificultad === 'Normal' ? '#ed8936' : '#f56565'
                      }}
                    />
                    <span className="difficulty-value">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-chart">No hay reseñas disponibles</p>
          )}
        </div>

        {/* Juegos recomendados */}
        <div className="chart-card">
          <h3>👍 Recomendaciones</h3>
          <div className="recommendation-stats">
            <div className="recommendation-item">
              <span className="recommendation-label">Recomendados</span>
              <div className="recommendation-bar-container">
                <div
                  className="recommendation-bar positive"
                  style={{ width: `${porcentajeRecomendados}%` }}
                />
                <span className="recommendation-value">{juegosRecomendados} ({porcentajeRecomendados}%)</span>
              </div>
            </div>
            <div className="recommendation-item">
              <span className="recommendation-label">No Recomendados</span>
              <div className="recommendation-bar-container">
                <div
                  className="recommendation-bar negative"
                  style={{ width: `${100 - porcentajeRecomendados}%` }}
                />
                <span className="recommendation-value">
                  {reviews.length - juegosRecomendados} ({100 - porcentajeRecomendados}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasPersonales;


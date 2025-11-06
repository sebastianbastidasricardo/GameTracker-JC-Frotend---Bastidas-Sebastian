import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import BibliotecaJuegos from './components/BibliotecaJuegos';
import ListaReseñas from './components/ListaReseñas';
import EstadisticasPersonales from './components/EstadisticasPersonales';
import { GameProvider } from './context/GameContext';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <GameProvider>
      <Router>
        <div className="App">
          <nav className="navbar">
            <div className="nav-container">
              <Link to="/" className="nav-logo">
                🎮 GameTracker
              </Link>
              <div className="nav-links">
                <Link to="/" className="nav-link">Biblioteca</Link>
                <Link to="/reseñas" className="nav-link">Reseñas</Link>
                <Link to="/estadisticas" className="nav-link">Estadísticas</Link>
                <button 
                  className="dark-mode-toggle"
                  onClick={() => setDarkMode(!darkMode)}
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </div>
            </div>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<BibliotecaJuegos />} />
              <Route path="/reseñas" element={<ListaReseñas />} />
              <Route path="/estadisticas" element={<EstadisticasPersonales />} />
            </Routes>
          </main>

          <footer className="footer">
            <p>© 2025 GameTracker - Tu Biblioteca Personal de Videojuegos</p>
          </footer>
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;


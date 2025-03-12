import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BottomNavigation.css';

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="bottom-navigation">
      <Link to="/" className={`nav-item ${currentPath === '/' ? 'active' : ''}`}>
        <i className="nav-icon home-icon"></i>
        <span className="nav-text">Início</span>
      </Link>
      
      <Link to="/diaper-usage" className={`nav-item ${currentPath === '/diaper-usage' ? 'active' : ''}`}>
        <i className="nav-icon diaper-icon"></i>
        <span className="nav-text">Registrar</span>
      </Link>
      
      <Link to="/history" className={`nav-item ${currentPath === '/history' ? 'active' : ''}`}>
        <i className="nav-icon history-icon"></i>
        <span className="nav-text">Histórico</span>
      </Link>
      
      <Link to="/statistics" className={`nav-item ${currentPath === '/statistics' ? 'active' : ''}`}>
        <i className="nav-icon stats-icon"></i>
        <span className="nav-text">Estatísticas</span>
      </Link>
      
      <Link to="/predictions" className={`nav-item ${currentPath === '/predictions' ? 'active' : ''}`}>
        <i className="nav-icon prediction-icon"></i>
        <span className="nav-text">Previsões</span>
      </Link>
    </div>
  );
};

export default BottomNavigation; 
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBaby } from '../contexts/BabyContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { babies, currentBaby, selectBaby } = useBaby();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleBabySelect = (baby) => {
    selectBaby(baby);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img src="/logo192.png" alt="Logo" className="navbar-logo-img" />
            <span className="navbar-logo-text">Rastreador de Fraldas</span>
          </Link>
        </div>

        <div className="navbar-baby-selector">
          {currentBaby ? (
            <div className="current-baby" onClick={toggleMenu}>
              <span>{currentBaby.attributes.name}</span>
              <i className={`arrow ${menuOpen ? 'up' : 'down'}`}></i>
            </div>
          ) : (
            <Link to="/baby" className="add-baby-btn">
              Adicionar Bebê
            </Link>
          )}

          {menuOpen && babies.length > 0 && (
            <div className="baby-dropdown">
              {babies.map(baby => (
                <div 
                  key={baby.id} 
                  className={`baby-option ${currentBaby && currentBaby.id === baby.id ? 'active' : ''}`}
                  onClick={() => handleBabySelect(baby)}
                >
                  {baby.attributes.name}
                </div>
              ))}
              <div className="dropdown-divider"></div>
              <Link to="/baby" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                Adicionar Bebê
              </Link>
            </div>
          )}
        </div>

        <div className="navbar-user">
          <div className="user-info" onClick={toggleMenu}>
            <span>{currentUser?.username}</span>
            <i className={`arrow ${menuOpen ? 'up' : 'down'}`}></i>
          </div>

          {menuOpen && (
            <div className="user-dropdown">
              <Link to="/settings" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                Configurações
              </Link>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item" onClick={handleLogout}>
                Sair
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
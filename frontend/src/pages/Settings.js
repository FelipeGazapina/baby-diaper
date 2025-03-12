import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Settings.css';

function Settings() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState(
    localStorage.getItem('notifications') === 'true'
  );
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );
  const [syncFrequency, setSyncFrequency] = useState(
    localStorage.getItem('syncFrequency') || 'auto'
  );
  
  useEffect(() => {
    // Aplicar modo escuro se estiver ativado
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);
  
  const handleNotificationsChange = (e) => {
    const value = e.target.checked;
    setNotifications(value);
    localStorage.setItem('notifications', value);
    
    if (value && 'Notification' in window) {
      Notification.requestPermission();
    }
  };
  
  const handleDarkModeChange = (e) => {
    const value = e.target.checked;
    setDarkMode(value);
    localStorage.setItem('darkMode', value);
  };
  
  const handleSyncFrequencyChange = (e) => {
    const value = e.target.value;
    setSyncFrequency(value);
    localStorage.setItem('syncFrequency', value);
  };
  
  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
      navigate('/login');
    }
  };
  
  const clearLocalData = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados locais? Esta ação não pode ser desfeita.')) {
      // Limpar dados do IndexedDB
      if ('indexedDB' in window) {
        indexedDB.deleteDatabase('babyDiaperTracker');
      }
      
      // Limpar localStorage (exceto token de autenticação)
      const token = localStorage.getItem('token');
      localStorage.clear();
      if (token) {
        localStorage.setItem('token', token);
      }
      
      alert('Dados locais limpos com sucesso!');
    }
  };
  
  return (
    <div className="settings-page">
      <h2>Configurações</h2>
      
      <div className="settings-section">
        <h3>Conta</h3>
        
        {currentUser && (
          <div className="user-info">
            <p><strong>Usuário:</strong> {currentUser.username}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
          </div>
        )}
        
        <button onClick={handleLogout} className="btn danger">
          Sair da Conta
        </button>
      </div>
      
      <div className="settings-section">
        <h3>Preferências</h3>
        
        <div className="setting-item">
          <div className="setting-info">
            <label htmlFor="notifications">Notificações</label>
            <p className="setting-description">Receber alertas sobre previsões e lembretes</p>
          </div>
          <div className="setting-control">
            <label className="switch">
              <input
                type="checkbox"
                id="notifications"
                checked={notifications}
                onChange={handleNotificationsChange}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label htmlFor="darkMode">Modo Escuro</label>
            <p className="setting-description">Usar tema escuro no aplicativo</p>
          </div>
          <div className="setting-control">
            <label className="switch">
              <input
                type="checkbox"
                id="darkMode"
                checked={darkMode}
                onChange={handleDarkModeChange}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label htmlFor="syncFrequency">Frequência de Sincronização</label>
            <p className="setting-description">Definir com que frequência os dados são sincronizados</p>
          </div>
          <div className="setting-control">
            <select
              id="syncFrequency"
              value={syncFrequency}
              onChange={handleSyncFrequencyChange}
            >
              <option value="auto">Automático</option>
              <option value="manual">Manual</option>
              <option value="hourly">A cada hora</option>
              <option value="daily">Diariamente</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Dados</h3>
        
        <button onClick={clearLocalData} className="btn warning">
          Limpar Dados Locais
        </button>
        
        <p className="setting-description">
          Esta ação irá remover todos os dados armazenados localmente no dispositivo.
          Os dados sincronizados com o servidor não serão afetados.
        </p>
      </div>
      
      <div className="settings-section">
        <h3>Sobre</h3>
        
        <p><strong>Versão:</strong> {process.env.REACT_APP_VERSION || '0.1.0'}</p>
        <p><strong>Nome:</strong> {process.env.REACT_APP_NAME || 'Rastreador de Fraldas para Bebê'}</p>
        <p className="about-description">
          {process.env.REACT_APP_DESCRIPTION || 'Aplicativo para rastrear o uso de fraldas e o crescimento do bebê'}
        </p>
      </div>
    </div>
  );
}

export default Settings; 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useBaby } from '../contexts/BabyContext';
import { useNetwork } from '../contexts/NetworkContext';
import './Dashboard.css';

const Dashboard = () => {
  const { currentBaby, loading: babyLoading } = useBaby();
  const { isOnline } = useNetwork();
  const [todayUsage, setTodayUsage] = useState(0);
  const [weeklyUsage, setWeeklyUsage] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentBaby) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [currentBaby]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Obter uso de fraldas de hoje
      const today = new Date().toISOString().split('T')[0];
      const todayResponse = await axios.get(`/api/diaper-usages?filters[baby][id][$eq]=${currentBaby.id}&filters[date][$eq]=${today}`);
      
      const todayUsages = todayResponse.data.data;
      const totalToday = todayUsages.reduce((sum, usage) => sum + usage.attributes.quantity, 0);
      setTodayUsage(totalToday);

      // Obter uso semanal
      const weeklyResponse = await axios.get(`/api/diaper-usage-stats/${currentBaby.id}`);
      setWeeklyUsage(weeklyResponse.data.weeklyData || []);

      // Obter previsão
      const predictionResponse = await axios.get(`/api/predictions?filters[baby][id][$eq]=${currentBaby.id}&sort=createdAt:desc&pagination[limit]=1`);
      
      if (predictionResponse.data.data.length > 0) {
        setPrediction(predictionResponse.data.data[0]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  if (babyLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!currentBaby) {
    return (
      <div className="dashboard-no-baby">
        <h2>Bem-vindo ao Rastreador de Fraldas!</h2>
        <p>Para começar, adicione um bebê ao seu perfil.</p>
        <Link to="/baby" className="btn-primary">
          Adicionar Bebê
        </Link>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      {!isOnline && (
        <div className="alert alert-warning">
          Você está offline. Alguns dados podem não estar atualizados.
        </div>
      )}
      
      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <>
          <div className="dashboard-summary">
            <div className="card summary-card">
              <h3>Uso Hoje</h3>
              <div className="summary-value">{todayUsage}</div>
              <p>fraldas</p>
              <Link to="/diaper-usage" className="btn-secondary summary-action">
                Registrar Uso
              </Link>
            </div>
            
            <div className="card summary-card">
              <h3>Tamanho Atual</h3>
              <div className="summary-value">
                {currentBaby.attributes.currentSize || 'N/A'}
              </div>
              <p>baseado no peso</p>
              <Link to="/measurement" className="btn-secondary summary-action">
                Atualizar Medidas
              </Link>
            </div>
            
            <div className="card summary-card">
              <h3>Previsão Mensal</h3>
              <div className="summary-value">
                {prediction ? prediction.attributes.estimatedQuantity : 'N/A'}
              </div>
              <p>fraldas/mês</p>
              <Link to="/predictions" className="btn-secondary summary-action">
                Ver Previsões
              </Link>
            </div>
          </div>
          
          <div className="card chart-card">
            <h3>Uso Semanal</h3>
            <div className="weekly-chart">
              {weeklyUsage.length > 0 ? (
                <div className="chart-bars">
                  {weeklyUsage.map((day, index) => (
                    <div className="chart-bar-container" key={index}>
                      <div 
                        className="chart-bar" 
                        style={{ 
                          height: `${(day.quantity / Math.max(...weeklyUsage.map(d => d.quantity))) * 100}%` 
                        }}
                      >
                        <span className="chart-value">{day.quantity}</span>
                      </div>
                      <span className="chart-label">{day.day}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">Sem dados para exibir</p>
              )}
            </div>
          </div>
          
          <div className="dashboard-actions">
            <Link to="/diaper-usage" className="btn-primary action-btn">
              Registrar Uso
            </Link>
            <Link to="/measurement" className="btn-secondary action-btn">
              Registrar Medidas
            </Link>
            <Link to="/history" className="btn-secondary action-btn">
              Ver Histórico
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard; 
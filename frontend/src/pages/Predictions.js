import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/config';
import { useBaby } from '../contexts/BabyContext';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './Predictions.css';

function Predictions() {
  const { currentBaby } = useBaby();
  const navigate = useNavigate();
  
  const [predictions, setPredictions] = useState([]);
  const [daysToPredict, setDaysToPredict] = useState(30);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (currentBaby) {
      fetchPredictions();
    }
  }, [currentBaby]);
  
  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/predictions?filters[baby][id][$eq]=${currentBaby.id}&sort=startDate:desc`);
      setPredictions(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar previsões:', error);
      setError('Erro ao carregar previsões. Tente novamente.');
      setLoading(false);
    }
  };
  
  const generatePrediction = async () => {
    try {
      setGenerating(true);
      setError('');
      
      const response = await api.post('/api/generate-prediction', {
        babyId: currentBaby.id,
        daysToPredict: parseInt(daysToPredict)
      });
      
      setPredictions([response.data, ...predictions]);
      setGenerating(false);
    } catch (error) {
      console.error('Erro ao gerar previsão:', error);
      setError('Erro ao gerar previsão. Verifique se há dados suficientes de uso de fraldas e medidas.');
      setGenerating(false);
    }
  };
  
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };
  
  if (!currentBaby) {
    return (
      <div className="predictions-page">
        <h2>Nenhum bebê selecionado</h2>
        <p>Por favor, adicione um bebê para gerar previsões.</p>
        <button onClick={() => navigate('/baby')} className="btn primary">
          Adicionar Bebê
        </button>
      </div>
    );
  }
  
  return (
    <div className="predictions-page">
      <h2>Previsões para {currentBaby.attributes.name}</h2>
      
      <div className="prediction-form">
        <div className="form-group">
          <label htmlFor="daysToPredict">Período de previsão (dias)</label>
          <input
            type="number"
            id="daysToPredict"
            min="1"
            max="365"
            value={daysToPredict}
            onChange={(e) => setDaysToPredict(e.target.value)}
          />
        </div>
        
        <button 
          onClick={generatePrediction} 
          className="btn primary"
          disabled={generating}
        >
          {generating ? 'Gerando...' : 'Gerar Previsão'}
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Carregando previsões...</div>
      ) : (
        <div className="predictions-list">
          {predictions.length > 0 ? (
            predictions.map(prediction => (
              <div key={prediction.id} className="prediction-card">
                <div className="prediction-header">
                  <h3>Previsão para {formatDate(prediction.attributes.startDate)} até {formatDate(prediction.attributes.endDate)}</h3>
                </div>
                <div className="prediction-body">
                  <div className="prediction-item">
                    <span className="label">Quantidade estimada:</span>
                    <span className="value">{prediction.attributes.estimatedQuantity} fraldas</span>
                  </div>
                  <div className="prediction-item">
                    <span className="label">Tamanho estimado:</span>
                    <span className="value">{prediction.attributes.estimatedSize}</span>
                  </div>
                  <div className="prediction-item">
                    <span className="label">Média diária:</span>
                    <span className="value">
                      {Math.round(prediction.attributes.estimatedQuantity / 
                        ((new Date(prediction.attributes.endDate) - new Date(prediction.attributes.startDate)) / 
                        (1000 * 60 * 60 * 24)))} fraldas/dia
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>Nenhuma previsão encontrada.</p>
              <p>Clique em "Gerar Previsão" para criar uma nova previsão de uso de fraldas.</p>
              <p className="note">Nota: É necessário ter registros de uso de fraldas e medidas para gerar previsões precisas.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Predictions; 
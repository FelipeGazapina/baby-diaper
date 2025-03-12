import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/config';
import { useBaby } from '../contexts/BabyContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './History.css';

function History() {
  const { currentBaby } = useBaby();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('diapers');
  const [diaperUsages, setDiaperUsages] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (currentBaby) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [currentBaby, activeTab]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'diapers') {
        const response = await api.get(`/api/diaper-usages?filters[baby][id][$eq]=${currentBaby.id}&sort=date:desc`);
        setDiaperUsages(response.data.data);
      } else {
        const response = await api.get(`/api/measurements?filters[baby][id][$eq]=${currentBaby.id}&sort=date:desc`);
        setMeasurements(response.data.data);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setError('Erro ao carregar dados. Tente novamente.');
      setLoading(false);
    }
  };
  
  const handleEdit = (id) => {
    if (activeTab === 'diapers') {
      navigate(`/diaper-usage?id=${id}`);
    } else {
      navigate(`/measurement?id=${id}`);
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este registro?')) {
      return;
    }
    
    try {
      if (activeTab === 'diapers') {
        await api.delete(`/api/diaper-usages/${id}`);
        setDiaperUsages(diaperUsages.filter(item => item.id !== id));
      } else {
        await api.delete(`/api/measurements/${id}`);
        setMeasurements(measurements.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Erro ao excluir:', error);
      setError('Erro ao excluir registro. Tente novamente.');
    }
  };
  
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };
  
  if (!currentBaby) {
    return (
      <div className="history-page">
        <h2>Nenhum bebê selecionado</h2>
        <p>Por favor, adicione um bebê para visualizar o histórico.</p>
        <button onClick={() => navigate('/baby')} className="btn primary">
          Adicionar Bebê
        </button>
      </div>
    );
  }
  
  return (
    <div className="history-page">
      <h2>Histórico de {currentBaby.attributes.name}</h2>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'diapers' ? 'active' : ''}`}
          onClick={() => setActiveTab('diapers')}
        >
          Fraldas
        </button>
        <button 
          className={`tab ${activeTab === 'measurements' ? 'active' : ''}`}
          onClick={() => setActiveTab('measurements')}
        >
          Medidas
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="history-list">
          {activeTab === 'diapers' ? (
            diaperUsages.length > 0 ? (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Quantidade</th>
                    <th>Tamanho</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {diaperUsages.map(item => (
                    <tr key={item.id}>
                      <td>{formatDate(item.attributes.date)}</td>
                      <td>{item.attributes.quantity}</td>
                      <td>{item.attributes.size}</td>
                      <td className="actions">
                        <button 
                          onClick={() => handleEdit(item.id)}
                          className="btn-icon edit"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="btn-icon delete"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <p>Nenhum registro de fraldas encontrado.</p>
                <button onClick={() => navigate('/diaper-usage')} className="btn primary">
                  Adicionar Registro
                </button>
              </div>
            )
          ) : (
            measurements.length > 0 ? (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Peso (kg)</th>
                    <th>Altura (cm)</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {measurements.map(item => (
                    <tr key={item.id}>
                      <td>{formatDate(item.attributes.date)}</td>
                      <td>{item.attributes.weight}</td>
                      <td>{item.attributes.height}</td>
                      <td className="actions">
                        <button 
                          onClick={() => handleEdit(item.id)}
                          className="btn-icon edit"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="btn-icon delete"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <p>Nenhum registro de medidas encontrado.</p>
                <button onClick={() => navigate('/measurement')} className="btn primary">
                  Adicionar Medida
                </button>
              </div>
            )
          )}
        </div>
      )}
      
      <div className="add-button-container">
        <button 
          onClick={() => navigate(activeTab === 'diapers' ? '/diaper-usage' : '/measurement')}
          className="btn primary"
        >
          {activeTab === 'diapers' ? 'Novo Registro de Fraldas' : 'Nova Medida'}
        </button>
      </div>
    </div>
  );
}

export default History; 
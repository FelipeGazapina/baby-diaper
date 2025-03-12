import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/config';
import { useBaby } from '../contexts/BabyContext';
import { useNetwork } from '../contexts/NetworkContext';
import './MeasurementForm.css';

function MeasurementForm() {
  const { currentBaby } = useBaby();
  const { isOnline, saveMeasurementOffline } = useNetwork();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    baby: null
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Verificar se estamos editando um registro existente
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    
    if (id) {
      setIsEditing(true);
      fetchMeasurement(id);
    } else if (currentBaby) {
      setFormData(prev => ({ ...prev, baby: currentBaby.id }));
    }
  }, [location.search, currentBaby]);
  
  const fetchMeasurement = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/measurements/${id}`);
      const data = response.data.data.attributes;
      
      setFormData({
        date: new Date(data.date).toISOString().split('T')[0],
        weight: data.weight,
        height: data.height,
        baby: data.baby.data.id
      });
      
      setLoading(false);
    } catch (error) {
      setError('Erro ao carregar dados. Tente novamente.');
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.date || !formData.weight || !formData.height) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    try {
      setLoading(true);
      
      if (!isOnline) {
        // Salvar localmente se estiver offline
        await saveMeasurementOffline({
          ...formData,
          baby: currentBaby.id
        });
        
        navigate('/');
        return;
      }
      
      const payload = {
        data: {
          date: formData.date,
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
          baby: currentBaby.id
        }
      };
      
      if (isEditing) {
        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        await api.put(`/api/measurements/${id}`, payload);
      } else {
        await api.post('/api/measurements', payload);
      }
      
      navigate('/');
    } catch (error) {
      setError('Erro ao salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  if (!currentBaby) {
    return (
      <div className="measurement-form">
        <h2>Nenhum bebê selecionado</h2>
        <p>Por favor, adicione um bebê antes de registrar medidas.</p>
        <button onClick={() => navigate('/baby')} className="btn primary">
          Adicionar Bebê
        </button>
      </div>
    );
  }
  
  return (
    <div className="measurement-form">
      <h2>{isEditing ? 'Editar Medidas' : 'Novas Medidas'}</h2>
      
      {!isOnline && (
        <div className="offline-notice">
          Você está offline. Os dados serão sincronizados quando a conexão for restaurada.
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">Data</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="weight">Peso (kg)</label>
          <input
            type="number"
            id="weight"
            name="weight"
            step="0.01"
            min="0"
            value={formData.weight}
            onChange={handleChange}
            required
            placeholder="Ex: 3.5"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="height">Altura (cm)</label>
          <input
            type="number"
            id="height"
            name="height"
            step="0.1"
            min="0"
            value={formData.height}
            onChange={handleChange}
            required
            placeholder="Ex: 50.5"
          />
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')} className="btn secondary">
            Cancelar
          </button>
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MeasurementForm; 
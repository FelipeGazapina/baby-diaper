import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/config';
import { useBaby } from '../contexts/BabyContext';
import { useNetwork } from '../contexts/NetworkContext';
import './DiaperUsageForm.css';

function DiaperUsageForm() {
  const { currentBaby } = useBaby();
  const { isOnline, saveDiaperUsageOffline } = useNetwork();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    quantity: 1,
    size: 'P',
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
      fetchDiaperUsage(id);
    } else if (currentBaby) {
      setFormData(prev => ({ ...prev, baby: currentBaby.id }));
    }
  }, [location.search, currentBaby]);
  
  const fetchDiaperUsage = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/diaper-usages/${id}`);
      const data = response.data.data.attributes;
      
      setFormData({
        date: new Date(data.date).toISOString().split('T')[0],
        quantity: data.quantity,
        size: data.size,
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
    
    if (!formData.date || !formData.quantity || !formData.size) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    try {
      setLoading(true);
      
      if (!isOnline) {
        // Salvar localmente se estiver offline
        await saveDiaperUsageOffline({
          ...formData,
          baby: currentBaby.id
        });
        
        navigate('/');
        return;
      }
      
      const payload = {
        data: {
          date: formData.date,
          quantity: parseInt(formData.quantity),
          size: formData.size,
          baby: currentBaby.id
        }
      };
      
      if (isEditing) {
        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        await api.put(`/api/diaper-usages/${id}`, payload);
      } else {
        await api.post('/api/diaper-usages', payload);
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
      <div className="diaper-usage-form">
        <h2>Nenhum bebê selecionado</h2>
        <p>Por favor, adicione um bebê antes de registrar o uso de fraldas.</p>
        <button onClick={() => navigate('/baby')} className="btn primary">
          Adicionar Bebê
        </button>
      </div>
    );
  }
  
  return (
    <div className="diaper-usage-form">
      <h2>{isEditing ? 'Editar Registro de Fraldas' : 'Novo Registro de Fraldas'}</h2>
      
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
          <label htmlFor="quantity">Quantidade</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="size">Tamanho</label>
          <select
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
          >
            <option value="RN">RN (Recém-nascido)</option>
            <option value="P">P (Pequeno)</option>
            <option value="M">M (Médio)</option>
            <option value="G">G (Grande)</option>
            <option value="XG">XG (Extra Grande)</option>
            <option value="XXG">XXG (Extra Extra Grande)</option>
          </select>
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

export default DiaperUsageForm; 
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBaby } from '../contexts/BabyContext';
import { useNetwork } from '../contexts/NetworkContext';
import './BabyForm.css';

const BabyForm = () => {
  const { addBaby, updateBaby, currentBaby, babies } = useBaby();
  const { isOnline } = useNetwork();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [babyId, setBabyId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verificar se estamos editando um bebê existente
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    
    if (id) {
      const babyToEdit = babies.find(baby => baby.id.toString() === id);
      
      if (babyToEdit) {
        setIsEditing(true);
        setBabyId(babyToEdit.id);
        setName(babyToEdit.attributes.name);
        setBirthDate(babyToEdit.attributes.birthDate);
        setGender(babyToEdit.attributes.gender);
        
        // Se houver medidas iniciais
        if (babyToEdit.attributes.initialWeight) {
          setWeight(babyToEdit.attributes.initialWeight.toString());
        }
        
        if (babyToEdit.attributes.initialHeight) {
          setHeight(babyToEdit.attributes.initialHeight.toString());
        }
      }
    }
  }, [location.search, babies]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !birthDate || !gender) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      const babyData = {
        name,
        birthDate,
        gender,
        initialWeight: weight ? parseFloat(weight) : null,
        initialHeight: height ? parseFloat(height) : null
      };
      
      if (isEditing) {
        await updateBaby(babyId, babyData);
      } else {
        await addBaby(babyData);
      }
      
      navigate('/');
    } catch (error) {
      setError(`Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} bebê: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="baby-form-page">
      <h1 className="page-title">{isEditing ? 'Editar Bebê' : 'Adicionar Bebê'}</h1>
      
      {!isOnline && (
        <div className="alert alert-warning">
          Você está offline. Os dados serão salvos localmente e sincronizados quando a conexão for restaurada.
        </div>
      )}
      
      {error && <div className="alert alert-error">{error}</div>}
      
      <div className="form-container">
        <form onSubmit={handleSubmit} className="baby-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Nome *</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="birthDate" className="form-label">Data de Nascimento *</label>
            <input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              className="form-input"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Sexo *</label>
            <div className="gender-options">
              <label className={`gender-option ${gender === 'male' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === 'male'}
                  onChange={() => setGender('male')}
                  required
                />
                <span className="gender-icon male"></span>
                <span>Menino</span>
              </label>
              
              <label className={`gender-option ${gender === 'female' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === 'female'}
                  onChange={() => setGender('female')}
                  required
                />
                <span className="gender-icon female"></span>
                <span>Menina</span>
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="weight" className="form-label">Peso ao Nascer (kg)</label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              step="0.01"
              min="0"
              className="form-input"
              placeholder="Ex: 3.5"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="height" className="form-label">Altura ao Nascer (cm)</label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              step="0.1"
              min="0"
              className="form-input"
              placeholder="Ex: 50.5"
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancelar
            </button>
            
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
            >
              {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BabyForm; 
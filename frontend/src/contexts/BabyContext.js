import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/config';
import { useAuth } from './AuthContext';

const BabyContext = createContext();

export function useBaby() {
  return useContext(BabyContext);
}

export function BabyProvider({ children }) {
  const { currentUser } = useAuth();
  const [babies, setBabies] = useState([]);
  const [currentBaby, setCurrentBaby] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchBabies();
    } else {
      setBabies([]);
      setCurrentBaby(null);
      setLoading(false);
    }
  }, [currentUser]);

  const fetchBabies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/babies');
      const fetchedBabies = response.data.data;
      
      setBabies(fetchedBabies);
      
      // Se houver bebês, selecione o primeiro como atual
      if (fetchedBabies.length > 0) {
        const savedBabyId = localStorage.getItem('currentBabyId');
        const babyToSelect = savedBabyId 
          ? fetchedBabies.find(baby => baby.id.toString() === savedBabyId)
          : fetchedBabies[0];
          
        setCurrentBaby(babyToSelect || fetchedBabies[0]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar bebês:', error);
      setLoading(false);
    }
  };

  const addBaby = async (babyData) => {
    try {
      const response = await api.post('/api/babies', {
        data: babyData
      });
      
      const newBaby = response.data.data;
      setBabies([...babies, newBaby]);
      
      // Se for o primeiro bebê, defina-o como atual
      if (babies.length === 0) {
        setCurrentBaby(newBaby);
        localStorage.setItem('currentBabyId', newBaby.id);
      }
      
      return newBaby;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Erro ao adicionar bebê');
    }
  };

  const updateBaby = async (id, babyData) => {
    try {
      const response = await api.put(`/api/babies/${id}`, {
        data: babyData
      });
      
      const updatedBaby = response.data.data;
      
      setBabies(babies.map(baby => 
        baby.id === id ? updatedBaby : baby
      ));
      
      // Atualizar o bebê atual se for o mesmo que está sendo editado
      if (currentBaby && currentBaby.id === id) {
        setCurrentBaby(updatedBaby);
      }
      
      return updatedBaby;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Erro ao atualizar bebê');
    }
  };

  const deleteBaby = async (id) => {
    try {
      await api.delete(`/api/babies/${id}`);
      
      const updatedBabies = babies.filter(baby => baby.id !== id);
      setBabies(updatedBabies);
      
      // Se o bebê excluído for o atual, selecione outro
      if (currentBaby && currentBaby.id === id) {
        if (updatedBabies.length > 0) {
          setCurrentBaby(updatedBabies[0]);
          localStorage.setItem('currentBabyId', updatedBabies[0].id);
        } else {
          setCurrentBaby(null);
          localStorage.removeItem('currentBabyId');
        }
      }
      
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Erro ao excluir bebê');
    }
  };

  const selectBaby = (baby) => {
    setCurrentBaby(baby);
    localStorage.setItem('currentBabyId', baby.id);
  };

  const value = {
    babies,
    currentBaby,
    loading,
    fetchBabies,
    addBaby,
    updateBaby,
    deleteBaby,
    selectBaby
  };

  return (
    <BabyContext.Provider value={value}>
      {children}
    </BabyContext.Provider>
  );
} 
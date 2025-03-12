import React, { createContext, useContext, useState, useEffect } from 'react';

const NetworkContext = createContext();

export function useNetwork() {
  return useContext(NetworkContext);
}

export function NetworkProvider({ children, isOnline }) {
  const [pendingDiaperUsages, setPendingDiaperUsages] = useState([]);
  const [pendingMeasurements, setPendingMeasurements] = useState([]);

  // Carregar dados pendentes do IndexedDB quando o componente montar
  useEffect(() => {
    loadPendingData();
  }, []);

  // Tentar sincronizar dados quando a conexão for restaurada
  useEffect(() => {
    if (isOnline) {
      syncPendingData();
    }
  }, [isOnline]);

  const loadPendingData = async () => {
    try {
      const db = await openDB();
      
      // Carregar uso de fraldas pendentes
      const diaperUsageTx = db.transaction('pendingDiaperUsage', 'readonly');
      const diaperUsageStore = diaperUsageTx.objectStore('pendingDiaperUsage');
      const diaperUsages = await diaperUsageStore.getAll();
      
      // Carregar medidas pendentes
      const measurementsTx = db.transaction('pendingMeasurements', 'readonly');
      const measurementsStore = measurementsTx.objectStore('pendingMeasurements');
      const measurements = await measurementsStore.getAll();
      
      setPendingDiaperUsages(diaperUsages);
      setPendingMeasurements(measurements);
    } catch (error) {
      console.error('Erro ao carregar dados pendentes:', error);
    }
  };

  const syncPendingData = async () => {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      
      if (pendingDiaperUsages.length > 0) {
        try {
          await registration.sync.register('sync-diaper-usage');
        } catch (error) {
          console.error('Erro ao registrar sincronização de uso de fraldas:', error);
        }
      }
      
      if (pendingMeasurements.length > 0) {
        try {
          await registration.sync.register('sync-measurements');
        } catch (error) {
          console.error('Erro ao registrar sincronização de medidas:', error);
        }
      }
    } else {
      // Fallback para navegadores que não suportam Background Sync
      manualSync();
    }
  };

  const manualSync = async () => {
    // Implementação manual de sincronização para navegadores sem suporte a Background Sync
    // Esta função seria chamada quando o usuário estiver online novamente
  };

  const saveDiaperUsageOffline = async (data) => {
    try {
      const db = await openDB();
      const tx = db.transaction('pendingDiaperUsage', 'readwrite');
      const store = tx.objectStore('pendingDiaperUsage');
      
      const id = await store.add(data);
      
      const newPendingItem = { ...data, id };
      setPendingDiaperUsages([...pendingDiaperUsages, newPendingItem]);
      
      return newPendingItem;
    } catch (error) {
      console.error('Erro ao salvar uso de fraldas offline:', error);
      throw error;
    }
  };

  const saveMeasurementOffline = async (data) => {
    try {
      const db = await openDB();
      const tx = db.transaction('pendingMeasurements', 'readwrite');
      const store = tx.objectStore('pendingMeasurements');
      
      const id = await store.add(data);
      
      const newPendingItem = { ...data, id };
      setPendingMeasurements([...pendingMeasurements, newPendingItem]);
      
      return newPendingItem;
    } catch (error) {
      console.error('Erro ao salvar medida offline:', error);
      throw error;
    }
  };

  // Função para abrir o banco de dados IndexedDB
  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('babyDiaperTracker', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('pendingDiaperUsage')) {
          db.createObjectStore('pendingDiaperUsage', { keyPath: 'id', autoIncrement: true });
        }
        
        if (!db.objectStoreNames.contains('pendingMeasurements')) {
          db.createObjectStore('pendingMeasurements', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  };

  const value = {
    isOnline,
    pendingDiaperUsages,
    pendingMeasurements,
    saveDiaperUsageOffline,
    saveMeasurementOffline,
    syncPendingData
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
} 
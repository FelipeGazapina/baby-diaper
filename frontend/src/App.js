import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Importação de componentes
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DiaperUsageForm from './pages/DiaperUsageForm';
import MeasurementForm from './pages/MeasurementForm';
import History from './pages/History';
import Predictions from './pages/Predictions';
import Settings from './pages/Settings';
import Statistics from './pages/Statistics';
import BabyForm from './pages/BabyForm';
import Notifications from './pages/Notifications';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import BottomNavigation from './components/BottomNavigation';
import { AuthProvider } from './contexts/AuthContext';
import { BabyProvider } from './contexts/BabyContext';
import { NetworkProvider } from './contexts/NetworkContext';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Monitorar o estado da conexão
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AuthProvider>
      <BabyProvider>
        <NetworkProvider isOnline={isOnline}>
          <Router>
            <div className="app">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={
                  <PrivateRoute>
                    <div className="app-container">
                      <Navbar />
                      <div className="content">
                        <Dashboard />
                      </div>
                      <BottomNavigation />
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/diaper-usage" element={
                  <PrivateRoute>
                    <div className="app-container">
                      <Navbar />
                      <div className="content">
                        <DiaperUsageForm />
                      </div>
                      <BottomNavigation />
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/measurement" element={
                  <PrivateRoute>
                    <div className="app-container">
                      <Navbar />
                      <div className="content">
                        <MeasurementForm />
                      </div>
                      <BottomNavigation />
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/history" element={
                  <PrivateRoute>
                    <div className="app-container">
                      <Navbar />
                      <div className="content">
                        <History />
                      </div>
                      <BottomNavigation />
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/predictions" element={
                  <PrivateRoute>
                    <div className="app-container">
                      <Navbar />
                      <div className="content">
                        <Predictions />
                      </div>
                      <BottomNavigation />
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/statistics" element={
                  <PrivateRoute>
                    <div className="app-container">
                      <Navbar />
                      <div className="content">
                        <Statistics />
                      </div>
                      <BottomNavigation />
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/baby" element={
                  <PrivateRoute>
                    <div className="app-container">
                      <Navbar />
                      <div className="content">
                        <BabyForm />
                      </div>
                      <BottomNavigation />
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/settings" element={
                  <PrivateRoute>
                    <div className="app-container">
                      <Navbar />
                      <div className="content">
                        <Settings />
                      </div>
                      <BottomNavigation />
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/notifications" element={
                  <PrivateRoute>
                    <div className="app-container">
                      <Navbar />
                      <div className="content">
                        <Notifications />
                      </div>
                      <BottomNavigation />
                    </div>
                  </PrivateRoute>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              
              {!isOnline && (
                <div className="offline-banner">
                  Você está offline. Alguns recursos podem não estar disponíveis.
                </div>
              )}
            </div>
          </Router>
        </NetworkProvider>
      </BabyProvider>
    </AuthProvider>
  );
}

export default App; 
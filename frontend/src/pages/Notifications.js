import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './Notifications.css';

function Notifications() {
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simular carregamento de notificações
    setTimeout(() => {
      const storedNotifications = localStorage.getItem('notifications_data');
      
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      } else {
        // Notificações de exemplo
        const exampleNotifications = [
          {
            id: 1,
            type: 'prediction',
            title: 'Nova previsão disponível',
            message: 'Uma nova previsão de uso de fraldas foi gerada para o próximo mês.',
            date: new Date().toISOString(),
            read: false,
            actionUrl: '/predictions'
          },
          {
            id: 2,
            type: 'size',
            title: 'Mudança de tamanho em breve',
            message: 'Seu bebê provavelmente precisará mudar para o tamanho M nas próximas semanas.',
            date: new Date(Date.now() - 86400000).toISOString(), // Ontem
            read: true,
            actionUrl: '/statistics'
          },
          {
            id: 3,
            type: 'reminder',
            title: 'Lembrete de medição',
            message: 'Já faz 30 dias desde a última medição de peso e altura do seu bebê.',
            date: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
            read: false,
            actionUrl: '/measurement'
          }
        ];
        
        setNotifications(exampleNotifications);
        localStorage.setItem('notifications_data', JSON.stringify(exampleNotifications));
      }
      
      setLoading(false);
    }, 1000);
  }, []);
  
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications_data', JSON.stringify(updatedNotifications));
  };
  
  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    navigate(notification.actionUrl);
  };
  
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications_data', JSON.stringify(updatedNotifications));
  };
  
  const clearAllNotifications = () => {
    if (window.confirm('Tem certeza que deseja limpar todas as notificações?')) {
      setNotifications([]);
      localStorage.setItem('notifications_data', JSON.stringify([]));
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hoje';
    } else if (diffDays === 1) {
      return 'Ontem';
    } else if (diffDays < 7) {
      return `${diffDays} dias atrás`;
    } else {
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    }
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'prediction':
        return '📊';
      case 'size':
        return '👶';
      case 'reminder':
        return '⏰';
      default:
        return '📣';
    }
  };
  
  return (
    <div className="notifications-page">
      <h2>Notificações</h2>
      
      {loading ? (
        <div className="loading">Carregando notificações...</div>
      ) : (
        <>
          {notifications.length > 0 ? (
            <>
              <div className="notifications-actions">
                <button onClick={markAllAsRead} className="btn secondary">
                  Marcar todas como lidas
                </button>
                <button onClick={clearAllNotifications} className="btn danger">
                  Limpar todas
                </button>
              </div>
              
              <div className="notifications-list">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <div className="notification-header">
                        <h3>{notification.title}</h3>
                        <span className="notification-date">{formatDate(notification.date)}</span>
                      </div>
                      <p className="notification-message">{notification.message}</p>
                    </div>
                    {!notification.read && <div className="unread-indicator"></div>}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>Você não tem notificações.</p>
              <p>As notificações sobre previsões, lembretes e alertas aparecerão aqui.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Notifications; 
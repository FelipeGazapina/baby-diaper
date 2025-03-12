import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/config';
import { useBaby } from '../contexts/BabyContext';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './Statistics.css';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Statistics() {
  const { currentBaby } = useBaby();
  const navigate = useNavigate();
  
  const [diaperUsages, setDiaperUsages] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (currentBaby) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [currentBaby, period]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Buscar uso de fraldas
      const diaperResponse = await api.get(`/api/diaper-usages?filters[baby][id][$eq]=${currentBaby.id}&sort=date:desc`);
      setDiaperUsages(diaperResponse.data.data);
      
      // Buscar medidas
      const measurementsResponse = await api.get(`/api/measurements?filters[baby][id][$eq]=${currentBaby.id}&sort=date:desc`);
      setMeasurements(measurementsResponse.data.data);
      
      // Buscar estatísticas
      const statsResponse = await api.get(`/api/diaper-usage-stats/${currentBaby.id}`);
      setStats(statsResponse.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setError('Erro ao carregar dados. Tente novamente.');
      setLoading(false);
    }
  };
  
  const getChartData = () => {
    // Determinar o intervalo de datas com base no período selecionado
    const today = new Date();
    let startDate;
    
    switch (period) {
      case 'week':
        startDate = subDays(today, 7);
        break;
      case 'month':
        startDate = subDays(today, 30);
        break;
      case 'year':
        startDate = subDays(today, 365);
        break;
      default:
        startDate = subDays(today, 7);
    }
    
    // Criar um array com todas as datas no intervalo
    const dateRange = eachDayOfInterval({ start: startDate, end: today });
    
    // Formatar as datas para exibição
    const labels = dateRange.map(date => format(date, 'dd/MM', { locale: ptBR }));
    
    // Calcular a quantidade de fraldas usadas por dia
    const diaperData = dateRange.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const usagesOnDate = diaperUsages.filter(usage => 
        usage.attributes.date.startsWith(dateStr)
      );
      
      return usagesOnDate.reduce((sum, usage) => sum + usage.attributes.quantity, 0);
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Fraldas por Dia',
          data: diaperData,
          borderColor: '#4a90e2',
          backgroundColor: 'rgba(74, 144, 226, 0.2)',
          tension: 0.1,
        },
      ],
    };
  };
  
  const getSizeDistributionData = () => {
    const sizeCount = {
      'RN': 0,
      'P': 0,
      'M': 0,
      'G': 0,
      'XG': 0,
      'XXG': 0
    };
    
    diaperUsages.forEach(usage => {
      const size = usage.attributes.size;
      if (sizeCount.hasOwnProperty(size)) {
        sizeCount[size] += usage.attributes.quantity;
      }
    });
    
    return {
      labels: Object.keys(sizeCount),
      datasets: [
        {
          label: 'Quantidade por Tamanho',
          data: Object.values(sizeCount),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  const getGrowthChartData = () => {
    if (!measurements || measurements.length === 0) {
      return null;
    }
    
    // Ordenar medidas por data
    const sortedMeasurements = [...measurements].sort((a, b) => 
      new Date(a.attributes.date) - new Date(b.attributes.date)
    );
    
    const labels = sortedMeasurements.map(m => 
      format(new Date(m.attributes.date), 'dd/MM/yy', { locale: ptBR })
    );
    
    return {
      labels,
      datasets: [
        {
          label: 'Peso (kg)',
          data: sortedMeasurements.map(m => m.attributes.weight),
          borderColor: '#4a90e2',
          backgroundColor: 'rgba(74, 144, 226, 0.2)',
          yAxisID: 'y',
        },
        {
          label: 'Altura (cm)',
          data: sortedMeasurements.map(m => m.attributes.height),
          borderColor: '#f39c12',
          backgroundColor: 'rgba(243, 156, 18, 0.2)',
          yAxisID: 'y1',
        },
      ],
    };
  };
  
  const growthChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Peso (kg)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Altura (cm)',
        },
      },
    },
  };
  
  if (!currentBaby) {
    return (
      <div className="statistics-page">
        <h2>Nenhum bebê selecionado</h2>
        <p>Por favor, adicione um bebê para visualizar estatísticas.</p>
        <button onClick={() => navigate('/baby')} className="btn primary">
          Adicionar Bebê
        </button>
      </div>
    );
  }
  
  return (
    <div className="statistics-page">
      <h2>Estatísticas de {currentBaby.attributes.name}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Carregando estatísticas...</div>
      ) : (
        <>
          {stats && (
            <div className="stats-summary">
              <div className="stat-card">
                <h3>Média Diária</h3>
                <div className="stat-value">{Math.round(stats.dailyAverage)} fraldas</div>
              </div>
              <div className="stat-card">
                <h3>Média Semanal</h3>
                <div className="stat-value">{Math.round(stats.weeklyAverage)} fraldas</div>
              </div>
              <div className="stat-card">
                <h3>Média Mensal</h3>
                <div className="stat-value">{Math.round(stats.monthlyAverage)} fraldas</div>
              </div>
              <div className="stat-card">
                <h3>Tamanho Atual</h3>
                <div className="stat-value">{stats.currentSize || 'N/A'}</div>
              </div>
            </div>
          )}
          
          <div className="chart-container">
            <div className="chart-header">
              <h3>Uso de Fraldas</h3>
              <div className="period-selector">
                <button 
                  className={`period-btn ${period === 'week' ? 'active' : ''}`}
                  onClick={() => setPeriod('week')}
                >
                  Semana
                </button>
                <button 
                  className={`period-btn ${period === 'month' ? 'active' : ''}`}
                  onClick={() => setPeriod('month')}
                >
                  Mês
                </button>
                <button 
                  className={`period-btn ${period === 'year' ? 'active' : ''}`}
                  onClick={() => setPeriod('year')}
                >
                  Ano
                </button>
              </div>
            </div>
            
            {diaperUsages.length > 0 ? (
              <Line data={getChartData()} />
            ) : (
              <div className="empty-chart">
                <p>Sem dados de uso de fraldas para exibir.</p>
              </div>
            )}
          </div>
          
          <div className="chart-container">
            <h3>Distribuição por Tamanho</h3>
            {diaperUsages.length > 0 ? (
              <Bar data={getSizeDistributionData()} />
            ) : (
              <div className="empty-chart">
                <p>Sem dados de uso de fraldas para exibir.</p>
              </div>
            )}
          </div>
          
          <div className="chart-container">
            <h3>Crescimento</h3>
            {measurements.length > 0 ? (
              <Line data={getGrowthChartData()} options={growthChartOptions} />
            ) : (
              <div className="empty-chart">
                <p>Sem dados de medidas para exibir.</p>
              </div>
            )}
          </div>
          
          {stats && stats.nextSizeEstimation && (
            <div className="next-size-prediction">
              <h3>Previsão de Próximo Tamanho</h3>
              <p>
                Estimamos que {currentBaby.attributes.name} precisará do tamanho{' '}
                <strong>{stats.nextSizeEstimation.size}</strong> por volta de{' '}
                <strong>{format(new Date(stats.nextSizeEstimation.estimatedDate), 'dd/MM/yyyy', { locale: ptBR })}</strong>.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Statistics; 
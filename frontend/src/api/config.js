import axios from 'axios';

// Configuração base do axios
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:1337';

// Configurar o axios com a URL base
axios.defaults.baseURL = API_URL;

// Flag para indicar se estamos usando dados mockados
const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true' || !API_URL.includes('localhost');

// Interceptor para adicionar o token de autenticação
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Se estamos usando mock e o erro é de conexão, podemos retornar dados mockados
    if (USE_MOCK && (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED')) {
      console.warn('API não disponível, usando dados mockados');
      return handleMockResponse(error.config);
    }
    
    // Tratar erros de autenticação (401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Função para lidar com respostas mockadas
function handleMockResponse(config) {
  const { url, method } = config;
  
  // Login mockado
  if (url === '/api/auth/local' && method === 'post') {
    return Promise.resolve({
      data: {
        jwt: 'mock-jwt-token',
        user: {
          id: 1,
          username: 'usuario_teste',
          email: 'teste@exemplo.com'
        }
      }
    });
  }
  
  // Registro mockado
  if (url === '/api/auth/local/register' && method === 'post') {
    return Promise.resolve({
      data: {
        jwt: 'mock-jwt-token',
        user: {
          id: 1,
          username: 'novo_usuario',
          email: 'novo@exemplo.com'
        }
      }
    });
  }
  
  // Dados do usuário mockados
  if (url === '/api/users/me') {
    return Promise.resolve({
      data: {
        id: 1,
        username: 'usuario_teste',
        email: 'teste@exemplo.com'
      }
    });
  }
  
  // Lista de bebês mockada
  if (url === '/api/babies' && method === 'get') {
    return Promise.resolve({
      data: {
        data: [
          {
            id: 1,
            attributes: {
              name: 'Bebê Teste',
              birthDate: '2023-01-15',
              gender: 'male'
            }
          }
        ]
      }
    });
  }
  
  // Adicionar bebê mockado
  if (url === '/api/babies' && method === 'post') {
    const requestData = JSON.parse(config.data);
    return Promise.resolve({
      data: {
        data: {
          id: 2,
          attributes: {
            ...requestData.data,
            createdAt: new Date().toISOString()
          }
        }
      }
    });
  }
  
  // Resposta padrão para outros endpoints
  return Promise.resolve({
    data: {
      message: 'Dados mockados para desenvolvimento'
    }
  });
}

export default axios; 
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/api/users/me');
      setCurrentUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      logout();
      setLoading(false);
    }
  };

  const login = async (identifier, password) => {
    try {
      const response = await api.post('/api/auth/local', {
        identifier,
        password,
      });
      
      const { jwt, user } = response.data;
      
      localStorage.setItem('token', jwt);
      setToken(jwt);
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Erro ao fazer login');
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post('/api/auth/local/register', {
        username,
        email,
        password,
      });
      
      const { jwt, user } = response.data;
      
      localStorage.setItem('token', jwt);
      setToken(jwt);
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Erro ao registrar');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  };

  const forgotPassword = async (email) => {
    try {
      await api.post('/api/auth/forgot-password', {
        email,
      });
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Erro ao solicitar redefinição de senha');
    }
  };

  const resetPassword = async (code, password, passwordConfirmation) => {
    try {
      await api.post('/api/auth/reset-password', {
        code,
        password,
        passwordConfirmation,
      });
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Erro ao redefinir senha');
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 
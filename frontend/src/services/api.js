// src/services/api.js
import axios from 'axios';

// Criação de uma instância personalizada do Axios
const api = axios.create({
  baseURL: 'http://localhost:3000', // Substitua pela URL base correta do seu backend
});

// Interceptor para adicionar o token de autenticação a todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Certifique-se de armazenar o token após o login
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta globalmente (opcional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aqui você pode adicionar lógica para lidar com erros globais, como redirecionar para a página de login se o token expirou
    return Promise.reject(error);
  }
);

export default api;

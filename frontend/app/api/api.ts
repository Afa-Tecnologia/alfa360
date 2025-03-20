// utils/api.ts
import useAuthStore from '@/stores/authStore';
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Acessa localStorage apenas no cliente
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-storage');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta para capturar erro 401 e redirecionar para login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-storage');
        window.location.href = '/login'; // Redireciona para a página de login
      }
    }
    return Promise.reject(error);
  }
);

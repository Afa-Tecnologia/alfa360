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

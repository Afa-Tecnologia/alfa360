// // utils/api.ts
// import useAuthStore from '@/stores/authStore';
// import axios from 'axios';
// import { getAuthToken, removeAuthToken } from './auth';

// export const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// });

// api.interceptors.request.use(
//   async (config) => {

//     const token = await getAuthToken();
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Interceptor de resposta para capturar erro 401 e redirecionar para login
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       removeAuthToken();
//       window.location.href = '/login'; // Redireciona para a página de login
//     }
//     return Promise.reject(error);
//   }
// );

// utils/api.ts

const REFRESH_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/refresh`;
import axios, { AxiosError } from 'axios';
import {
  getAuthToken,
  getRefreshToken,
  removeAuthToken,
  removeRefreshToken,
} from './auth';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Importante para cookies
});

// Variável para controlar se uma operação de refresh está em andamento
let isRefreshing = false;
// Fila de requisições pendentes que aguardam o refresh do token
let failedQueue: any[] = [];

// Função para processar a fila de requisições pendentes
const processQueue = (error: any, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta para capturar erro 401 e tentar refresh token
api.interceptors.response.use(
 (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        await api.post('/refresh', { refresh_token: refreshToken });

        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        removeAuthToken();
        removeRefreshToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

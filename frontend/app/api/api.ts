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
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 (não autorizado) e não for uma requisição de refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/refresh')
    ) {
      // Se já estiver realizando refresh, adiciona à fila
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('tentando renovar token');
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
          console.log('Refresh token não encontrado');
          removeAuthToken(); // Limpa o token de acesso que provavelmente está inválido
          removeRefreshToken(); // Limpa o token de refresh que provavelmente está inválido
          throw new Error('Refresh token não encontrado');
        }

        // Tenta renovar o token
        const response = await api.post('/refresh', {
          refresh_token: refreshToken,
        });

        // Se o refresh foi bem-sucedido, atualiza o token e repete a requisição original
        if (response.data && response.data.access_token) {
          // Os cookies são gerenciados automaticamente pelo navegador
          // devido à configuração withCredentials: true

          // Processa a fila de requisições pendentes
          processQueue(null, response.data.access_token);

          // Repete a requisição original com o novo token
          originalRequest.headers['Authorization'] =
            `Bearer ${response.data.access_token}`;
          return api(originalRequest);
        } else {
          console.log('Falha ao renovar token');
          throw new Error('Falha ao renovar token');
        }
      } catch (refreshError) {
        // Processa a fila com erro
        processQueue(refreshError, null);

        removeAuthToken();
        removeRefreshToken();

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Para outros erros ou se o refresh falhar
    return Promise.reject(error);
  }
);

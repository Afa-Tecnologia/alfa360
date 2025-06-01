import axios, { AxiosError } from 'axios';
import {
  getAuthToken,
  getRefreshToken,
  removeAuthToken,
  removeRefreshToken,
  // Caso você precise salvar o novo token após o refresh
} from './auth';

const REFRESH_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/refresh`;

// Instância principal com interceptores
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Instância sem interceptores para fazer refresh
const plainAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

// Interceptor de requisição para incluir o token
api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta para capturar erro 401 e tentar refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    const isUnauthorized = error.response?.status === 401;
    const isRefreshEndpoint = originalRequest?.url?.includes('/refresh');
    const alreadyRetried = originalRequest._retry;

    // Se for 401 e não é tentativa de refresh
    if (isUnauthorized && !isRefreshEndpoint) {
      // Evita loop
      if (alreadyRetried) {
        await removeAuthToken();
        await removeRefreshToken();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      const refreshToken = await getRefreshToken();

      // Se não tem refresh token, redireciona
      if (!refreshToken) {
        await removeAuthToken();
        await removeRefreshToken();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Verifica se já tem outro refresh em andamento
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const response = await plainAxios.post(REFRESH_API_URL, {
          refresh_token: refreshToken,
        });

        if (response.status === 200) {
          const newAccessToken = response.data.access_token;

          processQueue(null, newAccessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          return api(originalRequest);
        } else {
          throw new Error('Falha ao renovar token');
        }
      } catch (err) {
        processQueue(err, null);
        await removeAuthToken();
        await removeRefreshToken();
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


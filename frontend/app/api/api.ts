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
    const isRefreshEndpoint = originalRequest?.url?.endsWith('/refresh');
    const alreadyRetried = originalRequest._retry;

    // 🚨 Caso o /refresh esteja retornando 401, redireciona direto
    if (isUnauthorized && isRefreshEndpoint) {
      console.warn(' Refresh token falhou. Redirecionando para login.');
      await removeAuthToken();
      await removeRefreshToken();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // ⚠️ Se for 401 e não é tentativa de refresh
    if (isUnauthorized && !isRefreshEndpoint) {
      if (alreadyRetried) {
        console.warn(
          '⚠️ Token já foi tentado uma vez. Redirecionando para login.'
        );
        await removeAuthToken();
        await removeRefreshToken();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        console.warn(
          '⚠️ Sem refresh token disponível. Redirecionando para login.'
        );
        await removeAuthToken();
        await removeRefreshToken();
        window.location.href = '/login';
        return Promise.reject(error);
      }

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
          throw new Error('❌ Falha ao renovar token');
        }
      } catch (err) {
        console.error('❌ Erro ao tentar renovar token', err);

        if (typeof window !== 'undefined') {
          console.warn('Redirecionando para login após falha no refresh');
          try {
            await api.post('/logout-cookies');
          } catch (logoutError) {
            console.error('Erro ao chamar /api/logout', logoutError);
          }

          window.location.href = '/login';
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

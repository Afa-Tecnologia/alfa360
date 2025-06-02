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
// api.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest: any = error.config;

//     const isUnauthorized = error.response?.status === 401;
//     const isRefreshEndpoint = originalRequest?.url?.endsWith('/refresh');
//     const alreadyRetried = originalRequest._retry;

//     if (isUnauthorized && isRefreshEndpoint) {
//       console.warn('Refresh token falhou. Redirecionando para login.');
//       try {
//         await api.post('/logout-cookies', {}, { withCredentials: true });
//       } catch {}
//       window.location.href = '/login';
//       return Promise.reject(error);
//     }

//     if (isUnauthorized && !isRefreshEndpoint) {
//       if (alreadyRetried) {
//         console.warn('Token já foi tentado. Redirecionando para login.');
//         try {
//           await api.post('/logout-cookies', {}, { withCredentials: true });
//         } catch {}
//         window.location.href = '/login';
//         return Promise.reject(error);
//       }

//       originalRequest._retry = true;

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then(() => api(originalRequest));
//       }

//       isRefreshing = true;

//       try {
//         const response = await plainAxios.post('/refresh', {}, { withCredentials: true });

//         if (response.status === 200) {
//           processQueue(null); // nada a passar, o cookie foi renovado
//           return api(originalRequest);
//         } else {
//           throw new Error('Falha ao renovar token');
//         }
//       } catch (err) {
//           console.error('❌ Erro ao tentar renovar token', err);
//         try {
//           await api.post('/logout-cookies', {}, { withCredentials: true });
//         } catch {}
//         window.location.href = '/login';
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    const isUnauthorized = error.response?.status === 401;
    const isRefreshEndpoint = originalRequest?.url?.endsWith('/refresh');
    const alreadyRetried = originalRequest._retry;

    if (isUnauthorized && isRefreshEndpoint) {
      console.warn('Refresh token falhou. Redirecionando para login.');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (isUnauthorized && !isRefreshEndpoint) {
      if (alreadyRetried) {
        console.warn('Token já foi tentado. Redirecionando para login.');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      isRefreshing = true;

      try {
        const response = await plainAxios.post('/refresh', {}, { withCredentials: true });

        if (response.status === 200) {
          processQueue(null); // token renovado com sucesso
          return api(originalRequest);
        } else {
          throw new Error('Falha ao renovar token');
        }
      } catch (err) {
        console.error('❌ Erro ao tentar renovar token', err);
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


import axios, { AxiosError } from 'axios';
import { getAuthToken } from './auth';

// Instância principal com interceptores
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Sem fluxo de refresh: ao 401, redirecionar para login
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        try {
          // Tenta limpar cookies httpOnly via rota local do Next
          await fetch('/api/log-out', {
            method: 'POST',
            credentials: 'include',
          });
        } catch {}
        // Redireciona imediatamente para login
        window.location.href = '/login';
        // Evita propagar erro para a UI antes do redirect
        return new Promise(() => {});
      }
    }
    return Promise.reject(error);
  }
);
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

import { api } from '@/app/api/api';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

/**
 * Serviço responsável por gerenciar tokens de autenticação
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<TokenResponse | null> {
  try {
    // Cria uma instância separada do axios para evitar loops de interceptors
    const response = await api.post<TokenResponse>(
      '/refresh',
      { refresh_token: refreshToken },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Falha ao renovar token:', error);
    return null;
  }
}

/**
 * Verifica se um token JWT está expirado
 */
export function isTokenExpired(token: string): boolean {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const { exp } = JSON.parse(jsonPayload);
    return exp * 1000 < Date.now();
  } catch (error) {
    // Se houver qualquer erro na decodificação, consideramos o token como expirado
    return true;
  }
}

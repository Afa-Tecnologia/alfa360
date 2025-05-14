import { api } from '@/app/api/api';
import { clearAuthAndRedirect } from '@/lib/utils';

// Types
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Serviço responsável por gerenciar a autenticação do usuário.
 * Utiliza cookies HttpOnly para armazenar tokens de forma segura.
 */
class AuthService {
  private currentUser: User | null = null;

  /**
   * Realiza login do usuário
   * @param credentials Credenciais do usuário
   * @returns Dados do usuário autenticado
   */
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await api.post<AuthResponse>('/login', credentials);
      this.currentUser = response.data.user;
      return response.data.user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Realiza logout do usuário
   */
  async logout(): Promise<void> {
    try {
      await api.post('/logout');
      this.currentUser = null;
    } catch (error) {
      console.error('Logout failed:', error);
      // Mesmo com erro no logout, limpamos o usuário atual
      this.currentUser = null;
      throw error;
    }
  }

  /**
   * Obtém informações do usuário atual
   * @returns Dados do usuário ou null se não estiver autenticado
   */
  async getCurrentUser(): Promise<User | null> {
    // Se já tivermos os dados do usuário em cache, retornamos
    if (this.currentUser) {
      return this.currentUser;
    }

    try {
      const response = await api.get<User>('/me');
      this.currentUser = response.data;
      return this.currentUser;
    } catch (error) {
      // Não logar erro 401 pois é esperado quando não autenticado
      if ((error as any).response?.status !== 401) {
        console.error('Failed to get user data:', error);
      }
      return null;
    }
  }

  /**
   * Verifica se o usuário está autenticado
   * @returns true se o usuário estiver autenticado, false caso contrário
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }
}

// Singleton para garantir consistência no estado da autenticação
export const authService = new AuthService();

// Funções utilitárias para facilitar o uso do serviço
export const login = (credentials: LoginCredentials): Promise<User> =>
  authService.login(credentials);

export const logout = (): Promise<void> => authService.logout();

export const getCurrentUser = (): Promise<User | null> =>
  authService.getCurrentUser();

export const isAuthenticated = (): Promise<boolean> =>
  authService.isAuthenticated();

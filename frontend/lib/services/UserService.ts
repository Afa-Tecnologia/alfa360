import { api } from '../../app/api/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

/**
 * Serviço para gerenciamento de usuários
 */
class UserService {
  /**
   * Obtém todos os usuários
   */
  async getAll() {
    const response = await api.get('/users');
    return response.data;
  }

  /**
   * Obtém um usuário pelo ID
   */
  async getById(id: number) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }

  /**
   * Obtém todos os vendedores
   */
  async getVendedores() {
    try {
      const response = await api.get('/users/vendedores');
      return response.data.vendedores || [];
    } catch (error) {
      console.error('Erro ao buscar vendedores:', error);
      return [];
    }
  }
}

// Exporta uma instância única do serviço
export const userService = new UserService();

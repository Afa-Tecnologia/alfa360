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
      console.log(
        'Resposta da API de vendedores (UserService):',
        response.data
      );

      // Verificar diferentes possibilidades de estrutura de dados
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.vendedores) {
        return Array.isArray(response.data.vendedores)
          ? response.data.vendedores
          : [];
      } else if (response.data && response.data.data) {
        return Array.isArray(response.data.data) ? response.data.data : [];
      } else {
        console.warn(
          'Estrutura de resposta da API de vendedores não reconhecida:',
          response.data
        );
        return [];
      }
    } catch (error) {
      console.error('Erro ao buscar vendedores:', error);
      return [];
    }
  }
}

// Exporta uma instância única do serviço
export const userService = new UserService();

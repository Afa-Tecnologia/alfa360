import { api } from '../app/api/api';
import { gerarNotificacao } from '@/utils/toast';

export interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
  password?: string;
}

/**
 * Serviço para gerenciamento de usuários
 */
class UserService {
  /**
   * Obtém todos os usuários
   */
  async getAll() {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error);
      gerarNotificacao(
        'error',
        error.response?.data?.message || 'Erro ao buscar usuários'
      );
      return [];
    }
  }

  /**
   * Obtém um usuário pelo ID
   */
  async getById(id: number) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar usuário:', error);
      gerarNotificacao(
        'error',
        error.response?.data?.message || 'Erro ao buscar usuário'
      );
      return null;
    }
  }

  /**
   * Cria um novo usuário
   */
  async create(user: User) {
    try {
      // Remove a senha da resposta antes de retornar para evitar exposição
      const response = await api.post('/users', user);

      // Garantindo que a senha não está sendo retornada na resposta
      const { password, ...safeUserData } = response.data;

      gerarNotificacao('success', 'Usuário criado com sucesso!');
      return safeUserData;
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      gerarNotificacao(
        'error',
        error.response?.data?.message || 'Erro ao criar usuário'
      );
      throw new Error(error.response?.data?.message || 'Erro ao criar usuário');
    }
  }

  /**
   * Atualiza um usuário existente
   */
  async update(id: number, user: Partial<User>) {
    try {
      const response = await api.put(`/users/${id}`, user);

      // Garantindo que a senha não está sendo retornada na resposta
      const { password, ...safeUserData } = response.data;

      gerarNotificacao('success', 'Usuário atualizado com sucesso!');
      return safeUserData;
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      gerarNotificacao(
        'error',
        error.response?.data?.message || 'Erro ao atualizar usuário'
      );
      throw new Error(
        error.response?.data?.message || 'Erro ao atualizar usuário'
      );
    }
  }

  /**
   * Deleta um usuário
   */
  async delete(id: number) {
    try {
      const response = await api.delete(`/users/${id}`);
      gerarNotificacao('success', 'Usuário excluído com sucesso!');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      gerarNotificacao(
        'error',
        error.response?.data?.message || 'Erro ao excluir usuário'
      );
      throw new Error(
        error.response?.data?.message || 'Erro ao excluir usuário'
      );
    }
  }

  /**
   * Obtém todos os vendedores
   */
  async getVendedores() {
    try {
      const response = await api.get('/users/vendedores');
      return response.data.vendedores || [];
    } catch (error: any) {
      console.error('Erro ao buscar vendedores:', error);
      gerarNotificacao(
        'error',
        error.response?.data?.message || 'Erro ao buscar vendedores'
      );
      return [];
    }
  }
 async  getUser() {
  try {
    const response = await api.get('/me'); // ajuste a URL conforme necessário
    if (!response || !response.data) {
      throw new Error('Failed to fetch user');
    }
    return response.data;
  } catch (error: any) {
    return error.message;
  }
}

  /**
   * Atualiza a lista de usuários
   */
  async refreshUsers(
    setUsers: Function,
    setFilteredUsers: Function,
    setIsLoading: Function
  ) {
    setIsLoading(true);
    const usersData = await this.getAll();
    setUsers(usersData);
    setFilteredUsers(usersData);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }
}

export const userService = new UserService();

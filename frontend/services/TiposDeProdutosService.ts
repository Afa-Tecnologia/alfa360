import { api } from '@/app/api/api';
import { TipoDeProduto } from '@/types/configuracoes';

class TiposDeProdutosService {
  /**
   * Busca todos os tipos de produtos
   */
  async getAll(): Promise<TipoDeProduto[]> {
    try {
      const response = await api.get('/tipos-produtos');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tipos de produtos:', error);
      throw error;
    }
  }

  /**
   * Busca um tipo de produto pelo ID
   */
  async getById(id: number): Promise<TipoDeProduto> {
    try {
      const response = await api.get(`/tipos-produtos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar tipo de produto com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cria um novo tipo de produto
   */
  async create(
    data: Omit<TipoDeProduto, 'id' | 'created_at' | 'updated_at'>
  ): Promise<TipoDeProduto> {
    try {
      const response = await api.post('/tipos-produtos', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar tipo de produto:', error);
      throw error;
    }
  }

  /**
   * Atualiza um tipo de produto existente
   */
  async update(
    id: number,
    data: Partial<Omit<TipoDeProduto, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<TipoDeProduto> {
    try {
      const response = await api.put(`/tipos-produtos/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar tipo de produto com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Exclui um tipo de produto
   */
  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/tipos-produtos/${id}`);
    } catch (error) {
      console.error(`Erro ao excluir tipo de produto com ID ${id}:`, error);
      throw error;
    }
  }
}

export const tiposDeProdutosService = new TiposDeProdutosService();

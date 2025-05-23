import { api } from '@/app/api/api';

import { Category } from '@/stores/categoryStore';

class CategoryService {
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await api.get(('/categorias'), {});
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  }

  async getCategoryById(id: number): Promise<Category> {
    try {
      const response = await api.get((`/categorias/${id}`), {});
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar categoria com ID ${id}:`, error);
      throw error;
    }
  }

  async createCategory(data: Omit<Category, 'id'>): Promise<Category> {
    try {
      const response = await api.post(('/categorias'), data, {});

      // O backend retorna um array com a categoria criada
      return Array.isArray(response.data) ? response.data[0] : response.data;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  }

  async updateCategory(id: number, data: Partial<Category>): Promise<Category> {
    try {
      const response = await api.put((`/categorias/${id}`), data, {});

      // O backend retorna um array com a categoria atualizada
      return Array.isArray(response.data) ? response.data[0] : response.data;
    } catch (error) {
      console.error(`Erro ao atualizar categoria com ID ${id}:`, error);
      throw error;
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      await api.delete((`/categorias/${id}`), {});
    } catch (error) {
      console.error(`Erro ao excluir categoria com ID ${id}:`, error);
      throw error;
    }
  }
}

// Exporta uma instância única do serviço
export const categoryService = new CategoryService();

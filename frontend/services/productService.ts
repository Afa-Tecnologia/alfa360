import { api } from '@/app/api/api';
import { Product } from '@/types/sales';

/**
 * Serviço para gerenciar produtos
 */
class ProductService {
  /**
   * Busca um produto pelo código ou código de barras
   */
  async getProductByCode(code: string): Promise<any> {
    try {
      const response = await api.get(`/produtos/barcode/${code}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produto por código:', error);
      throw error;
    }
  }

  /**
   * Alias para getProductByCode para compatibilidade
   */
  async getProductByBarcode(code: string): Promise<any> {
    return this.getProductByCode(code);
  }

  /**
   * Busca todos os produtos
   */
  async getProducts(): Promise<any[]> {
    try {
      const response = await api.get('/produtos');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  }

  /**
   * Busca todas as categorias
   */
  async getCategorys(): Promise<any[]> {
    try {
      const response = await api.get('/categorias');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  }
}

export default new ProductService();

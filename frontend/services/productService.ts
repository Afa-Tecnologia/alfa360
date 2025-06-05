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
   * Verifica se um código de barras já existe no sistema
   * @returns true se o código já existe, false caso contrário
   */
  async checkBarcodeExists(code: string): Promise<boolean> {
    try {
      const response = await api.get(`/produtos/barcode/${code}`);
      return response.data.exists;
    } catch (error) {
      // Se o endpoint não existir, tentamos buscar o produto diretamente
      try {
        const product = await this.getProductByBarcode(code);
        return !!product; // Retorna true se o produto existir
      } catch (e) {
        return false; // Se não encontrar o produto, assume que não existe
      }
    }
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

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
      // Se a resposta tem exists, use isso
      if (typeof response.data.exists !== 'undefined') {
        return response.data.exists;
      }
      // Se a resposta tem error dizendo que não encontrou, retorne false
      if (
        response.data.error &&
        response.data.error.includes('não encontrado')
      ) {
        return false;
      }
      // Se retornou algum produto, existe
      if (
        response.data &&
        typeof response.data === 'object' &&
        Object.keys(response.data).length > 0
      ) {
        return true;
      }
      return false;
    } catch (error: any) {
      // Se a API retorna 404 ou erro, verifica se tem exists: false
      if (
        error.response &&
        error.response.data &&
        typeof error.response.data.exists !== 'undefined'
      ) {
        return error.response.data.exists;
      }
      // Se a API retorna 404 ou erro, assume que não existe
      return false;
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
   * Busca os atributos por tipo de negocio
   */
  async getAtributosVarianteByBusiness(): Promise<any[]> {
    try {
      const response = await api.get('/atributos/por-tipo-de-negocio');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar atributos de variantes:', error);
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

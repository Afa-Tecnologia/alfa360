import { api } from '@/app/api/api';
import { gerarNotificacao } from '@/utils/toast';

class ProductService {
  static async getCategorys() {
    try {
      const response = await api.get(`/categorias`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar categorias:', error);
      gerarNotificacao(
        'error',
        error.response?.data?.message || 'Erro ao buscar categorias'
      );
      return 'Erro ao buscar categorias veja a API';
    }
  }
  static async getProducts() {
    try {
      const response = await api.get('/produtos');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar produtos:', error);
      gerarNotificacao(
        'error',
        error.response?.data?.message || 'Erro desconhecido'
      );
      return 'Erro ao buscar produtos veja a API';
    }
  }

  static async getProductByBarcode(barcode: string) {
    try {
      const response = await api.get(`/produtos/barcode/${barcode}`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar produto por código de barras:', error);
      gerarNotificacao(
        'error',
        error.response?.data?.message || 'Produto não encontrado'
      );
      return null;
    }
  }
}
export default ProductService;

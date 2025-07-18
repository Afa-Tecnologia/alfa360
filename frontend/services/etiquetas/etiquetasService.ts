import { apiFetch } from '@/app/api/server-api';
import { ProdutoSearchResponse } from '@/components/dashboard-v2/etiquetas/types/etiqueta.types';

class EtiquetasService {
  /**
   * Busca produtos para etiquetas, com paginação e busca
   * @param page Página atual
   * @param per_page Itens por página
   * @param query Termo de busca (nome ou código)
   */
  async getProducts(
    page = 1,
    per_page = 10,
    query = ''
  ): Promise<ProdutoSearchResponse> {
    const url = `/produtos?page=${page}&per_page=${per_page}&query=${encodeURIComponent(query)}`;
    const response = await apiFetch(url);
    return response as ProdutoSearchResponse;
  }
}

export default new EtiquetasService();

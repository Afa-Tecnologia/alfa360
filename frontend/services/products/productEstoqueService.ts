import { api } from '@/app/api/api';
import { apiFetch } from '@/app/api/server-api';
import type {
  Category,
  ProductEstoque,
  ResponseAtributos,
  ResponseProducts,
} from '@/types/product';

export interface IProductService {
  getProducts(): Promise<ResponseProducts>;
  getCategories(): Promise<Category[]>;
  deleteProduct(id: number | string): Promise<void>;
  deleteProducts(ids: (number | string)[]): Promise<void>;
}

export class ProductServiceEstoque implements IProductService {
  async getProducts(page?: number, perPage = 1): Promise<ResponseProducts | any> {
    const response = await apiFetch(`/produtos?page=${page}&per_page=${perPage}`);
    return response;
  }

  async getCategories(): Promise<Category[]> {
    const response = await apiFetch('/categorias');
    return response;
  }

  async getProductsBySearchTerm(
    searchTerm: string,
  ): Promise<ProductEstoque[] | any> {
    const response = await apiFetch(
      `/produtos/search?query=${searchTerm}`
    );
    return response || [];
  }

  async deleteProduct(id: number | string): Promise<void> {
    await api.delete(`/produtos/${id}`);
  }

  async deleteProducts(ids: (number | string)[]): Promise<void> {
    await Promise.all(ids.map((id) => this.deleteProduct(id)));
  }

  /**
   * Busca os atributos por tipo de negocio
   */
  async getAtributosVarianteByBusiness(): Promise<ResponseAtributos[]> {
    try {
      const response = await apiFetch('/atributos/por-tipo-de-negocio');
      return response.atributos;
    } catch (error) {
      console.error('Erro ao buscar atributos de variantes:', error);
      return [];
    }
  }
}

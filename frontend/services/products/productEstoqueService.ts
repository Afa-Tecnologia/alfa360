import { api } from '@/app/api/api';
import { apiFetch } from '@/app/api/server-api';
import { User, userService } from '@/lib/services/UserService';
import type {
  Category,
  ProductEstoque,
  ResponseAtributos,
  ResponseProducts,
} from '@/types/product';

export interface IProductService {
  getProducts(
    page?: number,
    perPage?: number,
    query?: string,
    categoria_id?: string
  ): Promise<ResponseProducts>;
  getCategories(): Promise<Category[]>;
  deleteProduct(id: number | string): Promise<void>;
  deleteProducts(ids: (number | string)[]): Promise<void>;
}

export class ProductServiceEstoque implements IProductService {
  async getProducts(
    page?: number,
    perPage?: number,
    query?: string,
    categoria_id?: string
  ): Promise<ResponseProducts> {
    try {
      const params: any = {};

      if (page) params.page = page;
      if (perPage) params.per_page = perPage;
      if (query) params.query = query;
      if (categoria_id && categoria_id !== 'all')
        params.categoria_id = categoria_id;

      if (typeof window === 'undefined') {
        const qs = new URLSearchParams(params).toString();
        const data = await apiFetch(`/produtos${qs ? `?${qs}` : ''}`);
        return data as ResponseProducts;
      } else {
        const response = await api.get('/produtos', { params });
        return response.data;
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  async getVendedores(): Promise<User[]> {
    const response = await userService.getVendedores();
    return response;
  }

  async getCategories(): Promise<Category[]> {
    if (typeof window === 'undefined') {
      const data = await apiFetch('/categorias');
      return data as Category[];
    } else {
      const response = await api.get('/categorias');
      return response.data;
    }
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
      if (typeof window === 'undefined') {
        const data = await apiFetch('/atributos/por-tipo-de-negocio');
        return (data as any).atributos as ResponseAtributos[];
      } else {
        const response = await api.get('/atributos/por-tipo-de-negocio');
        return response.data.atributos;
      }
    } catch (error) {
      console.error('Erro ao buscar atributos de variantes:', error);
      return [];
    }
  }
}

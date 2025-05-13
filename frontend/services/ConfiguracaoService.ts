import { api } from '@/app/api/api';
import {
  TipoDeProduto,
  TipoDeNegocio,
  ConfigDoNegocio,
} from '@/types/configuracoes';

/**
 * Serviço para gerenciar as configurações do negócio
 */
class ConfiguracaoService {
  /**
   * Busca todos os tipos de produtos
   */
  async getTiposDeProdutos(): Promise<TipoDeProduto[]> {
    try {
      const response = await api.get('/tipos-produtos');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tipos de produtos:', error);
      return [];
    }
  }

  /**
   * Busca um tipo de produto pelo ID
   */
  async getTipoDeProdutoById(id: number): Promise<TipoDeProduto | null> {
    try {
      const response = await api.get(`/tipos-produtos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar tipo de produto ${id}:`, error);
      return null;
    }
  }

  /**
   * Cria um novo tipo de produto
   */
  async createTipoDeProduto(
    data: Omit<TipoDeProduto, 'id'>
  ): Promise<TipoDeProduto> {
    const response = await api.post('/tipos-produtos', data);
    return response.data;
  }

  /**
   * Atualiza um tipo de produto existente
   */
  async updateTipoDeProduto(
    id: number,
    data: Partial<TipoDeProduto>
  ): Promise<TipoDeProduto> {
    const response = await api.put(`/tipos-produtos/${id}`, data);
    return response.data;
  }

  /**
   * Exclui um tipo de produto
   */
  async deleteTipoDeProduto(id: number): Promise<void> {
    await api.delete(`/tipos-produtos/${id}`);
  }

  /**
   * Busca todos os tipos de negócios
   */
  async getTiposDeNegocios(): Promise<TipoDeNegocio[]> {
    try {
      const response = await api.get('/tipos-negocios');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tipos de negócios:', error);
      return [];
    }
  }

  /**
   * Busca um tipo de negócio pelo ID
   */
  async getTipoDeNegocioById(id: number): Promise<TipoDeNegocio | null> {
    try {
      const response = await api.get(`/tipos-negocios/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar tipo de negócio ${id}:`, error);
      return null;
    }
  }

  /**
   * Cria um novo tipo de negócio
   */
  async createTipoDeNegocio(
    data: Omit<TipoDeNegocio, 'id'>
  ): Promise<TipoDeNegocio> {
    const response = await api.post('/tipos-negocios', data);
    return response.data;
  }

  /**
   * Atualiza um tipo de negócio existente
   */
  async updateTipoDeNegocio(
    id: number,
    data: Partial<TipoDeNegocio>
  ): Promise<TipoDeNegocio> {
    const response = await api.put(`/tipos-negocios/${id}`, data);
    return response.data;
  }

  /**
   * Exclui um tipo de negócio
   */
  async deleteTipoDeNegocio(id: number): Promise<void> {
    await api.delete(`/tipos-negocios/${id}`);
  }

  /**
   * Busca todas as configurações de negócio
   */
  async getConfiguracoesDoNegocio(): Promise<ConfigDoNegocio[]> {
    try {
      const response = await api.get('/config-negocio');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar configurações de negócio:', error);
      return [];
    }
  }

  /**
   * Busca uma configuração de negócio pelo ID
   */
  async getConfiguracaoDoNegocioById(
    id: number
  ): Promise<ConfigDoNegocio | null> {
    try {
      const response = await api.get(`/config-negocio/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar configuração de negócio ${id}:`, error);
      return null;
    }
  }

  /**
   * Cria uma nova configuração de negócio
   */
  async createConfiguracaoDoNegocio(
    data: Omit<ConfigDoNegocio, 'id'>
  ): Promise<ConfigDoNegocio> {
    const response = await api.post('/config-negocio', data);
    return response.data;
  }

  /**
   * Atualiza uma configuração de negócio existente
   */
  async updateConfiguracaoDoNegocio(
    id: number,
    data: Partial<ConfigDoNegocio>
  ): Promise<ConfigDoNegocio> {
    const response = await api.put(`/config-negocio/${id}`, data);
    return response.data;
  }

  /**
   * Exclui uma configuração de negócio
   */
  async deleteConfiguracaoDoNegocio(id: number): Promise<void> {
    await api.delete(`/config-negocio/${id}`);
  }
}

export const configuracaoService = new ConfiguracaoService();

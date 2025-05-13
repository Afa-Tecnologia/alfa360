import { create } from 'zustand';
import {
  TipoDeProduto,
  TipoDeNegocio,
  ConfigDoNegocio,
} from '@/types/configuracoes';
import { configuracaoService } from '@/services/ConfiguracaoService';

interface ConfiguracaoState {
  // Tipos de Produtos
  tiposDeProdutos: TipoDeProduto[];
  loadingTiposDeProdutos: boolean;
  errorTiposDeProdutos: string | null;
  fetchTiposDeProdutos: () => Promise<void>;
  createTipoDeProduto: (
    data: Omit<TipoDeProduto, 'id'>
  ) => Promise<TipoDeProduto>;
  updateTipoDeProduto: (
    id: number,
    data: Partial<TipoDeProduto>
  ) => Promise<TipoDeProduto>;
  deleteTipoDeProduto: (id: number) => Promise<void>;

  // Tipos de Negócios
  tiposDeNegocios: TipoDeNegocio[];
  loadingTiposDeNegocios: boolean;
  errorTiposDeNegocios: string | null;
  fetchTiposDeNegocios: () => Promise<void>;
  createTipoDeNegocio: (
    data: Omit<TipoDeNegocio, 'id'>
  ) => Promise<TipoDeNegocio>;
  updateTipoDeNegocio: (
    id: number,
    data: Partial<TipoDeNegocio>
  ) => Promise<TipoDeNegocio>;
  deleteTipoDeNegocio: (id: number) => Promise<void>;

  // Configurações do Negócio
  configuracoesDoNegocio: ConfigDoNegocio[];
  loadingConfiguracoesDoNegocio: boolean;
  errorConfiguracoesDoNegocio: string | null;
  fetchConfiguracoesDoNegocio: () => Promise<void>;
  createConfiguracaoDoNegocio: (
    data: Omit<ConfigDoNegocio, 'id'>
  ) => Promise<ConfigDoNegocio>;
  updateConfiguracaoDoNegocio: (
    id: number,
    data: Partial<ConfigDoNegocio>
  ) => Promise<ConfigDoNegocio>;
  deleteConfiguracaoDoNegocio: (id: number) => Promise<void>;
}

export const useConfiguracaoStore = create<ConfiguracaoState>((set, get) => ({
  // Tipos de Produtos
  tiposDeProdutos: [],
  loadingTiposDeProdutos: false,
  errorTiposDeProdutos: null,

  fetchTiposDeProdutos: async () => {
    try {
      set({ loadingTiposDeProdutos: true, errorTiposDeProdutos: null });
      const tiposDeProdutos = await configuracaoService.getTiposDeProdutos();
      set({ tiposDeProdutos, loadingTiposDeProdutos: false });
    } catch (error) {
      console.error('Erro ao buscar tipos de produtos:', error);
      set({
        errorTiposDeProdutos: 'Erro ao carregar tipos de produtos',
        loadingTiposDeProdutos: false,
      });
    }
  },

  createTipoDeProduto: async (data) => {
    try {
      const novoProduto = await configuracaoService.createTipoDeProduto(data);
      set((state) => ({
        tiposDeProdutos: [...state.tiposDeProdutos, novoProduto],
      }));
      return novoProduto;
    } catch (error) {
      console.error('Erro ao criar tipo de produto:', error);
      throw error;
    }
  },

  updateTipoDeProduto: async (id, data) => {
    try {
      const produtoAtualizado = await configuracaoService.updateTipoDeProduto(
        id,
        data
      );
      set((state) => ({
        tiposDeProdutos: state.tiposDeProdutos.map((tipo) =>
          tipo.id === id ? produtoAtualizado : tipo
        ),
      }));
      return produtoAtualizado;
    } catch (error) {
      console.error(`Erro ao atualizar tipo de produto ${id}:`, error);
      throw error;
    }
  },

  deleteTipoDeProduto: async (id) => {
    try {
      await configuracaoService.deleteTipoDeProduto(id);
      set((state) => ({
        tiposDeProdutos: state.tiposDeProdutos.filter((tipo) => tipo.id !== id),
      }));
    } catch (error) {
      console.error(`Erro ao excluir tipo de produto ${id}:`, error);
      throw error;
    }
  },

  // Tipos de Negócios
  tiposDeNegocios: [],
  loadingTiposDeNegocios: false,
  errorTiposDeNegocios: null,

  fetchTiposDeNegocios: async () => {
    try {
      set({ loadingTiposDeNegocios: true, errorTiposDeNegocios: null });
      const tiposDeNegocios = await configuracaoService.getTiposDeNegocios();
      set({ tiposDeNegocios, loadingTiposDeNegocios: false });
    } catch (error) {
      console.error('Erro ao buscar tipos de negócios:', error);
      set({
        errorTiposDeNegocios: 'Erro ao carregar tipos de negócios',
        loadingTiposDeNegocios: false,
      });
    }
  },

  createTipoDeNegocio: async (data) => {
    try {
      const novoNegocio = await configuracaoService.createTipoDeNegocio(data);
      set((state) => ({
        tiposDeNegocios: [...state.tiposDeNegocios, novoNegocio],
      }));
      return novoNegocio;
    } catch (error) {
      console.error('Erro ao criar tipo de negócio:', error);
      throw error;
    }
  },

  updateTipoDeNegocio: async (id, data) => {
    try {
      const negocioAtualizado = await configuracaoService.updateTipoDeNegocio(
        id,
        data
      );
      set((state) => ({
        tiposDeNegocios: state.tiposDeNegocios.map((tipo) =>
          tipo.id === id ? negocioAtualizado : tipo
        ),
      }));
      return negocioAtualizado;
    } catch (error) {
      console.error(`Erro ao atualizar tipo de negócio ${id}:`, error);
      throw error;
    }
  },

  deleteTipoDeNegocio: async (id) => {
    try {
      await configuracaoService.deleteTipoDeNegocio(id);
      set((state) => ({
        tiposDeNegocios: state.tiposDeNegocios.filter((tipo) => tipo.id !== id),
      }));
    } catch (error) {
      console.error(`Erro ao excluir tipo de negócio ${id}:`, error);
      throw error;
    }
  },

  // Configurações do Negócio
  configuracoesDoNegocio: [],
  loadingConfiguracoesDoNegocio: false,
  errorConfiguracoesDoNegocio: null,

  fetchConfiguracoesDoNegocio: async () => {
    try {
      set({
        loadingConfiguracoesDoNegocio: true,
        errorConfiguracoesDoNegocio: null,
      });
      const configuracoes =
        await configuracaoService.getConfiguracoesDoNegocio();
      set({
        configuracoesDoNegocio: configuracoes,
        loadingConfiguracoesDoNegocio: false,
      });
    } catch (error) {
      console.error('Erro ao buscar configurações do negócio:', error);
      set({
        errorConfiguracoesDoNegocio:
          'Erro ao carregar configurações do negócio',
        loadingConfiguracoesDoNegocio: false,
      });
    }
  },

  createConfiguracaoDoNegocio: async (data) => {
    try {
      const novaConfig =
        await configuracaoService.createConfiguracaoDoNegocio(data);
      set((state) => ({
        configuracoesDoNegocio: [...state.configuracoesDoNegocio, novaConfig],
      }));
      return novaConfig;
    } catch (error) {
      console.error('Erro ao criar configuração do negócio:', error);
      throw error;
    }
  },

  updateConfiguracaoDoNegocio: async (id, data) => {
    try {
      const configAtualizada =
        await configuracaoService.updateConfiguracaoDoNegocio(id, data);
      set((state) => ({
        configuracoesDoNegocio: state.configuracoesDoNegocio.map((config) =>
          config.id === id ? configAtualizada : config
        ),
      }));
      return configAtualizada;
    } catch (error) {
      console.error(`Erro ao atualizar configuração do negócio ${id}:`, error);
      throw error;
    }
  },

  deleteConfiguracaoDoNegocio: async (id) => {
    try {
      await configuracaoService.deleteConfiguracaoDoNegocio(id);
      set((state) => ({
        configuracoesDoNegocio: state.configuracoesDoNegocio.filter(
          (config) => config.id !== id
        ),
      }));
    } catch (error) {
      console.error(`Erro ao excluir configuração do negócio ${id}:`, error);
      throw error;
    }
  },
}));

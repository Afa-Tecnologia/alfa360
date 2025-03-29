import { create } from 'zustand';
import { CaixaService } from '@/services/caixaService';
import {
  CaixaReport,
  CaixaStatus,
  MovimentacaoCaixa,
  MovimentacaoParams,
  CaixaStore,
  Caixa,
} from '@/types/caixa';

/**
 * Store para gerenciar o estado global do caixa
 */
export const useCaixaStore = create<CaixaStore>((set) => ({
  // Estado
  statusCaixa: null,
  caixaReport: null,
  movimentacoes: [],
  isLoading: false,
  error: null,

  // Setters
  setStatusCaixa: (status) => set({ statusCaixa: status }),
  setCaixaReport: (report) => set({ caixaReport: report }),
  setMovimentacoes: (movimentacoes) => set({ movimentacoes }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Métodos
  fetchStatus: async () => {
    try {
      set({ isLoading: true, error: null });
      const status = await CaixaService.checkStatus();
      set({ statusCaixa: status });
    } catch (error) {
      console.error('Erro ao buscar status do caixa:', error);
      set({ error: 'Falha ao carregar o status do caixa' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMovimentacoes: async (caixaId?: number) => {
    try {
      set({ isLoading: true, error: null });
      const movimentacoes = await CaixaService.getMovimentacoes(caixaId);
      set({ movimentacoes });
    } catch (error) {
      console.error('Erro ao buscar movimentações:', error);
      set({ error: 'Falha ao carregar as movimentações do caixa' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchReport: async (caixaId: number) => {
    try {
      set({ isLoading: true, error: null });
      const reportData = await CaixaService.getReport(caixaId);

      // Converter ReportResponse para CaixaReport
      const caixaReport: CaixaReport = {
        caixa: {} as Caixa, // Será preenchido no futuro quando necessário
        saldoAtual: String(reportData.saldo_final),
        totalEntradas: String(reportData.total_entradas),
        totalSaidas: String(reportData.total_saidas),
        movimentacoes: [],
        entradasPorMetodo: Object.entries(reportData.por_forma_pagamento).map(
          ([metodo, valor]) => ({
            metodo,
            total: String(valor),
            percentual: 0, // Será calculado se necessário
          })
        ),
        saidasPorMotivo: [],
      };

      set({ caixaReport });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      set({ error: 'Falha ao gerar o relatório do caixa' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  openCaixa: async (saldoInicial: number, userId: number, observacao?: string) => {
    try {
      set({ isLoading: true, error: null });
      await CaixaService.openCaixa(saldoInicial, userId, observacao);

      // Atualiza o status após abertura
      const status = await CaixaService.checkStatus();
      set({ statusCaixa: status });
    } catch (error) {
      console.error('Erro ao abrir caixa:', error);
      set({ error: 'Falha ao abrir o caixa' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  closeCaixa: async (
    caixaId: number,
    saldoFinal: number,
    observacao?: string
  ) => {
    try {
      set({ isLoading: true, error: null });
      await CaixaService.closeCaixa(caixaId, saldoFinal, observacao);

      // Atualiza o status após fechamento
      const status = await CaixaService.checkStatus();
      set({ statusCaixa: status });
    } catch (error) {
      console.error('Erro ao fechar caixa:', error);
      set({ error: 'Falha ao fechar o caixa' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  createMovimentacao: async (params: MovimentacaoParams) => {
    try {
      set({ isLoading: true, error: null });
      await CaixaService.createMovimentacao(params);

      // Atualiza as movimentações após criação
      const movimentacoes = await CaixaService.getMovimentacoes(
        params.caixa_id
      );
      set({ movimentacoes });

      // Atualiza o status do caixa também
      const status = await CaixaService.checkStatus();
      set({ statusCaixa: status });
    } catch (error) {
      console.error('Erro ao criar movimentação:', error);
      set({ error: 'Falha ao registrar a movimentação' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

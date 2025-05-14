import { api as axiosInstance } from '@/app/api/api';
import { IMovimentacoes, IReports } from '@/types/caixa';
import { gerarNotificacao } from '../../utils/toast';
export const caixaService = {
  openCaixa: async (saldo_inicial: number, observation?: string) => {
    const data = {
      saldo_inicial: saldo_inicial,
      observation: observation,
    };

    try {
      const response = await axiosInstance.post(`/caixa/open`, data);
      gerarNotificacao('success', 'Caixa ABERTO com sucesso');
      return response.data;
    } catch (e: any) {
      gerarNotificacao('error', e.response?.data?.message);
      console.log(e);
      return [];
    }
  },

  closeCaixa: (caixaId: number, data: { observation?: string }) =>
    axiosInstance.post(`/caixa/${caixaId}/close`, data),

  createMovimentacao: async (caixaId: string, data: any) => {
    try {
      const response = await axiosInstance.post(
        `/caixa/${caixaId}/movimentacao`,
        data
      );
      gerarNotificacao('success', 'Movimentação criada com sucesso');
      return response.data as IMovimentacoes[];
    } catch (e: any) {
      gerarNotificacao('error', e.response?.data?.message);
      console.log(e);
      return [];
    }
  },

  getCaixaReport: async (caixaId: string) => {
    try {
      const reponse = await axiosInstance.get(`/caixa/${caixaId}/report`);
      return reponse.data as IReports[];
    } catch (e: any) {
      console.log(e);
      return [];
    }
  },

  getMovimentacoes: async () => {
    try {
      const response = await axiosInstance.get(`/caixa/movimentacoes`);
      return response.data as IMovimentacoes[];
    } catch (e) {
      console.log(e);
      return [];
    }
  },

  getMovimentacoesById: async (caixaId: string) => {
    try {
      const response = await axiosInstance.get(
        `/caixa/${caixaId}/movimentacoes`
      );
      return response.data as IMovimentacoes[];
    } catch (e) {
      console.log(e);
      return [];
    }
  },

  //   getPedidosPendentes: () =>
  //     axiosInstance.get('/pedidos/pendentes'),
  getPedidosPendentes: () => [{ data: '' }],

  registrarPedidoNoCaixa: (caixaId: string, pedidoId: number) =>
    axiosInstance.post(`/caixa/${caixaId}/pedido/${pedidoId}/movimentacao`),

  getCaixaStatus: async () => {
    try {
      const response = await axiosInstance.get(`/caixa/status`);
      return response.data;
    } catch (e) {
      console.log(e);
      return { open: false };
    }
  },

  // Report consolidated data between dates
  getConsolidated: async (startDate: string, endDate: string) => {
    try {
      const response = await axiosInstance.get('/caixa/consolidado', {
        params: { data_inicial: startDate, data_final: endDate },
      });
      return response.data;
    } catch (e) {
      console.log('Erro ao buscar dados consolidados:', e);
      // Return mock data if API fails
      return {
        saldo: 15280.45,
        entradas: 32450.9,
        saidas: 17170.45,
      };
    }
  },

  // Get cash history between dates
  getHistory: async (startDate: string, endDate: string) => {
    try {
      const response = await axiosInstance.get('/caixa/historico', {
        params: { data_inicial: startDate, data_final: endDate },
      });
      return response.data;
    } catch (e) {
      console.log('Erro ao buscar histórico do caixa:', e);
      // Return mock data if API fails
      return [
        {
          id: 1,
          tipo: 'entrada',
          descricao: 'Vendas do dia',
          valor: 3245.75,
          data: '2023-09-01T14:30:00',
          formaPagamento: 'Diversos',
        },
        {
          id: 2,
          tipo: 'saida',
          descricao: 'Pagamento fornecedor',
          valor: 1520.0,
          data: '2023-09-01T15:45:00',
          formaPagamento: 'Transferência',
        },
      ];
    }
  },
};

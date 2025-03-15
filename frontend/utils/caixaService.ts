import { api as axiosInstance } from '@/app/api/api';
import { IMovimentacoes, IReports } from '@/types/caixa';
import { gerarNotificacao } from './toast';
export const caixaService = {
  openCaixa: async (saldo_inicial: number, observation?: string ) =>{
    const data = {
      saldo_inicial:saldo_inicial,
      observation: observation
    }

    try{
      const response = await axiosInstance.post(`/caixa/open`, data)
      gerarNotificacao('success', 'Caixa ABERTO com sucesso')
      return response.data;
    } catch (e:any){
      gerarNotificacao('error', e.response?.data?.message)
      console.log(e);
      return []
    }
  },

  closeCaixa: (caixaId: number, data: { observation?: string }) =>
    axiosInstance.post(`/caixa/${caixaId}/close`, data),

  createMovimentacao: async (caixaId: string, data: any) =>{
    try{
      const response = await axiosInstance.post(`/caixa/${caixaId}/movimentacao`, data)
      gerarNotificacao('success', 'Movimentação criada com sucesso')
      return response.data as IMovimentacoes[]
    } catch (e:any){
      gerarNotificacao('error', e.response?.data?.message)
      console.log(e);
      return []
    }
    
  },

  getCaixaReport: async (caixaId: string) => {
    try{
      const reponse = await axiosInstance.get(`/caixa/${caixaId}/report`);
      return reponse.data as IReports[]
    } catch (e:any){
      console.log(e);
      return []
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

  getMovimentacoesById: async (caixaId:string) => {
    try {
      const response = await axiosInstance.get(`/caixa/${caixaId}/movimentacoes`);
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

  getCaixaStatus: () => axiosInstance.get('/caixa/status'),
};

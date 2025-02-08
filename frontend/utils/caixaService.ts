import { api as axiosInstance } from '@/app/api/api';
export const caixaService = {
  openCaixa: (data: { saldo_inicial: number; observation?: string }) =>
    axiosInstance.post('/caixa/open', data),

  closeCaixa: (caixaId: number, data: { observation?: string }) =>
    axiosInstance.post(`/caixa/${caixaId}/close`, data),

  createMovimentacao: (caixaId: number, data: any) =>
    axiosInstance.post(`/caixa/${caixaId}/movimentacao`, data),

  getCaixaReport: (caixaId: number) =>
    axiosInstance.get(`/caixa/${caixaId}/report`),

  getMovimentacoes: () => axiosInstance.get(`/caixa/movimentacoes`),

  //   getPedidosPendentes: () =>
  //     axiosInstance.get('/pedidos/pendentes'),
  getPedidosPendentes: () => [{ data: '' }],

  registrarPedidoNoCaixa: (caixaId: number, pedidoId: number) =>
    axiosInstance.post(`/caixa/${caixaId}/pedido/${pedidoId}/movimentacao`),

  getCaixaStatus: () => axiosInstance.get('/caixa/status'),
};

import { api } from '@/app/api/api';
import {
  Caixa,
  CaixaReport,
  CaixaStatus,
  MovimentacaoCaixa,
  MovimentacaoParams,
  StatusCaixaResponse,
  AbrirCaixaRequest,
  FecharCaixaRequest,
  CriarMovimentacaoRequest,
  RelatorioCaixa,
  CaixaHistoricoResponse,
  CaixaDetalhesResponse,
  HistoricoFilters,
  ReportResponse,
  ConsolidadoCaixas,
} from '@/types/caixa';

/**
 * Função auxiliar para manipular erros da API
 */
const handleApiError = (error: any) => {
  console.error('Erro na requisição:', error);
  return error.response?.data?.message || 'Erro ao processar a requisição';
};

/**
 * Serviço responsável por gerenciar as operações de caixa
 */
export const CaixaService = {
  /**
   * Verifica o status atual do caixa
   */
  async checkStatus(): Promise<CaixaStatus> {
    try {
      const response = await api.get('/caixa/status');
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar status do caixa:', error);
      throw error;
    }
  },

  /**
   * Abre um novo caixa com saldo inicial
   */
  async openCaixa(
    saldoInicial: number,
    userId: number,
    observacao?: string
  ): Promise<Caixa> {
    try {
      const response = await api.post('/caixa/open', {
        saldo_inicial: saldoInicial,
        observation: observacao,
        user_id: userId,
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao abrir caixa:', error);
      throw error;
    }
  },

  /**
   * Fecha um caixa
   */
  async closeCaixa(
    caixaId: number,
    saldoFinal: number,
    observacao?: string
  ): Promise<Caixa> {
    try {
      const response = await api.post(`/caixa/${caixaId}/close`, {
        saldo_final: saldoFinal,
        observation: observacao,
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao fechar caixa:', error);
      throw error;
    }
  },

  /**
   * Lista todas as movimentações do caixa atual
   */
  async getMovimentacoes(caixaId?: number): Promise<MovimentacaoCaixa[]> {
    try {
      // Se um caixaId foi fornecido, busca movimentações específicas desse caixa
      const url = caixaId
        ? `/caixa/${caixaId}/movimentacoes`
        : '/caixa/movimentacoes';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar movimentações:', error);
      throw error;
    }
  },

  /**
   * Busca as movimentações de um caixa específico
   */
  async getMovimentacoesByCaixa(caixaId: number): Promise<MovimentacaoCaixa[]> {
    try {
      const response = await api.get(`/caixa/${caixaId}/movimentacoes`);
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao buscar movimentações do caixa #${caixaId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Cria uma nova movimentação (entrada ou saída)
   */
  async createMovimentacao(
    params: MovimentacaoParams
  ): Promise<MovimentacaoCaixa> {
    try {
      const { caixa_id, ...movimentacaoData } = params;

      const response = await api.post(
        `/caixa/${caixa_id}/movimentacao`,
        movimentacaoData
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao criar movimentação:', error);
      throw error;
    }
  },

  /**
   * Cria uma movimentação a partir de um pedido
   */
  async createMovimentacaoFromPedido(
    caixaId: number,
    pedidoId: number,
    paymentMethod: string
  ): Promise<MovimentacaoCaixa> {
    try {
      const response = await api.post(
        `/caixa/${caixaId}/pedido/${pedidoId}/movimentacao`,
        {
          payment_method: paymentMethod,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao criar movimentação do pedido:', error);
      throw error;
    }
  },

  /**
   * Gera um relatório do caixa
   */
  async getReport(caixaId: number): Promise<ReportResponse> {
    try {
      const response = await api.get(`/caixa/${caixaId}/report`);
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar relatório do caixa:', error);
      throw error;
    }
  },

  /**
   * Lista o histórico de caixas
   */
  async getHistorico(
    filters: HistoricoFilters = {}
  ): Promise<CaixaHistoricoResponse> {
    try {
      const params = new URLSearchParams();

      // Adicionar parâmetros apenas se estiverem definidos
      if (filters.data_inicio)
        params.append('data_inicio', filters.data_inicio);
      if (filters.data_fim) params.append('data_fim', filters.data_fim);
      if (filters.user_id) params.append('user_id', filters.user_id.toString());
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.per_page)
        params.append('per_page', filters.per_page.toString());

      const response = await api.get(`/caixa/historico?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Busca os detalhes de um caixa específico
   */
  async getCaixaById(caixaId: number): Promise<Caixa> {
    try {
      const response = await api.get(`/caixa/${caixaId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar caixa #${caixaId}:`, error);
      throw error;
    }
  },

  /**
   * Obtém o histórico de caixas com filtros opcionais
   */
  async getDetalhes(caixaId: number): Promise<CaixaDetalhesResponse> {
    try {
      const response = await api.get(`/caixa/${caixaId}/detalhes`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Obtém o consolidado de caixas em um período
   */
  async getConsolidado(
    dataInicio?: string,
    dataFim?: string
  ): Promise<ConsolidadoCaixas> {
    try {
      const params = new URLSearchParams();

      if (dataInicio) params.append('data_inicio', dataInicio);
      if (dataFim) params.append('data_fim', dataFim);

      const response = await api.get(`/caixa/consolidado?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Baixa o PDF do relatório consolidado diretamente do backend
   */
  async downloadConsolidadoPDF(
    dataInicio?: string,
    dataFim?: string
  ): Promise<void> {
    try {
      const params = new URLSearchParams();

      if (dataInicio) params.append('data_inicio', dataInicio);
      if (dataFim) params.append('data_fim', dataFim);

      // Faz a requisição com responseType blob para receber o PDF
      const response = await api.get(
        `/caixa/consolidado/pdf?${params.toString()}`,
        {
          responseType: 'blob',
        }
      );

      // Cria um objeto URL para o blob recebido
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Cria um elemento <a> para iniciar o download
      const link = document.createElement('a');
      link.href = url;
      link.download = `LesAmis_RelatorioConsolidado_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Limpa o objeto URL e remove o elemento <a>
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
    } catch (error) {
      console.error('Erro ao baixar PDF do relatório consolidado:', error);
      throw handleApiError(error);
    }
  },
};

export default CaixaService;

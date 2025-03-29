import { api } from '@/app/api/api';
import {
  Caixa,
  MovimentacaoCaixa,
  RelatorioCaixa,
  StatusCaixaResponse,
  AbrirCaixaRequest,
  FecharCaixaRequest,
  CriarMovimentacaoRequest,
} from '@/types/caixa';
import { gerarNotificacao } from '@/utils/toast';

class CaixaService {
  /**
   * Abre um novo caixa
   */
  async abrirCaixa(dados: AbrirCaixaRequest): Promise<Caixa> {
    try {
      const response = await api.post('/caixa/open', dados);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao abrir caixa:', error);
      gerarNotificacao(
        'error',
        error.response?.data?.message || 'Erro ao abrir caixa'
      );
      throw new Error(error.response?.data?.message || 'Erro desconhecido');
    }
  }

  /**
   * Verifica o status do caixa atual
   */
  async obterStatusCaixa(): Promise<StatusCaixaResponse> {
    try {
      console.log('[CaixaService] Verificando status do caixa');
      const response = await api.get('/caixa/status');
      console.log('[CaixaService] Resposta da API:', response.data);

      // Verificar se a resposta está vazia
      if (!response.data || Object.keys(response.data).length === 0) {
        console.log('[CaixaService] Resposta vazia do backend');
        return {
          status: 'none',
        };
      }

      // Verificação mais robusta para detectar mensagem de "nenhum caixa aberto"
      if (
        response.data.message &&
        typeof response.data.message === 'string' &&
        response.data.message.includes('Nenhum caixa aberto')
      ) {
        console.log(
          '[CaixaService] Nenhum caixa aberto detectado pela mensagem'
        );
        return {
          status: 'none',
        };
      }

      // Se temos um ID e não temos mensagem de erro, assume que o caixa está aberto
      if (response.data.id) {
        console.log('[CaixaService] Caixa aberto encontrado:', {
          id: response.data.id,
          status: response.data.status || 'open', // Se não vier status, assume 'open'
          open_date: response.data.open_date,
        });

        return {
          id: response.data.id,
          saldo_inicial: response.data.saldo_inicial,
          open_date: response.data.open_date,
          status: response.data.status || 'open',
        };
      }

      // Caso de fallback - se não temos ID nem mensagem clara
      console.log(
        '[CaixaService] Resposta não reconhecida, assumindo nenhum caixa aberto'
      );
      return { status: 'none' };
    } catch (error: any) {
      console.error('[CaixaService] Erro ao verificar status do caixa:', error);
      console.error('[CaixaService] Detalhes do erro:', error.response?.data);
      return { status: 'none' };
    }
  }

  /**
   * Fecha um caixa aberto
   */
  async fecharCaixa(id: number, dados: FecharCaixaRequest): Promise<Caixa> {
    try {
      const response = await api.post(`/caixa/${id}/close`, dados);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao fechar caixa:', error);
      gerarNotificacao(
        'error',
        error.response?.data?.message || 'Erro ao fechar caixa'
      );
      throw new Error(error.response?.data?.message || 'Erro desconhecido');
    }
  }

  /**
   * Cria uma nova movimentação no caixa
   */
  async criarMovimentacao(
    caixaId: number,
    dados: CriarMovimentacaoRequest
  ): Promise<MovimentacaoCaixa> {
    try {
      const response = await api.post(`/caixa/${caixaId}/movimentacao`, dados);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar movimentação:', error);
      gerarNotificacao(
        'error',
        error.response?.data?.message || 'Erro ao criar movimentação'
      );
      throw new Error(error.response?.data?.message || 'Erro desconhecido');
    }
  }

  /**
   * Cria uma movimentação a partir de um pedido
   */
  async criarMovimentacaoDePedido(
    caixaId: number,
    pedidoId: number
  ): Promise<MovimentacaoCaixa> {
    try {
      const response = await api.post(
        `/caixa/${caixaId}/pedido/${pedidoId}/movimentacao`
      );
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar movimentação de pedido:', error);
      gerarNotificacao(
        'error',
        error.response?.data?.message || 'Erro ao criar movimentação de pedido'
      );
      throw new Error(error.response?.data?.message || 'Erro desconhecido');
    }
  }

  /**
   * Obtém todas as movimentações
   */
  async obterMovimentacoes(): Promise<MovimentacaoCaixa[]> {
    try {
      const response = await api.get('/caixa/movimentacoes');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao obter movimentações:', error);
      gerarNotificacao(
        'error',
        error.response?.data?.message || 'Erro ao obter movimentações'
      );
      throw new Error(error.response?.data?.message || 'Erro desconhecido');
    }
  }

  /**
   * Obtém o relatório de um caixa
   */
  async obterRelatorioCaixa(caixaId: number): Promise<RelatorioCaixa> {
    try {
      const response = await api.get(`/caixa/${caixaId}/report`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao obter relatório do caixa:', error);
      gerarNotificacao(
        'error',
        error.response?.data?.message || 'Erro ao obter relatório do caixa'
      );
      throw new Error(error.response?.data?.message || 'Erro desconhecido');
    }
  }
}

// Exportando como singleton para melhor gerenciamento de estado
export default new CaixaService();

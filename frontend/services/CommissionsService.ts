import { api } from '@/app/api/api';
import { gerarNotificacao } from '@/utils/toast';

export interface Commission {
  id: number;
  pedido_id: number;
  vendedor_id: number;
  produto_id: number;
  valor: number;
  quantity: number;
  percentual: number;
  status: string;
  created_at: string;
  updated_at: string;
  pedido?: {
    id: number;
    total: number;
    status: string;
    created_at: string;
  };
  produto?: {
    id: number;
    name: string;
    preco: number;
  };
  vendedor?: {
    id: number;
    name: string;
  };
}

export interface CommissionSummary {
  vendedor_id: number;
  comissao_total: number;
  comissoes: Commission[];
  vendedor?: {
    id: number;
    name: string;
  };
  dataInicial?: string;
  dataFinal?: string;
}

class CommissionsService {
  /**
   * Obtém todas as comissões
   */
  async getAllCommissions(): Promise<Commission[]> {
    try {
      const response = await api.get('/relatorios/comissoes');
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Erro ao buscar comissões');
    } catch (error: any) {
      console.error('Erro ao buscar comissões:', error);
      gerarNotificacao(
        'error',
        error.response?.data?.message || 'Erro ao buscar comissões'
      );
      throw error;
    }
  }

  /**
   * Obtém as comissões de um vendedor específico
   */
  async getCommissionsByVendedor(
    vendedorId: number
  ): Promise<CommissionSummary> {
    try {
      const response = await api.get(
        `/relatorios/comissoes/vendedor/${vendedorId}`
      );
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(
        response.data.message || 'Erro ao buscar comissões do vendedor'
      );
    } catch (error: any) {
      console.error('Erro ao buscar comissões do vendedor:', error);
      gerarNotificacao(
        'error',
        error.response?.data?.message || 'Erro ao buscar comissões do vendedor'
      );
      throw error;
    }
  }

  /**
   * Obtém as comissões de um vendedor por período
   */
  async getCommissionsByVendedorAndDate(
    vendedorId: number,
    dataInicial: string,
    dataFinal: string
  ): Promise<CommissionSummary> {
    try {
      const response = await api.get(
        `/relatorios/comissoes/vendedor/${vendedorId}/comissoes`,
        {
          params: {
            data_inicial: dataInicial,
            data_final: dataFinal,
          },
        }
      );
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(
        response.data.message ||
          'Erro ao buscar comissões do vendedor por período'
      );
    } catch (error: any) {
      console.error('Erro ao buscar comissões do vendedor por período:', error);
      gerarNotificacao(
        'error',
        error.response?.data?.message ||
          'Erro ao buscar comissões do vendedor por período'
      );
      throw error;
    }
  }
}

// Exportando como singleton para melhor gerenciamento de estado
export default new CommissionsService();

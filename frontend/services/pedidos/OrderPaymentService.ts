import { api } from '@/app/api/api';
import { gerarNotificacao } from '@/utils/toast';

export interface PaymentRecord {
  pedido_id: number;
  payment_method_id: number;
  amount: number;
  status?: string;
  transaction_details?: Record<string, any>;
}

export interface PaymentUpdateRequest {
  pedido_id: number;
  payment_id?: number;
  status: string;
}

class OrderPaymentService {
  /**
   * Registra um novo pagamento para um pedido
   */
  async registerPayment(data: PaymentRecord): Promise<any> {
    try {
      const response = await api.post(`/pagamentos/${data.pedido_id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao registrar pagamento:', error);
      gerarNotificacao(
        error.response?.data?.message || 'Erro ao registrar pagamento',
        'error'
      );
      throw error;
    }
  }

  /**
   * Atualiza o status de um pedido após pagamento
   */
  async updateOrderStatus(orderId: number, status: string): Promise<any> {
    try {
      const response = await api.put(`/pedidos/${orderId}`, { status });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar status do pedido:', error);
      gerarNotificacao(
        error.response?.data?.message || 'Erro ao atualizar status do pedido',
        'error'
      );
      throw error;
    }
  }

  /**
   * Busca os pagamentos de um pedido específico
   */
  async getOrderPayments(orderId: number): Promise<any> {
    try {
      const response = await api.get(`/pagamentos/${orderId}`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar pagamentos do pedido:', error);
      // Não exibir notificação pois pode ser uma consulta silenciosa
      throw error;
    }
  }

  /**
   * Calcula o valor restante a ser pago em um pedido
   */
  calculateRemainingAmount(
    total: number,
    discount: number = 0,
    paidAmount: number = 0
  ): number {
    return Math.max(0, total - discount - paidAmount);
  }
}

export const orderPaymentService = new OrderPaymentService();

import { api } from '@/app/api/api';
import { gerarNotificacao } from '@/utils/toast';

class CreatePaymentService {
  async createPayment(paymentData: any, pedidoId: string): Promise<any> {
    try {
      api
        .post(`/pagamentos/${pedidoId}`, paymentData)
        .then((response) => {
          gerarNotificacao('success', 'Pagamento criado com sucesso!');
          return response.data;
        })
        .catch((error) => {
          gerarNotificacao('error', 'Erro ao criar pagamento');
          throw error;
        });
    } catch (error) {
      gerarNotificacao('error', 'Erro ao criar pagamento');
      throw error;
    }
  }
}

export const createPaymentService = new CreatePaymentService();

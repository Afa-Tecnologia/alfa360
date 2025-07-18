import { createPaymentService } from '@/services/pagamentos/CreatePaymentService';

export const paymentService = {
  async getPaymentMethods() {
    // TODO: Implementar chamada real à API de métodos de pagamento
    // Exemplo:
    // return api.get('/payment-methods');
    return Promise.resolve([
      { code: 'MONEY', name: 'Dinheiro' },
      { code: 'CREDIT_CARD', name: 'Cartão de Crédito' },
      { code: 'DEBIT_CARD', name: 'Cartão de Débito' },
      { code: 'PIX', name: 'Pix' },
    ]);
  },
  async processPayment(paymentData: any, pedidoId: number) {
    return createPaymentService.createPayment(paymentData, pedidoId.toString());
  },
};

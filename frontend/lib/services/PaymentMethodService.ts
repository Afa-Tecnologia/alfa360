import { api } from '@/app/api/api';
import { PaymentMethod } from '@/stores/paymentMethodStore';

class PaymentMethodService {
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await api.get('/payment-methods');
    return response.data;
  }

  async createPaymentMethod(
    paymentMethod: Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'>
  ): Promise<PaymentMethod> {
    const response = await api.post('/payment-methods', paymentMethod);
    return response.data;
  }

  async updatePaymentMethod(
    id: number,
    paymentMethod: Partial<PaymentMethod>
  ): Promise<PaymentMethod> {
    const response = await api.put(`/payment-methods/${id}`, paymentMethod);
    return response.data;
  }

  async deletePaymentMethod(id: number): Promise<void> {
    await api.delete(`/payment-methods/${id}`);
  }
}

export const paymentMethodService = new PaymentMethodService();

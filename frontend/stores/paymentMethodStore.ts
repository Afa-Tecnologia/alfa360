import { create } from 'zustand';
import { paymentMethodService } from '@/lib/services/PaymentMethodService';

export interface PaymentMethod {
  id: number;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface PaymentMethodStore {
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  fetchPaymentMethods: () => Promise<void>;
  addPaymentMethod: (
    paymentMethod: Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'>
  ) => Promise<void>;
  updatePaymentMethod: (
    id: number,
    paymentMethod: Partial<PaymentMethod>
  ) => Promise<void>;
  deletePaymentMethod: (id: number) => Promise<void>;
}

export const usePaymentMethodStore = create<PaymentMethodStore>((set) => ({
  paymentMethods: [],
  isLoading: false,
  fetchPaymentMethods: async () => {
    set({ isLoading: true });
    try {
      const methods = await paymentMethodService.getPaymentMethods();
      set({ paymentMethods: methods });
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  addPaymentMethod: async (paymentMethod) => {
    try {
      const newMethod =
        await paymentMethodService.createPaymentMethod(paymentMethod);
      set((state) => ({
        paymentMethods: [...state.paymentMethods, newMethod],
      }));
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  },
  updatePaymentMethod: async (id, paymentMethod) => {
    try {
      const updatedMethod = await paymentMethodService.updatePaymentMethod(
        id,
        paymentMethod
      );
      set((state) => ({
        paymentMethods: state.paymentMethods.map((method) =>
          method.id === id ? updatedMethod : method
        ),
      }));
    } catch (error) {
      console.error('Error updating payment method:', error);
      throw error;
    }
  },
  deletePaymentMethod: async (id) => {
    try {
      await paymentMethodService.deletePaymentMethod(id);
      set((state) => ({
        paymentMethods: state.paymentMethods.filter(
          (method) => method.id !== id
        ),
      }));
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  },
}));

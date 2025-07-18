import { useState } from 'react';
import { salesService } from '../services/salesService';
import { paymentService } from '../services/paymentService';

export function useSales() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSale = async (pedido: any, paymentData: any) => {
    setIsProcessing(true);
    setError(null);
    try {
      const response = await salesService.createPedido(pedido);
      if (!response) throw new Error('Erro ao criar pedido');
      const pedidoId = response.pedido.id;
      // Processar pagamentos
      await paymentService.processPayment(paymentData, pedidoId);
      return pedidoId;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  return { createSale, isProcessing, error };
}

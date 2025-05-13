import { useState, useEffect } from 'react';
import { OrderDetail, OrderStatus } from '@/types/order';
import { ordersService } from '@/services/pedidos/OrdersService';
import { paymentMethodService } from '@/lib/services/PaymentMethodService';
import { PaymentMethod } from '@/stores/paymentMethodStore';
import { PaymentCalculationService } from '@/services/pedidos/PaymentCalculationService';
import { gerarNotificacao } from '@/utils/toast';

interface OrderDetailsResult {
  order: OrderDetail | null;
  loading: boolean;
  orderPayments: any[];
  loadingPayments: boolean;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: number | null;
  selectedPaymentMethodCode: string;
  paymentAmount: number | string;
  processingPayment: boolean;
  paymentStatus: {
    total: number;
    discount: number;
    totalAfterDiscount: number;
    paid: number;
    remaining: number;
    isFullyPaid: boolean;
  };
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSelectedPaymentMethod: (id: number) => void;
  setSelectedPaymentMethodCode: (code: string) => void;
  setPaymentAmount: (amount: number | string) => void;
  handleRegisterPayment: () => Promise<void>;
  fetchOrderDetails: () => Promise<void>;
  handleSetPaymentMethod: (id: number, code: string) => void;
}

const paymentCalculationService = new PaymentCalculationService();

/**
 * Hook for managing order details and payment operations
 */
export function useOrderDetails(
  orderId: number,
  onStatusUpdate?: (status: string) => void
): OrderDetailsResult {
  // Order state
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    number | null
  >(null);
  const [selectedPaymentMethodCode, setSelectedPaymentMethodCode] =
    useState<string>('');

  // Payment state
  const [paymentAmount, setPaymentAmount] = useState<number | string>('');
  const [processingPayment, setProcessingPayment] = useState(false);

  // Payments history
  const [orderPayments, setOrderPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  // Fetch order details
  const fetchOrderDetails = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      const data = await ordersService.getOrderDetails(orderId);
      setOrder(data);

      // Fetch payments
      await fetchOrderPayments();

      // Set default payment amount if it's the first load
      if (data && paymentAmount === '') {
        const status = paymentCalculationService.calculatePaymentStatus(
          data,
          orderPayments
        );
        setPaymentAmount(status.remaining);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch order payments
  const fetchOrderPayments = async () => {
    if (!orderId) return;

    try {
      setLoadingPayments(true);
      const data = await ordersService.getOrderPayments(orderId);
      setOrderPayments(data.pagamentos || []);
    } catch (error) {
      console.error('Erro ao carregar pagamentos do pedido:', error);
    } finally {
      setLoadingPayments(false);
    }
  };

  // Fetch payment methods
  const fetchPaymentMethods = async () => {
    try {
      const methods = await paymentMethodService.getPaymentMethods();
      setPaymentMethods(methods);
      if (methods.length > 0) {
        setSelectedPaymentMethod(methods[0].id);
        setSelectedPaymentMethodCode(methods[0].code);
      }
    } catch (error) {
      console.error('Erro ao carregar métodos de pagamento:', error);
    }
  };

  // Set payment method and its code
  const handleSetPaymentMethod = (id: number, code: string) => {
    setSelectedPaymentMethod(id);
    setSelectedPaymentMethodCode(code);
  };

  // Calculate payment status
  const calculatePaymentStatus = () => {
    return paymentCalculationService.calculatePaymentStatus(
      order,
      orderPayments
    );
  };

  // Register a new payment
  const handleRegisterPayment = async () => {
    if (!order || !selectedPaymentMethodCode || !paymentAmount) {
      gerarNotificacao('Preencha todos os campos de pagamento', 'error');
      return;
    }

    try {
      setProcessingPayment(true);

      const amount =
        typeof paymentAmount === 'string'
          ? parseFloat(paymentAmount.replace(',', '.'))
          : paymentAmount;

      const { remaining } = calculatePaymentStatus();
      const isFullPayment = amount >= remaining;

      if (amount <= 0) {
        gerarNotificacao(
          'O valor do pagamento deve ser maior que zero',
          'error'
        );
        return;
      }

      if (amount > remaining) {
        gerarNotificacao(`O valor máximo para pagamento é ${amount}`, 'error');
        return;
      }

      const nextStatus = paymentCalculationService.determineNextStatus(
        isFullPayment,
        order.status
      );

      // Payment payload
      const paymentPayload = {
        payment_method_code: selectedPaymentMethodCode,
        total: amount,
      };

      // Process payment based on type
      if (isFullPayment) {
        await ordersService.confirmFullPayment(order.id, paymentPayload);
      } else {
        await ordersService.recordPartialPayment(order.id, paymentPayload);
      }

      // Update UI
      if (onStatusUpdate) {
        onStatusUpdate(nextStatus);
      }

      // Reload data
      await fetchOrderPayments();
      await fetchOrderDetails();

      // Reset form
      setPaymentAmount('');

      gerarNotificacao('Pagamento registrado com sucesso', 'sucesso');
      setActiveTab('details');
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      gerarNotificacao('Erro ao registrar pagamento', 'error');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
      fetchPaymentMethods();
    }
  }, [orderId]);

  // Calculate payment status for render
  const paymentStatus = calculatePaymentStatus();

  return {
    order,
    loading,
    orderPayments,
    loadingPayments,
    paymentMethods,
    selectedPaymentMethod,
    selectedPaymentMethodCode,
    paymentAmount,
    processingPayment,
    paymentStatus,
    activeTab,
    setActiveTab,
    setSelectedPaymentMethod,
    setSelectedPaymentMethodCode,
    setPaymentAmount,
    handleRegisterPayment,
    fetchOrderDetails,
    handleSetPaymentMethod,
  };
}

'use client';

import { useState, useCallback, useEffect } from 'react';
import { Order, OrderDetail, OrderFilters, OrderStatus } from '@/types/order';
import { ordersService } from '@/services/pedidos/OrdersService';
import { orderPaymentService } from '@/services/pedidos/OrderPaymentService';

interface UseOrdersManagementProps {
  initialFilters?: Partial<OrderFilters>;
  autoLoad?: boolean;
}

export function useOrdersManagement({
  initialFilters,
  autoLoad = true,
}: UseOrdersManagementProps = {}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<OrderFilters>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    page: 1,
    limit: 10,
    ...initialFilters,
  });

  // Carregar lista de pedidos
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ordersService.getOrders({
        ...filters,
        page,
      });
      setOrders(response.data);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  // Carregar detalhes de um pedido
  const fetchOrderDetails = useCallback(async (orderId: number) => {
    try {
      setDetailLoading(true);
      const data = await ordersService.getOrderDetails(orderId);
      setOrderDetail(data);
      return data;
    } catch (error) {
      console.error(`Erro ao carregar detalhes do pedido ${orderId}:`, error);
      return null;
    } finally {
      setDetailLoading(false);
    }
  }, []);

  // Atualizar filtros
  const updateFilters = useCallback((newFilters: Partial<OrderFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  }, []);

  // Selecionar um pedido
  const selectOrder = useCallback(
    (order: Order) => {
      setSelectedOrder(order);
      fetchOrderDetails(order.id);
    },
    [fetchOrderDetails]
  );

  // Registrar pagamento
  const registerPayment = useCallback(
    async (
      orderId: number,
      paymentMethodId: number,
      amount: number,
      isFullPayment: boolean
    ) => {
      try {
        setDetailLoading(true);

        if (isFullPayment) {
          await ordersService.confirmFullPayment(
            orderId,
            paymentMethodId,
            amount
          );
        } else {
          await ordersService.recordPartialPayment(
            orderId,
            paymentMethodId,
            amount
          );
        }

        // Recarregar dados
        await fetchOrders();
        if (selectedOrder?.id === orderId) {
          await fetchOrderDetails(orderId);
        }

        return true;
      } catch (error) {
        console.error('Erro ao registrar pagamento:', error);
        return false;
      } finally {
        setDetailLoading(false);
      }
    },
    [fetchOrders, fetchOrderDetails, selectedOrder]
  );

  // Atualizar status
  const updateOrderStatus = useCallback(
    async (orderId: number, status: OrderStatus) => {
      try {
        setDetailLoading(true);
        await ordersService.updateOrderStatus(orderId, status);

        // Recarregar dados
        await fetchOrders();
        if (selectedOrder?.id === orderId) {
          await fetchOrderDetails(orderId);
        }

        return true;
      } catch (error) {
        console.error('Erro ao atualizar status:', error);
        return false;
      } finally {
        setDetailLoading(false);
      }
    },
    [fetchOrders, fetchOrderDetails, selectedOrder]
  );

  // Calcular valores de pagamento
  const calculatePaymentValues = useCallback((order: OrderDetail) => {
    const total = order.total || 0;
    const discount = order.discount || 0;
    const totalAfterDiscount = total - discount;

    const paid =
      order.payments?.reduce(
        (sum, payment) =>
          sum + (payment.status === 'CAPTURED' ? payment.amount : 0),
        0
      ) || 0;

    const remaining = Math.max(0, totalAfterDiscount - paid);
    const isFullyPaid = remaining === 0;

    return {
      total,
      discount,
      totalAfterDiscount,
      paid,
      remaining,
      isFullyPaid,
    };
  }, []);

  // Carregar pedidos automaticamente
  useEffect(() => {
    if (autoLoad) {
      fetchOrders();
    }
  }, [autoLoad, fetchOrders]);

  return {
    orders,
    loading,
    page,
    totalPages,
    totalItems,
    filters,
    selectedOrder,
    orderDetail,
    detailLoading,
    setPage,
    updateFilters,
    fetchOrders,
    selectOrder,
    fetchOrderDetails,
    registerPayment,
    updateOrderStatus,
    calculatePaymentValues,
  };
}

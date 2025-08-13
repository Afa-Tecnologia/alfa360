import { api } from '@/app/api/api';
import {
  Order,
  OrderDetail,
  OrderFilters,
  OrdersResponse,
} from '@/types/order';
import { gerarNotificacao } from '@/utils/toast';

class OrdersService {
  /**
   * Busca todos os pedidos com filtros opcionais
   */
  async getOrders(filters?: OrderFilters): Promise<OrdersResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (filters?.startDate)
        queryParams.append('data_inicial', filters.startDate);
      if (filters?.endDate) queryParams.append('data_final', filters.endDate);
      if (filters?.vendorId)
        queryParams.append('vendedor_id', filters.vendorId.toString());
      if (filters?.categoryId)
        queryParams.append('categoria_id', filters.categoryId.toString());
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.customerName)
        queryParams.append('cliente_nome', filters.customerName);
      if (filters?.paymentMethod)
        queryParams.append('forma_pagamento', filters.paymentMethod);
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit)
        queryParams.append('limit', (filters.limit || 10).toString());

      // Usando o endpoint correto de relatórios/pedidos
      const url = `/relatorios/pedidos?${queryParams.toString()}`;

      const response = await api.get(url);

      const responseData = Array.isArray(response.data)
        ? response.data
        : response.data;

      // Se a resposta já estiver no formato esperado (com data, totalPages, etc.), retorná-la diretamente
      if (
        responseData.data &&
        responseData.totalPages &&
        responseData.totalItems
      ) {
        return responseData as OrdersResponse;
      }

      // Caso contrário, fazer a transformação (isso é um fallback, não deveria ser necessário)
      const mappedData = Array.isArray(responseData)
        ? responseData.map(this.mapOrderData)
        : (responseData.data || []).map(this.mapOrderData);

      const formattedResponse: OrdersResponse = {
        data: mappedData,
        totalPages: responseData.totalPages || 1,
        currentPage: responseData.currentPage || filters?.page || 1,
        totalItems: responseData.totalItems || mappedData.length,
      };

      return formattedResponse;
    } catch (error: any) {
      console.error('Erro ao buscar pedidos:', error);
      throw error;
    }
  }

  // Função auxiliar para mapear os dados do pedido se necessário
  private mapOrderData(item: any): Order {
    return {
      id: item.id,
      createdAt: item.created_at || new Date().toISOString(),
      customerName: `Cliente #${item.cliente_id || 'desconhecido'}`,
      total: item.total || 0,
      status: item.status || 'PENDING',
      vendorName: item.vendedor?.name || 'N/A',
      paymentMethod: 'N/A',
      discount: item.desconto || 0,
      paidAmount: item.paidAmount || 0,
    };
  }

  /**
   * Busca detalhes de um pedido específico
   */
  async getOrderDetails(orderId: number): Promise<OrderDetail> {
    try {
      const response = await api.get(`/pedidos/${orderId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao buscar detalhes do pedido ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Atualiza o status de um pedido
   */
  async updateOrderStatus(
    orderId: number,
    status: string,
    additionalData?: Record<string, any>
  ): Promise<Order> {
    try {
      const payload = {
        status,
        ...additionalData,
      };

      const response = await api.put(`/pedidos/${orderId}`, payload);
      gerarNotificacao(`Status do pedido atualizado para ${status}`, 'sucesso');
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao atualizar status do pedido ${orderId}:`, error);
      gerarNotificacao(
        error.response?.data?.message || 'Erro ao atualizar status do pedido',
        'error'
      );
      throw error;
    }
  }

  /**
   * Cancela um pedido
   */
  async cancelOrder(orderId: number, reason?: string): Promise<Order> {
    try {
      const payload = {
        status: 'CANCELLED',
        cancellation_reason: reason,
      };

      const response = await api.put(`/pedidos/${orderId}`, payload);
      gerarNotificacao('Pedido cancelado com sucesso', 'sucesso');
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao cancelar o pedido ${orderId}:`, error);
      gerarNotificacao(
        error.response?.data?.message || 'Erro ao cancelar o pedido',
        'error'
      );
      throw error;
    }
  }

  /**
   * Registra um pagamento parcial em um pedido
   */
  async recordPartialPayment(
    orderId: number,
    paymentData: { payment_method_code: string; total: number }
  ): Promise<any> {
    try {
      // Registrar o pagamento
      const paymentResponse = await api.post(
        `/pagamentos/${orderId}`,
        paymentData
      );

      // Atualizar o status do pedido para pagamento parcial
      const orderResponse = await this.updateOrderStatus(
        orderId,
        'PARTIAL_PAYMENT'
      );

      gerarNotificacao('Pagamento parcial registrado com sucesso', 'sucesso');
      return {
        payment: paymentResponse.data,
        order: orderResponse,
      };
    } catch (error: any) {
      console.error(
        `Erro ao registrar pagamento parcial para o pedido ${orderId}:`,
        error
      );
      gerarNotificacao(
        error.response?.data?.message || 'Erro ao registrar pagamento parcial',
        'error'
      );
      throw error;
    }
  }

  /**
   * Registra um pagamento completo em um pedido
   */
  async confirmFullPayment(
    orderId: number,
    paymentData: { payment_method_code: string; total: number }
  ): Promise<any> {
    try {
      // Registrar o pagamento
      const paymentResponse = await api.post(
        `/pagamentos/${orderId}`,
        paymentData
      );

      // Atualizar o status do pedido para pagamento confirmado
      const orderResponse = await this.updateOrderStatus(
        orderId,
        'PAYMENT_CONFIRMED'
      );

      gerarNotificacao('Pagamento completo confirmado com sucesso', 'sucesso');
      return {
        payment: paymentResponse.data,
        order: orderResponse,
      };
    } catch (error: any) {
      console.error(
        `Erro ao confirmar pagamento completo para o pedido ${orderId}:`,
        error
      );
      gerarNotificacao(
        error.response?.data?.message || 'Erro ao confirmar pagamento completo',
        'error'
      );
      throw error;
    }
  }

  /**
   * Busca pagamentos de um pedido específico
   */
  async getOrderPayments(orderId: number): Promise<any> {
    try {
      const response = await api.get(`/pagamentos/${orderId}`);
      return {
        pagamentos: response.data,
      };
    } catch (error: any) {
      console.error(`Erro ao buscar pagamentos do pedido ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Deleta um pedido permanentemente
   */
  async deleteOrder(orderId: number): Promise<void> {
    try {
      await api.delete(`/pedidos/${orderId}`);
      gerarNotificacao('Pedido excluído com sucesso', 'sucesso');
    } catch (error: any) {
      console.error(`Erro ao excluir o pedido ${orderId}:`, error);
      gerarNotificacao(
        error.response?.data?.message || 'Erro ao excluir o pedido',
        'error'
      );
      throw error;
    }
  }
}

export const ordersService = new OrdersService();

import OrdersSales from '@/services/pedidos/SalesOrders';

export const salesService = {
  async createPedido(pedido: any) {
    return OrdersSales.createPedido(pedido);
  },
};

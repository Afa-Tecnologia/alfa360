
import { api } from '@/app/api/api';
import { CartItem } from '@/stores/cart-store';
import { gerarNotificacao } from '@/utils/toast';

interface PedidoRequest {
  vendedor_id: number | undefined;
  cliente_id: any;
  type: string;
  payment_method: string;
  desconto: number;
  produtos: {
    variante_id?: number;
    produto_id: number;
    quantidade: number;
  }[];
}

class OrdersSales {
  static async createPedido(request: PedidoRequest) {
    try {
      const response = await api.post('/pedidos', request);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar cliente:', error);
      gerarNotificacao(
        'error',
        error.response?.data?.message || 'Erro desconhecido'
      );
      throw new Error(error.response?.data?.message || 'Erro ao criar cliente');
    }
  }
  static async getPedidos() {
    
    try {
        const response = await api.get(`/pedidos`); 
        console.log(response.data)
        return response.data;
    } catch (error: any) {
        console.error("Erro ao buscar pedidos:", error);
        gerarNotificacao("error","Erro ao buscar pedidos");
        return "Erro ao buscar pedidos veja a API"
    }
  }

}
export default OrdersSales;
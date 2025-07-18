import { api } from '@/app/api/api';
// import { CartItem } from '@/stores/cart-store';
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

  // Função utilitária para processar as imagens
  private static processarImagens(item: any): any {
    // Cria uma cópia do item para não modificar o original
    const itemProcessado = { ...item };

    // Processa as variantes, se existirem
    if (itemProcessado.variants && Array.isArray(itemProcessado.variants)) {
      itemProcessado.variants = itemProcessado.variants.map((variant: any) => {
        const variantProcessada = { ...variant };

        // Se a variante tiver imagens como string JSON, converte para array
        if (
          variantProcessada.images &&
          typeof variantProcessada.images === 'string'
        ) {
          try {
            variantProcessada.images = JSON.parse(variantProcessada.images);
          } catch (error) {
            console.error('Erro ao processar JSON das imagens:', error);
            variantProcessada.images = [];
          }
        }

        return variantProcessada;
      });
    }

    // Se o próprio item tiver imagens como string JSON, converte para array
    if (itemProcessado.images && typeof itemProcessado.images === 'string') {
      try {
        itemProcessado.images = JSON.parse(itemProcessado.images);
      } catch (error) {
        console.error('Erro ao processar JSON das imagens do item:', error);
        itemProcessado.images = [];
      }
    }

    return itemProcessado;
  }

  static async getPedidos() {
    try {
      const response = await api.get(`/pedidos`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar pedidos:', error);
      gerarNotificacao('error', 'Erro ao buscar pedidos');
    }
  }
}
export default OrdersSales;


import { api } from '@/app/api/api';

type ItemDevolucao = {
  produto_id: number;
  variante_id: number;
  quantidade: number;
  valor_unitario: number;
};

type CriarDevolucaoParams = {
  pedido_id: number;
  cliente_id: number;
  motivo: string;
  tipo: 'parcial' | 'total';
  observacoes?: string;
  itens: ItemDevolucao[];
};

export async function criarDevolucao({
  pedido_id,
  cliente_id,
  motivo,
  tipo,
  observacoes,
  itens,
}: CriarDevolucaoParams) {
  try {
    const response = await api.post('/devolucoes', {
      data: {
        type: 'devolucoes',
        attributes: {
          pedido_id,
          cliente_id,
          motivo,
          tipo,
          observacoes,
          itens,
        },
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Erro ao criar devolução:', error);
    throw error;
  }
}

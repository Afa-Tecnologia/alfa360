import { api } from '@/app/api/api';

type CriarDevolucaoParams = {
  pedido_id: number;
  cliente_id: number;
  motivo: string;
  tipo: 'parcial' | 'total';
  observacao?: string;
};

export async function criarDevolucao({
  pedido_id,
  cliente_id,
  motivo,
  tipo,
  observacao,
}: CriarDevolucaoParams) {
  try {
    const response = await api.post('/devolucoes', {
      data: {
        type: 'devolucoes',
        attributes: {
          motivo,
          tipo,
          observacao,
        },
        relationships: {
          pedido: {
            data: {
              type: 'pedidos',
              id: String(pedido_id),
            },
          },
          cliente: {
            data: {
              type: 'clientes',
              id: String(cliente_id),
            },
          },
        },
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Erro ao criar devolução:', error);
    throw error;
  }
}

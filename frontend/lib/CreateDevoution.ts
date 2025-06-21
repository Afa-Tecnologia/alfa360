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
    const response = await api.post('v1/devolucoes', {
      "data": {
        "type": "devolucoes",
        "attributes": {
          "motivo": "defeito",
          "tipo": "parcial",
          "observacao": "Produtos chegaram danificados"
        },
        "relationships": {
          "pedido": {
            "data": { "type": "pedidos", "id": "1" }
          },
          "cliente": {
            "data": { "type": "clientes", "id": "1" }
          }
        }
      },
      "included": [
        {
          "type": "devolucao-itens",
          "attributes": {
            "quantidade": 2,
            "motivo": "Produto A defeituoso"
          },
          "relationships": {
            "produto": {
              "data": { "type": "produtos", "id": "1" }
            },
            "variante": {
              "data": { "type": "variantes", "id": "1" }
            }
          }
        },
        {
          "type": "devolucao-itens",
          "attributes": {
            "quantidade": 1,
            "motivo": "Produto B com avaria"
          },
          "relationships": {
            "produto": {
              "data": { "type": "produtos", "id": "2" }
            },
            "variante": {
              "data": { "type": "variantes", "id": "1" }
            }
          }
        }
      ]
    },{
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('Erro ao criar devolução:', error);
    throw error;
  }
}

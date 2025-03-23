import { api } from "@/app/api/api";
import { CartItem } from "@/stores/cart-store";
import { gerarNotificacao } from "@/utils/toast";

interface PedidoRequest {
  vendedor_id: number | undefined;
  cliente_id: any;
  type: string;
  forma_pagamento: string;
  desconto: number;
  produtos: {
      produto_id: number;
      quantidade: number;
  }[]
}

export async function createPedido(request: PedidoRequest) {
  try {
    const response = await api.post("/pedido", request);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar cliente:", error);
    gerarNotificacao("error", error.response?.data?.message || "Erro desconhecido");
    throw new Error(error.response?.data?.message || "Erro ao criar cliente");
  }
}

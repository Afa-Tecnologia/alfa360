import { api } from "@/app/api/api";
import { gerarNotificacao } from "@/utils/toast";

interface PedidoBody {

}

export async function createPedido(pedido: PedidoBody) {
  try {
    const response = await api.post("/pedido", pedido);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar cliente:", error);
    gerarNotificacao("error", error.response?.data?.message || "Erro desconhecido");
    throw new Error(error.response?.data?.message || "Erro ao criar cliente");
  }
}

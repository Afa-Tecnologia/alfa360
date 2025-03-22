import { api } from "@/app/api/api";
import { gerarNotificacao } from "@/utils/toast";

interface Customer {
  id: number;
 
}

export async function deleteClient(customer: Customer) {
  try {
    const response = await api.delete(`/clientes/${customer.id}`,);
   
    return response.data;
  } catch (error: any) {
    console.error("Erro ao deletar cliente:", error);
    gerarNotificacao("error", error.response?.data?.message || "Erro desconhecido");
    throw new Error(error.response?.data?.message || "Erro ao deletar cliente");
  }
}

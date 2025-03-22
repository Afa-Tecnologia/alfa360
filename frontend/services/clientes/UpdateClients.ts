import { api } from "@/app/api/api";
import { gerarNotificacao } from "@/utils/toast";

interface Customer {
    id: number;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  cpf: string;
  adress: string;
  city: string;
  state: string;
  cep: string;
  date_of_birth: string;
}

export async function updateClient(customer: Customer) {
  try {
    const response = await api.put(`/clientes/${customer.id}`, customer);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao atualizar cliente:", error);
    gerarNotificacao("error", error.response?.data?.message || "Erro desconhecido");
    throw new Error(error.response?.data?.message || "Erro ao atualizar cliente");
  }
}

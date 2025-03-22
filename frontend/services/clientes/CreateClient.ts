import { api } from "@/app/api/api";
import { gerarNotificacao } from "@/utils/toast";

interface Customer {
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

export async function createClient(customer: Customer) {
  try {
    const response = await api.post("/clientes", customer);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar cliente:", error);
    gerarNotificacao("error", error.response?.data?.message || "Erro desconhecido");
    throw new Error(error.response?.data?.message || "Erro ao criar cliente");
  }
}

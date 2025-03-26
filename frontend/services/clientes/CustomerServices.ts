import { api } from "@/app/api/api";
import { gerarNotificacao } from "@/utils/toast";

interface Customer {
  id?: number;
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

class CustomerService {
  static async getClientsId(id: number) {
    try {
      const response = await api.get(`/clientes/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar clientes:", error);
      gerarNotificacao("error", error.response?.data?.message || "Erro ao buscar clientes");
      return [];
    }
  }
  static async getClients() {
    try {
      const response = await api.get("/clientes");
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar clientes:", error);
      gerarNotificacao("error", error.response?.data?.message || "Erro ao buscar clientes");
      return [];
    }
  }

  static async createClient(customer: Customer) {
    try {
      const response = await api.post("/clientes", customer);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao criar cliente:", error);
      gerarNotificacao("error", error.response?.data?.message || "Erro desconhecido");
      throw new Error(error.response?.data?.message || "Erro ao criar cliente");
    }
  }

  static async updateClient(customer: Customer) {
    try {
      const response = await api.put(`/clientes/${customer.id}`, customer);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao atualizar cliente:", error);
      gerarNotificacao("error", error.response?.data?.message || "Erro desconhecido");
      throw new Error(error.response?.data?.message || "Erro ao atualizar cliente");
    }
  }

  static async deleteClient(id: number) {
    try {
      const response = await api.delete(`/clientes/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao deletar cliente:", error);
      gerarNotificacao("error", error.response?.data?.message || "Erro desconhecido");
      throw new Error(error.response?.data?.message || "Erro ao deletar cliente");
    }
  }

  static async refreshClients(
    setCustomers: Function,
    setFilteredCustomers: Function,
    setIsLoading: Function
  ) {
    setIsLoading(true);
    const customersData = await this.getClients();
    setCustomers(customersData);
    setFilteredCustomers(customersData);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }
}

export default CustomerService;

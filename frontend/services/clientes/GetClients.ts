import { api } from "@/app/api/api";
import { gerarNotificacao } from "@/utils/toast";

export default async function GetClients() {
    
        try {
            const response = await api.get(`/clientes`); 
            return response.data;
        } catch (error: any) {
            console.error("Erro ao buscar clientes:", error);
            gerarNotificacao("error", error.response?.data?.message || "Erro ao buscar clientes");
            return "Erro ao buscar clientes veja a API"
        }
    

}

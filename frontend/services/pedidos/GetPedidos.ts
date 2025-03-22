
import { api } from "@/app/api/api";
import { gerarNotificacao } from "@/utils/toast";

export default async function GetPedidos() {
    
        try {
            const response = await api.get(`/pedidos`); 
            console.log(response.data)
            return response.data;
        } catch (error: any) {
            console.error("Erro ao buscar pedidos:", error);
            gerarNotificacao("error", error.response?.data?.message || "Erro ao buscar pedidos");
            return "Erro ao buscar pedidos veja a API"
        }
    

}


import { api } from "@/app/api/api";
import { gerarNotificacao } from "@/utils/toast";

export default async function GetCategorys() {
    
        try {
            const response = await api.get(`/categorias`); 
            return response.data;
        } catch (error: any) {
            console.error("Erro ao buscar categorias:", error);
            gerarNotificacao("error", error.response?.data?.message || "Erro ao buscar categorias");
            return "Erro ao buscar categorias veja a API"
        }
    

}


import { api } from "@/app/api/api";
import { gerarNotificacao } from "@/utils/toast";

export default async function GetProducts() {
 
    
        try {
            const response = await api.get("/produtos"); // Alterado para GET
          
            console.log("DATA-PRODUCTS: ", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Erro ao buscar produtos:", error);
            gerarNotificacao("error", error.response?.data?.message || "Erro desconhecido");
            return "Erro ao buscar produtos veja a API"
        }
    

}

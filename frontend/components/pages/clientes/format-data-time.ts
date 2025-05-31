// utils/formatDateTime.ts
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDateTime(dateInput: string | Date | undefined | null) {
  if (!dateInput) return "Data não disponível";

  try {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

    if (isNaN(date.getTime())) {
      return "Data inválida";
    }

    return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "Data inválida";
  }
}

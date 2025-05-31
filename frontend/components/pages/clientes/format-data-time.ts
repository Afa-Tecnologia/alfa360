"use client"

import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
export function formatDateTime(dateString: string | undefined | null) {
    if (!dateString) return 'Data não disponível';

    try {
      const date = new Date(dateString);
      // Verifica se a data é válida
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
      return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  
}

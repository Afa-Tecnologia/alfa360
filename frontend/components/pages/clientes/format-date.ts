import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
export function formatDate(date: string | Date | null | undefined) {
  if (!date) return 'Data inválida';

  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(parsedDate.getTime())) {
    return 'Data inválida';
  }

  return format(parsedDate, 'dd/MM/yyyy', { locale: ptBR });
}

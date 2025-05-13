import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Safely format a date string with proper error handling
 */
export function formatDateSafely(
  dateString: any,
  formatStr: string = 'dd/MM/yyyy HH:mm'
): string {
  if (!dateString) return 'Data indisponível';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Data indisponível';

    return format(date, formatStr, { locale: ptBR });
  } catch (e) {
    console.error('Erro ao formatar data:', e);
    return 'Data indisponível';
  }
}

/**
 * Check if a date string is valid
 */
export function isValidDate(dateString: any): boolean {
  if (!dateString) return false;

  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch (e) {
    return false;
  }
}

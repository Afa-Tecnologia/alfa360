import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Constrói uma URL com parâmetros de consulta
 */
export function getUrl(path: string, params?: URLSearchParams): string {
  if (!params || params.toString() === '') {
    return path;
  }

  return `${path}?${params.toString()}`;
}

/**
 * Formata uma data no formato padrão do sistema (dd/mm/yyyy HH:MM)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

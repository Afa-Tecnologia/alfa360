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

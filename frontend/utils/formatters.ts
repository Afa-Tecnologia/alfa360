/**
 * Format a number as Brazilian currency (BRL)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Format a date string as dd/MM/yyyy
 */
export function formatDate(date: string | Date): string {
  if (!date) return '';

  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR');
}

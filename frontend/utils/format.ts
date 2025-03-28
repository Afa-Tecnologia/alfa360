/**
 * Formata um valor numérico para o formato de moeda brasileira (BRL)
 * @param value Valor numérico a ser formatado
 * @returns String formatada no padrão R$ 0,00
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata uma data no padrão brasileiro DD/MM/YYYY
 * @param date Data a ser formatada
 * @returns String formatada no padrão DD/MM/YYYY
 */
export function formatDate(date: Date | string): string {
  if (!date) return '';

  let dateObj: Date;

  if (typeof date === 'string') {
    // Primeiro tenta criar um objeto Date diretamente
    dateObj = new Date(date);

    // Se o resultado for inválido, tenta outros formatos
    if (isNaN(dateObj.getTime())) {
      // Tenta formato DD-MM-YYYY HH:MM:SS
      const matches = date.match(
        /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/
      );
      if (matches) {
        // Converte para formato YYYY-MM-DD HH:MM:SS
        dateObj = new Date(
          `${matches[3]}-${matches[2]}-${matches[1]}T${matches[4]}:${matches[5]}:${matches[6]}`
        );
      }

      // Se ainda for inválido, retorna string vazia
      if (isNaN(dateObj.getTime())) {
        console.warn(`Formato de data inválido: ${date}`);
        return '';
      }
    }
  } else {
    dateObj = date;
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Formata uma data com hora no padrão brasileiro DD/MM/YYYY HH:MM
 * @param date Data a ser formatada
 * @returns String formatada no padrão DD/MM/YYYY HH:MM
 */
export function formatDateTime(date: Date | string): string {
  if (!date) return '';

  let dateObj: Date;

  if (typeof date === 'string') {
    // Primeiro tenta criar um objeto Date diretamente
    dateObj = new Date(date);

    // Se o resultado for inválido, tenta outros formatos
    if (isNaN(dateObj.getTime())) {
      // Tenta formato DD-MM-YYYY HH:MM:SS
      const matches = date.match(
        /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/
      );
      if (matches) {
        // Converte para formato YYYY-MM-DD HH:MM:SS
        dateObj = new Date(
          `${matches[3]}-${matches[2]}-${matches[1]}T${matches[4]}:${matches[5]}:${matches[6]}`
        );
      }

      // Se ainda for inválido, retorna string vazia
      if (isNaN(dateObj.getTime())) {
        console.warn(`Formato de data inválido: ${date}`);
        return '';
      }
    }
  } else {
    dateObj = date;
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

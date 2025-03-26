import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
export function formatDateTime(dateString: string | Date | null | undefined) {
  if (!dateString) return 'Data inválida'; // Evita erros caso o valor seja null ou undefined

  try {
    const parsedDate = parse(
      dateString.toString(),
      'dd-MM-yyyy HH:mm:ss',
      new Date()
    );
    return format(parsedDate, 'dd/MM/yyyy HH:mm:ss', { locale: ptBR });
  } catch (error) {
    return 'Data inválida'; // Em caso de erro na conversão
  }
}

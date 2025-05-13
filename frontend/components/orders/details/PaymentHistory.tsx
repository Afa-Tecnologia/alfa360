import { formatCurrency } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Payment {
  id: number;
  total: string;
  status: string;
  created_at: string;
  metodo?: {
    name: string;
  };
  payment_method_id: number;
}

interface PaymentHistoryProps {
  payments: Payment[];
}

/**
 * Component to display payment history
 */
export function PaymentHistory({ payments }: PaymentHistoryProps) {
  if (!Array.isArray(payments) || payments.length === 0) {
    return null;
  }

  // Function to validate and format date safely
  const formatDateSafely = (dateString: any): string => {
    if (!dateString) return 'Data indisponível';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Data indisponível';

      return format(date, 'dd/MM/yyyy HH:mm', {
        locale: ptBR,
      });
    } catch (e) {
      console.error('Erro ao formatar data:', e);
      return 'Data indisponível';
    }
  };

  return (
    <div className="mt-6">
      <h3 className="font-medium mb-2">Histórico de Pagamentos</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-3 py-2 whitespace-nowrap text-sm">
                  {formatDateSafely(payment.created_at)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm">
                  {payment.metodo?.name ||
                    `Método #${payment.payment_method_id}`}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                  {formatCurrency(parseFloat(payment.total))}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm">
                  <Badge
                    variant={
                      payment.status === 'CAPTURED' ? 'default' : 'outline'
                    }
                  >
                    {payment.status === 'CAPTURED'
                      ? 'Confirmado'
                      : payment.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

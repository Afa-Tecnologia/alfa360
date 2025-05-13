import { formatCurrency } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import {
  CalendarIcon,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

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

  // Get status icon based on payment status
  const getStatusIcon = (status: string) => {
    if (status === 'CAPTURED') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <AlertCircle className="h-4 w-4 text-amber-500" />;
  };

  // Mobile view with cards
  const MobileView = () => (
    <div className="space-y-3 sm:hidden">
      {payments.map((payment) => (
        <Card key={payment.id} className="overflow-hidden">
          <CardContent className="p-3">
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium">
                {formatCurrency(parseFloat(payment.total))}
              </div>
              <Badge
                variant={payment.status === 'CAPTURED' ? 'default' : 'outline'}
                className="ml-auto"
              >
                <span className="flex items-center gap-1">
                  {getStatusIcon(payment.status)}
                  {payment.status === 'CAPTURED'
                    ? 'Confirmado'
                    : payment.status}
                </span>
              </Badge>
            </div>

            <div className="grid grid-cols-[20px_1fr] gap-x-2 gap-y-1 text-sm">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {formatDateSafely(payment.created_at)}
              </span>

              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {payment.metodo?.name || `Método #${payment.payment_method_id}`}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Desktop view with table
  const DesktopView = () => (
    <div className="overflow-x-auto rounded-md border hidden sm:block">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Data
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Método
            </th>
            <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Valor
            </th>
            <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-muted/50">
              <td className="px-3 py-2 whitespace-nowrap text-sm">
                {formatDateSafely(payment.created_at)}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm">
                {payment.metodo?.name || `Método #${payment.payment_method_id}`}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-right">
                {formatCurrency(parseFloat(payment.total))}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-center">
                <Badge
                  variant={
                    payment.status === 'CAPTURED' ? 'default' : 'outline'
                  }
                >
                  <span className="flex items-center gap-1">
                    {getStatusIcon(payment.status)}
                    {payment.status === 'CAPTURED'
                      ? 'Confirmado'
                      : payment.status}
                  </span>
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="mt-6">
      <h3 className="font-medium mb-3">Histórico de Pagamentos</h3>
      <MobileView />
      <DesktopView />
    </div>
  );
}

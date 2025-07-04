import { OrderDetail } from '@/types/order';
import { formatCurrency } from '@/utils/formatters';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Percent, CreditCard, AlertTriangle } from 'lucide-react';

interface PaymentStatusSummaryProps {
  order: OrderDetail;
  paymentStatus: {
    total: number;
    discount: number;
    totalAfterDiscount: number;
    paid: number;
    remaining: number;
    isFullyPaid: boolean;
  };
}

/**
 * Component to display payment status summary
 */
export function PaymentStatusSummary({
  order,
  paymentStatus,
}: PaymentStatusSummaryProps) {
  return (
    <div className="mt-6">
      <h3 className="font-medium mb-3">Status do Pagamento</h3>
      <Card>
        <CardContent className="p-4 bg-muted/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-muted/80 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="font-medium">
                  {formatCurrency(order.produtos.reduce((sum, produto) => sum + (+produto.selling_price * produto.pivot.quantidade), 0))}
                </p>
              </div>
            </div>

            {(order?.desconto ?? 0) > 0 && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center">
                  <Percent className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Desconto</p>
                  <p className="font-medium text-red-600">
                    -{formatCurrency(order?.desconto ?? 0)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Pago</p>
                <p className="font-medium text-green-600">
                  {formatCurrency(paymentStatus.paid)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full ${paymentStatus.remaining > 0 ? 'bg-orange-50' : 'bg-green-50'} flex items-center justify-center`}
              >
                <AlertTriangle
                  className={`h-4 w-4 ${paymentStatus.remaining > 0 ? 'text-orange-500' : 'text-green-500'}`}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Restante</p>
                <p
                  className={`font-medium ${paymentStatus.remaining > 0 ? 'text-orange-600' : 'text-green-600'}`}
                >
                  {formatCurrency(paymentStatus.remaining)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

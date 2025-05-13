import { OrderDetail } from '@/types/order';
import { formatCurrency } from '@/utils/formatters';

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
      <h3 className="font-medium mb-2">Status do Pagamento</h3>
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
        <div>
          <p className="text-sm text-gray-500">Valor Total</p>
          <p className="font-medium">{formatCurrency(paymentStatus.total)}</p>
        </div>
        {(order?.desconto ?? 0) > 0 && (
          <div>
            <p className="text-sm text-gray-500">Desconto</p>
            <p className="font-medium text-red-600">
              -{formatCurrency(order?.desconto ?? 0)}
            </p>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-500">Valor Pago</p>
          <p className="font-medium text-green-600">
            {formatCurrency(paymentStatus.paid)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Valor Restante</p>
          <p
            className={`font-medium ${paymentStatus.remaining > 0 ? 'text-orange-600' : 'text-green-600'}`}
          >
            {formatCurrency(paymentStatus.remaining)}
          </p>
        </div>
      </div>
    </div>
  );
}

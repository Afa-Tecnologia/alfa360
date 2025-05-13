import { ReactNode } from 'react';
import {
  Clock,
  CheckCircle2,
  BanknoteIcon,
  ShoppingCart,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface StatusDetails {
  label: string;
  icon: ReactNode;
  description: string;
  colorClass?: string;
}

/**
 * Get status details for a given order status
 */
export function getOrderStatusDetails(status: string): StatusDetails {
  const statusConfig: Record<string, StatusDetails> = {
    PENDING: {
      label: 'Pendente',
      icon: <Clock className="h-5 w-5 text-orange-500" />,
      description: 'Aguardando pagamento',
      colorClass: 'border-orange-500 text-orange-700 bg-orange-50',
    },
    PAYMENT_CONFIRMED: {
      label: 'Pagamento Confirmado',
      icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
      description: 'Pagamento recebido integralmente',
      colorClass: 'bg-green-600 text-white',
    },
    PARTIAL_PAYMENT: {
      label: 'Pagamento Parcial',
      icon: <BanknoteIcon className="h-5 w-5 text-yellow-600" />,
      description: 'Pagamento parcial recebido',
      colorClass: 'border-yellow-500 text-yellow-700 bg-yellow-50',
    },
    CONDITIONAL: {
      label: 'Condicional',
      icon: <AlertCircle className="h-5 w-5 text-purple-600" />,
      description: 'Pedido condicional',
      colorClass: 'border-purple-500 text-purple-700 bg-purple-50',
    },
    ORDERED: {
      label: 'Pedido Realizado',
      icon: <ShoppingCart className="h-5 w-5 text-blue-600" />,
      description: 'Pedido em processamento',
      colorClass: 'border-blue-500 text-blue-700 bg-blue-50',
    },
    CANCELLED: {
      label: 'Cancelado',
      icon: <XCircle className="h-5 w-5 text-red-600" />,
      description: 'Pedido cancelado',
      colorClass: 'bg-red-600 text-white',
    },
  };

  return (
    statusConfig[status] || {
      label: status,
      icon: null,
      description: '',
    }
  );
}

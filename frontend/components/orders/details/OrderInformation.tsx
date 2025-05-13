import { OrderDetail } from '@/types/order';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OrderInformationProps {
  order: OrderDetail;
}

/**
 * Component to display basic order information
 */
export function OrderInformation({ order }: OrderInformationProps) {
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
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="font-medium text-sm text-gray-500">Data do Pedido</h3>
        <p>{formatDateSafely(order.created_at)}</p>
      </div>
      <div>
        <h3 className="font-medium text-sm text-gray-500">Cliente</h3>
        <p>Cliente #{order.cliente_id}</p>
      </div>
      <div>
        <h3 className="font-medium text-sm text-gray-500">Vendedor</h3>
        <p>{order.vendedor?.name || 'Não especificado'}</p>
      </div>
      <div>
        <h3 className="font-medium text-sm text-gray-500">Tipo</h3>
        <p>{order.type || 'Não especificado'}</p>
      </div>
    </div>
  );
}

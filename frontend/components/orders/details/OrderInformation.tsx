import { OrderDetail } from '@/types/order';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, User, UserCircle, Tag } from 'lucide-react';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex items-start gap-2">
        <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Data do Pedido
          </h3>
          <p className="font-medium">{formatDateSafely(order.created_at)}</p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <User className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Cliente</h3>
          <p className="font-medium">Cliente #{order.cliente_id}</p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <UserCircle className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Vendedor
          </h3>
          <p className="font-medium">
            {order.vendedor?.name || 'Não especificado'}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Tag className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Tipo</h3>
          <p className="font-medium">{order.type || 'Não especificado'}</p>
        </div>
      </div>
    </div>
  );
}

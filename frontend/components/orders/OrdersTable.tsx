'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Order, OrderStatus } from '@/types/order';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Clock,
  CheckCircle2,
  BanknoteIcon,
  ShoppingCart,
  XCircle,
  AlertCircle,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  onSelect: (order: Order) => void;
  onStatusUpdate: (orderId: number, status: OrderStatus) => void;
}

export function OrdersTable({
  orders,
  loading,
  onSelect,
  onStatusUpdate,
}: OrdersTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Função auxiliar para formatar datas com tratamento de erro
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'Data não disponível';

    try {
      const date = new Date(dateString);
      // Verifica se a data é válida
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
      return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        label: 'Pendente',
        variant: 'outline',
        icon: <Clock className="h-3.5 w-3.5 mr-1" />,
        className: 'border-orange-500 text-orange-700 bg-orange-50',
      },
      PAYMENT_CONFIRMED: {
        label: 'Pagamento Confirmado',
        variant: 'default',
        icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />,
        className: 'bg-green-600 hover:bg-green-700',
      },
      PARTIAL_PAYMENT: {
        label: 'Pagamento Parcial',
        variant: 'outline',
        icon: <BanknoteIcon className="h-3.5 w-3.5 mr-1" />,
        className: 'border-yellow-500 text-yellow-700 bg-yellow-50',
      },
      CONDITIONAL: {
        label: 'Condicional',
        variant: 'outline',
        icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />,
        className: 'border-purple-500 text-purple-700 bg-purple-50',
      },
      ORDERED: {
        label: 'Pedido Realizado',
        variant: 'outline',
        icon: <ShoppingCart className="h-3.5 w-3.5 mr-1" />,
        className: 'border-blue-500 text-blue-700 bg-blue-50',
      },
      CANCELLED: {
        label: 'Cancelado',
        variant: 'destructive',
        icon: <XCircle className="h-3.5 w-3.5 mr-1" />,
        className: 'bg-red-600 hover:bg-red-700',
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: 'default',
      className: '',
      icon: null,
    };

    return (
      <Badge variant={config.variant as any} className={config.className}>
        <span className="flex items-center whitespace-nowrap">
          {config.icon}
          {config.label}
        </span>
      </Badge>
    );
  };

  const getStatusTransitions = (currentStatus: OrderStatus) => {
    const transitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING: [
        'PAYMENT_CONFIRMED',
        'PARTIAL_PAYMENT',
        'CONDITIONAL',
        'CANCELLED',
      ],
      PAYMENT_CONFIRMED: ['CANCELLED'],
      PARTIAL_PAYMENT: ['PAYMENT_CONFIRMED', 'CANCELLED'],
      CONDITIONAL: ['PAYMENT_CONFIRMED', 'PARTIAL_PAYMENT', 'CANCELLED'],
      ORDERED: ['PAYMENT_CONFIRMED', 'PARTIAL_PAYMENT', 'CANCELLED'],
      CANCELLED: [],
    };

    return transitions[currentStatus] || [];
  };

  const getStatusLabel = (status: OrderStatus) => {
    const labels: Record<OrderStatus, string> = {
      PENDING: 'Pendente',
      PAYMENT_CONFIRMED: 'Pagamento Confirmado',
      PARTIAL_PAYMENT: 'Pagamento Parcial',
      CONDITIONAL: 'Condicional',
      ORDERED: 'Pedido Realizado',
      CANCELLED: 'Cancelado',
    };

    return labels[status] || status;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Número</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Vendedor</TableHead>
          <TableHead>Forma de Pagamento</TableHead>
          <TableHead className="w-[100px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-[100px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[100px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[150px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[100px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[100px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[150px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[150px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[80px]" />
              </TableCell>
            </TableRow>
          ))
        ) : orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-4">
              Nenhum pedido encontrado
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => (
            <TableRow
              key={order.id}
              className="hover:bg-slate-50 cursor-pointer"
              onClick={() => onSelect(order)}
            >
              <TableCell>#{order.id}</TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell className="font-medium">
                {formatCurrency(order.total)}
              </TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell>{order.vendorName}</TableCell>
              <TableCell>{order.paymentMethod}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(order);
                      }}
                    >
                      Ver detalhes
                    </DropdownMenuItem>

                    {getStatusTransitions(order.status as OrderStatus).map(
                      (status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusUpdate(order.id, status);
                          }}
                        >
                          Marcar como {getStatusLabel(status)}
                        </DropdownMenuItem>
                      )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

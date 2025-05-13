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
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AnimatePresence, motion } from 'framer-motion';

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  onSelect: (order: Order) => void;
  onStatusUpdate?: (orderId: number, status: OrderStatus) => void;
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

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-center w-[80px]">Número</TableHead>
            <TableHead className="w-[140px]">Data</TableHead>
            <TableHead className="hidden md:table-cell">Cliente</TableHead>
            <TableHead className="text-right w-[120px]">Valor</TableHead>
            <TableHead className="text-center w-[140px]">Status</TableHead>
            <TableHead className="hidden lg:table-cell">Vendedor</TableHead>
            <TableHead className="hidden lg:table-cell">
              Forma de Pagamento
            </TableHead>
            <TableHead className="text-center w-[60px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            // Skeletons de carregamento
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-[60px] mx-auto" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[120px]" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-[150px]" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-[90px] ml-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-6 w-[100px] mx-auto" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-4 w-[120px]" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-4 w-[120px]" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-8 w-8 rounded-full mx-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : orders.length === 0 ? (
            // Mensagem de nenhum pedido encontrado
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <ShoppingCart className="h-10 w-10 mb-2 opacity-20" />
                  <p>Nenhum pedido encontrado</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            // Lista de pedidos
            <>
              {orders.map((order, index) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onSelect(order)}
                >
                  <TableCell className="font-medium text-center">
                    #{order.id}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                    {order.customerName}
                  </TableCell>
                  <TableCell className="font-medium text-right whitespace-nowrap">
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      {getStatusBadge(order.status)}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell max-w-[150px] truncate">
                    {order.vendorName}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell max-w-[150px] truncate">
                    {order.paymentMethod}
                  </TableCell>
                  <TableCell className="text-center p-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(order);
                          }}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>

                        {onStatusUpdate &&
                          getStatusTransitions(order.status as OrderStatus).map(
                            (status) => (
                              <DropdownMenuItem
                                key={status}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onStatusUpdate(order.id, status);
                                }}
                                className="cursor-pointer"
                              >
                                Mudar para {getStatusLabel(status)}
                              </DropdownMenuItem>
                            )
                          )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

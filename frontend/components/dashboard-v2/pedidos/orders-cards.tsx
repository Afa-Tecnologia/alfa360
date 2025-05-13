'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  User,
  Calendar,
  CreditCard,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

interface OrdersCardsProps {
  orders: Order[];
  loading: boolean;
  onSelect: (order: Order) => void;
  onStatusUpdate?: (orderId: number, status: OrderStatus) => void;
}

export function OrdersCards({
  orders,
  loading,
  onSelect,
  onStatusUpdate,
}: OrdersCardsProps) {
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

  // Loading skeletons para os cards
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-24" />
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 flex justify-between">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // Mensagem de nenhum pedido encontrado
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
        <p className="text-lg">Nenhum pedido encontrado</p>
        <p className="text-sm">Tente mudar os filtros para encontrar pedidos</p>
      </div>
    );
  }

  // Lista de pedidos em formato de cards
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {orders.map((order) => (
        <Card
          key={order.id}
          className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onSelect(order)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">#{order.id}</CardTitle>
              {getStatusBadge(order.status)}
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{order.paymentMethod}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2 border-t flex justify-between items-center">
            <span className="font-semibold">{formatCurrency(order.total)}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
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
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

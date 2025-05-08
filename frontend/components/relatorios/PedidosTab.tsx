'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { reportService } from '@/lib/services/ReportService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Order } from '@/types/order';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DownloadIcon,
  FilterIcon,
  Clock,
  CheckCircle2,
  BanknoteIcon,
  ShoppingCart,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface PedidosTabProps {
  startDate: Date;
  endDate: Date;
  selectedVendorId: string;
  selectedCategoryId: string;
  formatCurrency: (value: number) => string;
}

export function PedidosTab({
  startDate,
  endDate,
  selectedVendorId,
  selectedCategoryId,
  formatCurrency,
}: PedidosTabProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const filters = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        vendorId:
          selectedVendorId && selectedVendorId !== 'todos'
            ? parseInt(selectedVendorId)
            : undefined,
        categoryId:
          selectedCategoryId && selectedCategoryId !== 'todos'
            ? parseInt(selectedCategoryId)
            : undefined,
        page,
        limit: 10,
      };

      const response = await reportService.getOrders(filters);
      setOrders(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [startDate, endDate, selectedVendorId, selectedCategoryId, page]);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pedidos</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FilterIcon className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
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
                  </TableRow>
                ))
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Nenhum pedido encontrado
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-slate-50">
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>
                      {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{order.vendorName}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {!loading && orders.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-slate-500">
            Mostrando página {page} de {totalPages} ({orders.length} registros)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Próximo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

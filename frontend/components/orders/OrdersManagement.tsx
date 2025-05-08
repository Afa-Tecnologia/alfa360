'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DownloadIcon,
  FilterIcon,
  RefreshCwIcon,
  SearchIcon,
} from 'lucide-react';
import { Order, OrderFilters, OrderStatus } from '@/types/order';
import { ordersService } from '@/services/pedidos/OrdersService';
import { OrdersTable } from './OrdersTable';
import { OrderFiltersPanel } from './OrderFiltersPanel';
import { OrderDetailModal } from './OrderDetailModal';

export interface OrdersManagementProps {
  defaultFilters?: Partial<OrderFilters>;
  onOrderSelect?: (order: Order) => void;
  showFilters?: boolean;
  className?: string;
}

export function OrdersManagement({
  defaultFilters,
  onOrderSelect,
  showFilters = true,
  className = '',
}: OrdersManagementProps) {
  // Estados
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<OrderFilters>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    page: 1,
    limit: 10,
    ...defaultFilters,
  });
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Carregar pedidos
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersService.getOrders({
        ...filters,
        page,
      });
      setOrders(response.data);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar pedidos quando os filtros ou a página mudar
  useEffect(() => {
    fetchOrders();
  }, [filters, page]);

  // Atualizar filtros
  const handleFilterChange = (newFilters: Partial<OrderFilters>) => {
    console.log('OrdersManagement - Recebendo novos filtros:', newFilters);
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters, page: 1 };
      console.log('OrdersManagement - Filtros atualizados:', updated);
      return updated;
    });
    setPage(1); // Resetar para a primeira página quando os filtros mudarem
  };

  // Lidar com seleção de pedido
  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    if (onOrderSelect) {
      onOrderSelect(order);
    } else {
      setDetailModalOpen(true);
    }
  };

  // Lidar com atualização de status
  const handleStatusUpdate = async (
    orderId: number,
    newStatus: OrderStatus
  ) => {
    try {
      await ordersService.updateOrderStatus(orderId, newStatus);
      fetchOrders(); // Recarregar pedidos após atualização
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciamento de Pedidos</h2>
        <div className="flex gap-2">
          {showFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiltersVisible(!filtersVisible)}
            >
              <FilterIcon className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={fetchOrders}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {showFilters && filtersVisible && (
        <OrderFiltersPanel
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      )}

      <Card>
        <CardContent className="p-0">
          <OrdersTable
            orders={orders || []}
            loading={loading}
            onSelect={handleOrderSelect}
            onStatusUpdate={handleStatusUpdate}
          />
        </CardContent>
      </Card>

      {!loading && orders && orders.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-slate-500">
            Mostrando página {page} de {totalPages} ({totalItems} registros)
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

      {/* Modal de Detalhes do Pedido */}
      {selectedOrder && (
        <OrderDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          orderId={selectedOrder.id}
          onStatusUpdate={(status) =>
            handleStatusUpdate(selectedOrder.id, status as OrderStatus)
          }
        />
      )}
    </div>
  );
}

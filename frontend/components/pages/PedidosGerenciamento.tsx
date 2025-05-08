'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrdersManagement } from '@/components/orders/OrdersManagement';
import { OrderDetailModal } from '@/components/orders/OrderDetailModal';
import { useOrdersManagement } from '@/hooks/useOrdersManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { OrderFiltersPanel } from '@/components/orders/OrderFiltersPanel';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  BarChart3,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Filter,
  ShoppingCart,
  Users,
} from 'lucide-react';

export default function PedidosGerenciamento() {
  const {
    orders,
    loading,
    page,
    totalPages,
    totalItems,
    filters,
    selectedOrder,
    updateFilters,
    setPage,
    fetchOrders,
    selectOrder,
    updateOrderStatus,
  } = useOrdersManagement({
    initialFilters: {
      limit: 10,
      startDate: new Date(new Date().setDate(new Date().getDate() - 30))
        .toISOString()
        .split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    },
  });

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [totalDeVendas, setTotalDeVendas] = useState(0);

  // Resumo de pedidos por status
  const statusSummary = {
    total: orders.length,
    pending: orders.filter((order) => order.status === 'PENDING').length,
    confirmed: orders.filter((order) => order.status === 'PAYMENT_CONFIRMED')
      .length,
    partial: orders.filter((order) => order.status === 'PARTIAL_PAYMENT')
      .length,
    conditional: orders.filter((order) => order.status === 'CONDITIONAL')
      .length,
    cancelled: orders.filter((order) => order.status === 'CANCELLED').length,
  };

  // Total de vendas
  const totalSales = orders.reduce((sum, order) => sum + (+order.total), 0);

  const handleTotalSalesByStatus = (status: any) => {
    return orders.filter((order) => order.status === status).reduce(
      (sum, order) => sum + (+order.total),
      0
    );
  }

  // Selecionar um pedido e abrir o modal
  const handleSelectOrder = (order: any) => {
    selectOrder(order);
    setDetailModalOpen(true);
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciamento de Pedidos</h1>
        <Button onClick={() => setFiltersVisible(!filtersVisible)}>
          <Filter className="mr-2 h-4 w-4" />
          {filtersVisible ? 'Ocultar Filtros' : 'Exibir Filtros'}
        </Button>
      </div>
      <Separator className="my-4" />

      {filtersVisible && (
        <OrderFiltersPanel filters={filters} onFilterChange={updateFilters} />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Pedidos
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusSummary.total}</div>
            <p className="text-xs text-muted-foreground">
              No período selecionado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(totalSales)}
            </div>
            <p className="text-xs text-muted-foreground">
              Incluindo todos os status
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pagos/Confirmados
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusSummary.confirmed}</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-muted-foreground">
                {statusSummary.total > 0
                  ? `${Math.round((statusSummary.confirmed / statusSummary.total) * 100)}%`
                  : '0%'}{' '}
                dos pedidos
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendentes de Pagamento
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statusSummary.pending +
                statusSummary.partial +
                statusSummary.conditional}
            </div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-muted-foreground">Requer ação</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="mt-6">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending">
            Pendentes{' '}
            <Badge variant="outline" className="ml-2">
              {statusSummary.pending}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="partial">
            Parciais{' '}
            <Badge variant="outline" className="ml-2">
              {statusSummary.partial}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="conditional">
            Condicionais{' '}
            <Badge variant="outline" className="ml-2">
              {statusSummary.conditional}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmados{' '}
            <Badge variant="outline" className="ml-2">
              {statusSummary.confirmed}
            </Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <OrdersManagement
            defaultFilters={filters}
            onOrderSelect={handleSelectOrder}
            showFilters={false}
          />
        </TabsContent>
        <TabsContent value="pending">
          <OrdersManagement
            defaultFilters={{ ...filters, status: 'PENDING' }}
            onOrderSelect={handleSelectOrder}
            showFilters={false}
          />
        </TabsContent>
        <TabsContent value="partial">
          <OrdersManagement
            defaultFilters={{ ...filters, status: 'PARTIAL_PAYMENT' }}
            onOrderSelect={handleSelectOrder}
            showFilters={false}
          />
        </TabsContent>
        <TabsContent value="conditional">
          <OrdersManagement
            defaultFilters={{ ...filters, status: 'CONDITIONAL' }}
            onOrderSelect={handleSelectOrder}
            showFilters={false}
          />
        </TabsContent>
        <TabsContent value="confirmed">
          <OrdersManagement
            defaultFilters={{ ...filters, status: 'PAYMENT_CONFIRMED' }}
            onOrderSelect={handleSelectOrder}
            showFilters={false}
          />
        </TabsContent>
      </Tabs>

      {/* Modal de detalhes do pedido */}
      {selectedOrder && (
        <OrderDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          orderId={selectedOrder.id}
          onStatusUpdate={(status) => {
            updateOrderStatus(selectedOrder.id, status as any);
            fetchOrders();
          }}
        />
      )}
    </div>
  );
}

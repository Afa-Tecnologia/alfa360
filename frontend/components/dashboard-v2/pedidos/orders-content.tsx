'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OrdersTable } from '@/components/dashboard-v2/pedidos/orders-table';
import { OrdersCards } from './orders-cards';
import { OrdersMetrics } from '@/components/dashboard-v2/pedidos/orders-metrics';
import { OrderFiltersPanel } from '@/components/dashboard-v2/pedidos/order-filters-panel';
import { Filter, LayoutGrid, ListFilter } from 'lucide-react';
import { OrderFilters, Order, OrderStatus } from '@/types/order';

interface OrdersContentProps {
  orders: Order[];
  loading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  filters: OrderFilters;
  onSelectOrder: (order: Order) => void;
  onUpdateFilters: (filters: Partial<OrderFilters>) => void;
  onSetPage: (page: number) => void;
  onRefresh: () => void;
  onDeleteOrder?: (order: Order) => void;
}

export function OrdersContent({
  orders,
  loading,
  page,
  totalPages,
  totalItems,
  filters,
  onSelectOrder,
  onUpdateFilters,
  onSetPage,
  onRefresh,
  onDeleteOrder,
}: OrdersContentProps) {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

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
  const totalSales = orders.reduce((sum, order) => sum + +order.total, 0);

  // Handle status tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);

    if (value === 'all') {
      onUpdateFilters({ status: undefined });
    } else {
      onUpdateFilters({ status: value as OrderStatus });
    }
  };

  return (
    <div className="space-y-6">
      {/* Métricas de Pedidos */}
      <OrdersMetrics
        statusSummary={statusSummary}
        totalSales={totalSales}
        loading={loading}
      />

      {/* Controles - Filtros e Visualização */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex rounded-md border overflow-hidden">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="icon"
              className="rounded-none h-9 w-9 border-0"
              onClick={() => setViewMode('table')}
            >
              <ListFilter className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="icon"
              className="rounded-none h-9 w-9 border-0"
              onClick={() => setViewMode('cards')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => setFiltersVisible(!filtersVisible)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">
            {filtersVisible ? 'Ocultar Filtros' : 'Exibir Filtros'}
          </span>
        </Button>
      </div>

      {/* Painel de Filtros */}
      {filtersVisible && (
        <OrderFiltersPanel filters={filters} onFilterChange={onUpdateFilters} />
      )}

      {/* Abas de Status */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="bg-muted/60 w-full sm:w-auto mb-4 overflow-x-auto flex-nowrap">
          <TabsTrigger
            value="all"
            className="flex-1 sm:flex-initial whitespace-nowrap"
          >
            Todos
            <Badge variant="outline" className="ml-2">
              {statusSummary.total}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="PENDING"
            className="flex-1 sm:flex-initial whitespace-nowrap"
          >
            Pendentes
            <Badge variant="outline" className="ml-2">
              {statusSummary.pending}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="PARTIAL_PAYMENT"
            className="flex-1 sm:flex-initial whitespace-nowrap"
          >
            Parciais
            <Badge variant="outline" className="ml-2">
              {statusSummary.partial}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="CONDITIONAL"
            className="flex-1 sm:flex-initial whitespace-nowrap"
          >
            Condicionais
            <Badge variant="outline" className="ml-2">
              {statusSummary.conditional}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="PAYMENT_CONFIRMED"
            className="flex-1 sm:flex-initial whitespace-nowrap"
          >
            Confirmados
            <Badge variant="outline" className="ml-2">
              {statusSummary.confirmed}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardContent className="p-0">
            {viewMode === 'table' ? (
              <OrdersTable
                orders={orders}
                loading={loading}
                onSelect={onSelectOrder}
                onDeleteOrder={onDeleteOrder}
              />
            ) : (
              <OrdersCards
                orders={orders}
                loading={loading}
                onSelect={onSelectOrder}
              />
            )}
          </CardContent>
        </Card>

        {/* Paginação */}
        {!loading && orders && orders.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground order-2 sm:order-1">
              Mostrando página {page} de {totalPages} ({totalItems} registros)
            </div>
            <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSetPage(Math.max(page - 1, 1))}
                disabled={page === 1}
                className="flex-1 sm:flex-initial"
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSetPage(Math.min(page + 1, totalPages))}
                disabled={page === totalPages}
                className="flex-1 sm:flex-initial"
              >
                Próximo
              </Button>
            </div>
          </div>
        )}
      </Tabs>
    </div>
  );
}

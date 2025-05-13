'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOrdersManagement } from '@/hooks/useOrdersManagement';
import { OrderDetailModal } from '@/components/orders/OrderDetailModal';
import { OrdersContent } from '@/components/dashboard-v2/pedidos/orders-content';
import { ShoppingBag, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PedidosPage() {
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

  // Selecionar um pedido e abrir o modal
  const handleSelectOrder = (order: any) => {
    selectOrder(order);
    setDetailModalOpen(true);
  };

  // Refresh orders
  const handleRefresh = () => {
    fetchOrders();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Pedidos</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie os pedidos de sua loja
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <OrdersContent
        orders={orders}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        filters={filters}
        onSelectOrder={handleSelectOrder}
        onUpdateFilters={updateFilters}
        onSetPage={setPage}
        onRefresh={fetchOrders}
      />

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
    </motion.div>
  );
}

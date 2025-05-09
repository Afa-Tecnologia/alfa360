'use client';

import { OrdersManagement } from '@/components/orders/OrdersManagement';
import { Separator } from '@/components/ui/separator';

export default function PedidosPage() {
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pedidos</h1>
      </div>
      <Separator className="my-4" />
      <OrdersManagement />
    </div>
  );
}

'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrderDetails } from '@/hooks/useOrderDetails';
import { getOrderStatusDetails } from '@/utils/orderStatusHelper';

// Import sub-components
import { OrderInformation } from './details/OrderInformation';
import { PaymentStatusSummary } from './details/PaymentStatusSummary';
import { PaymentHistory } from './details/PaymentHistory';
import { OrderItems } from './details/OrderItems';
import { PaymentRegistrationForm } from './details/PaymentRegistrationForm';

interface OrderDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: number;
  onStatusUpdate?: (status: string) => void;
}

/**
 * Modal component for displaying and managing order details
 */
export function OrderDetailModal({
  open,
  onOpenChange,
  orderId,
  onStatusUpdate,
}: OrderDetailModalProps) {
  // Use the custom hook for all logic
  const {
    order,
    loading,
    orderPayments,
    paymentMethods,
    selectedPaymentMethod,
    selectedPaymentMethodCode,
    paymentAmount,
    processingPayment,
    paymentStatus,
    activeTab,
    setActiveTab,
    setPaymentAmount,
    handleRegisterPayment,
    handleSetPaymentMethod,
  } = useOrderDetails(orderId, onStatusUpdate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {loading ? (
              <Skeleton className="h-8 w-64" />
            ) : (
              <div className="flex items-center gap-2">
                <span>Pedido #{order?.id}</span>
                {order && (
                  <Badge
                    variant={
                      order.status === 'PAYMENT_CONFIRMED'
                        ? 'default'
                        : 'outline'
                    }
                    className={getOrderStatusDetails(order.status).colorClass}
                  >
                    {getOrderStatusDetails(order.status).label}
                  </Badge>
                )}
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="details"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="items">Itens</TabsTrigger>
            <TabsTrigger
              value="payment"
              disabled={!order || order.status === 'CANCELLED'}
            >
              Pagamento
            </TabsTrigger>
          </TabsList>

          {/* Aba de Detalhes */}
          <TabsContent value="details" className="mt-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : order ? (
              <div className="space-y-4">
                {/* Order Information */}
                <OrderInformation order={order} />

                {/* Payment Status */}
                <PaymentStatusSummary
                  order={order}
                  paymentStatus={paymentStatus}
                />

                {/* Payment History */}
                <PaymentHistory payments={orderPayments} />
              </div>
            ) : (
              <div className="py-4 text-center text-gray-500">
                Não foi possível carregar os detalhes do pedido.
              </div>
            )}
          </TabsContent>

          {/* Aba de Itens */}
          <TabsContent value="items" className="mt-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : order ? (
              <OrderItems order={order} />
            ) : (
              <div className="py-4 text-center text-gray-500">
                Não foi possível carregar os itens do pedido.
              </div>
            )}
          </TabsContent>

          {/* Aba de Pagamento */}
          <TabsContent value="payment" className="mt-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : order ? (
              <PaymentRegistrationForm
                remaining={paymentStatus.remaining}
                isFullyPaid={paymentStatus.isFullyPaid}
                paymentMethods={paymentMethods}
                onSetPaymentAmount={setPaymentAmount}
                onSetSelectedMethod={handleSetPaymentMethod}
                onRegisterPayment={handleRegisterPayment}
                paymentAmount={paymentAmount}
                selectedMethodId={selectedPaymentMethod}
                isProcessing={processingPayment}
              />
            ) : (
              <div className="py-4 text-center text-gray-500">
                Não foi possível carregar as informações de pagamento.
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

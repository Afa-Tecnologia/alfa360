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
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

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
      <DialogContent
        className={cn(
          'max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto p-4 md:p-6',
          'flex flex-col'
        )}
      >
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>
              {loading ? (
                <Skeleton className="h-8 w-[180px]" />
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-lg font-semibold">
                    Pedido #{order?.id}
                  </span>
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
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">Fechar</span>
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="flex-grow my-4 overflow-auto">
          <Tabs
            defaultValue="details"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full mb-4 grid grid-cols-3">
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
            <TabsContent value="details" className="mt-2">
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
            <TabsContent value="items" className="mt-2">
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
            <TabsContent value="payment" className="mt-2">
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
        </div>

        <DialogFooter className="flex-shrink-0 flex sm:justify-end mt-4">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

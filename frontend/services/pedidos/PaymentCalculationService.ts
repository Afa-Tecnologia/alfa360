import { OrderDetail } from '@/types/order';

interface PaymentStatus {
  total: number;
  discount: number;
  totalAfterDiscount: number;
  paid: number;
  remaining: number;
  isFullyPaid: boolean;
}

/**
 * Service for order payment calculations
 */
export class PaymentCalculationService {
  /**
   * Calculate payment status for an order
   */
  calculatePaymentStatus(order: OrderDetail | null, payments: any[]): PaymentStatus {
    if (!order) {
      return { 
        total: 0, 
        discount: 0, 
        totalAfterDiscount: 0, 
        paid: 0, 
        remaining: 0, 
        isFullyPaid: false 
      };
    }

    const total = order.total || 0;
    const discount = order.desconto || 0;
    const totalAfterDiscount = total - discount;

    // Calculate paid amount from payments
    const paid = Array.isArray(payments)
      ? payments.reduce((sum: number, payment: any) => {
          return (
            sum +
            (payment.status === 'CAPTURED' ? parseFloat(payment.total) : 0)
          );
        }, 0)
      : 0;

    const remaining = Math.max(0, totalAfterDiscount - paid);
    const isFullyPaid = remaining === 0;

    return {
      total,
      discount,
      totalAfterDiscount,
      paid,
      remaining,
      isFullyPaid,
    };
  }

  /**
   * Determine the next order status after a payment
   */
  determineNextStatus(
    fullPayment: boolean,
    currentStatus: string
  ): string {
    if (fullPayment) return 'PAYMENT_CONFIRMED';

    if (currentStatus === 'PENDING' || currentStatus === 'CONDITIONAL') {
      return 'PARTIAL_PAYMENT';
    }

    return currentStatus;
  }
}

export const paymentCalculationService = new PaymentCalculationService(); 
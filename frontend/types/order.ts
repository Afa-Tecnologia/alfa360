export type OrderStatus =
  | 'PENDING'
  | 'PAYMENT_CONFIRMED'
  | 'PARTIAL_PAYMENT'
  | 'CONDITIONAL'
  | 'ORDERED'
  | 'CANCELLED';

export interface Order {
  id: number;
  createdAt: string;
  customerName: string;
  total: number;
  status: OrderStatus;
  vendorName: string;
  paymentMethod: string;
  discount?: number;
  paidAmount?: number;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
  customer: {
    id: number;
    name: string;
  };
  payments: OrderPayment[];
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  vendorId?: number;
  vendorName?: string;
}

export interface OrderPayment {
  id: number;
  pedido_id: number;
  payment_method_id: number;
  payment_method_name?: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OrdersResponse {
  data: Order[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface OrderFilters {
  startDate?: string;
  endDate?: string;
  vendorId?: number;
  categoryId?: number;
  status?: OrderStatus;
  customerName?: string;
  page?: number;
  limit?: number;
  paymentMethod?: string;
}

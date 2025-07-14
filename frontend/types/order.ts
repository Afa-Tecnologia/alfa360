import { User } from "@/stores/user-store";

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



export interface itemsProducts{
 id?: string,
 pedido_id?: string,
 produto_id?: string,
 vendedor_id?: string,
 quantidade?: string,
 preco_unitario?: number,
 vendedor?: User
}

export interface Cliente {
  id: 1,
  name:string; 
  last_name:string; 
  email:string; 
  phone:string;
  cpf:string; 
  adress:string; 
  city:string; 
  state:string; 
  cep:string; 
  date_of_birth:string; 
  created_at:string;
  updated_at:string;
    
}
export interface OrderDetail {
  id: number;
  cliente_id: number;
  type: string;
  status: OrderStatus;
  desconto: number;
  total: number;
  created_at: string;
  updated_at: string;
  items: itemsProducts[];
  cliente: Cliente;
  vendedor: {
    id: number;
    name: string;
  } | null;
  categoria: {
    id: number;
    name: string;
  } | null;
  produtos: {
    id: number;
    name: string;
    description: string;
    purchase_price: number;
    selling_price: number;
    quantity: number;
    type: string | null;
    tipo_de_produto_id: number;
    brand: string;
    code: string;
    categoria_id: number;
    created_at: string;
    updated_at: string;
    pagamentos: any[];
    pivot: {
      pedido_id: number;
      produto_id: number;
      quantidade: number;
      preco_unitario: number;
      vendedor_id: number | null;
      created_at: string;
      updated_at: string;
    };

  }[];

  pagamentos: {
    id: number;
    pedido_id: number;
    payment_method_id: number;
    payment_method_name: string;
    total: number;
    status: string;
    created_at: string;
    updated_at: string;
  }[];
}

export interface OrderPayment {
  id: number;
  pedido_id: number;
  payment_method_id: number;
  total: string;
  status: string;
  transaction_details: any;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  metodo?: {
    id: number;
    code: string;
    name: string;
    config: any;
    created_at: string;
    updated_at: string;
  };
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
  total: string;
  status: string;
  transaction_details: any;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  metodo?: {
    id: number;
    code: string;
    name: string;
    config: any;
    created_at: string;
    updated_at: string;
  };
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

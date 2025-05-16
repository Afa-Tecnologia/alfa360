// Interfaces para os tipos de dados
export interface SalesSummary {
  totalSales: number;
  totalRevenue: number;
  averageTicket: number;
  conversionRate?: number;
  paymentMethods?: Record<string, number>;
  periodComparison?: {
    percentChange: number;
    previousPeriodTotal: number;
  };
}

export interface CategorySales {
  id: number;
  name: string;
  revenue: number;
  items: number;
  totalRevenue: number;
  totalSales: number;
  percentage: number;
}

export interface ProductSales {
  id: number;
  name: string;
  quantity: number;
  revenue: number;
  category?: string;
  sku?: string;
  averagePrice?: number;
  productId?: number;
  productName?: string;
  totalRevenue?: number;
  percentage?: number;
}

export interface Commission {
  id: number;
  vendedor_id: number;
  pedido_id: number;
  produto_id: number;
  valor: number;
  percentual: number;
  quantity: number;
  status: string;
  created_at: string;
  updated_at: string;
  data_venda?: string;
  venda_id?: number;
  valor_venda?: number;
  porcentagem?: number;
  vendedor?: {
    id: number;
    name: string;
  };
  produto?: {
    id: number;
    name: string;
  };
  pedido?: {
    id: number;
    total: number;
    status: string;
    created_at: string;
  };
}

export interface CommissionSummary {
  vendedor_id: number;
  comissao_total: number;
  comissoes: Commission[];
  vendedor?: {
    id: number;
    name: string;
  };
  dataInicial?: string;
  dataFinal?: string;
}

export interface RevenueByPeriod {
  period: string;
  value: number;
}

export interface SalesReportFilters {
  startDate?: string;
  endDate?: string;
  vendorId?: number;
  categoryId?: number;
}

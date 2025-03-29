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
  categoryId: number;
  categoryName: string;
  totalSales: number;
  totalRevenue: number;
  percentage: number;
}

export interface ProductSales {
  productId: number;
  productName: string;
  quantity: number;
  totalRevenue: number;
  percentage: number;
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
  vendedor?: {
    id: number;
    name: string;
  };
  produto?: {
    id: number;
    name: string;
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
}

export interface RevenueByPeriod {
  period: string;
  revenue: number;
}

export interface SalesReportFilters {
  startDate?: string;
  endDate?: string;
  vendorId?: number;
  categoryId?: number;
}

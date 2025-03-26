'use client';

import { ProductSales } from '@/lib/services/ReportService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProdutosTabProps {
  topProducts: ProductSales[];
  loading: boolean;
  formatCurrency: (value: number) => string;
}

export function ProdutosTab({
  topProducts,
  loading,
  formatCurrency,
}: ProdutosTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Produtos Mais Vendidos</CardTitle>
        <CardDescription>
          Produtos com maior volume de vendas no período
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            Carregando dados de produtos...
          </div>
        ) : topProducts.length > 0 ? (
          <div className="space-y-5">
            {topProducts.map((product, index) => (
              <div key={product.productId} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="w-6 h-6 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-xs mr-2">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium">
                      {product.productName}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.quantity} unidades •{' '}
                    {formatCurrency(product.totalRevenue)}
                  </span>
                </div>
                <div className="space-y-1">
                  <Progress
                    value={product.percentage}
                    className="h-2"
                    style={
                      {
                        '--progress-value': `${product.percentage}%`,
                      } as any
                    }
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{product.percentage.toFixed(1)}% das vendas</span>
                    <span>{formatCurrency(product.totalRevenue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhum produto vendido no período selecionado
          </div>
        )}
      </CardContent>
    </Card>
  );
}

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { COLORS } from './hooks/useComissoesData';

interface ListaProdutosMaisVendidosProps {
  produtosVendidos: Array<{
    id: number;
    name: string;
    vendas: number;
    comissao: number;
  }>;
  formatCurrency: (value: number) => string;
}

export function ListaProdutosMaisVendidos({
  produtosVendidos,
  formatCurrency,
}: ListaProdutosMaisVendidosProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Produtos Mais Vendidos</CardTitle>
        <CardDescription>Top 5 produtos por comissão</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {produtosVendidos.map((produto, index) => (
            <div key={produto.id} className="flex items-center gap-4">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: COLORS[index % COLORS.length],
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{produto.name}</p>
                <p className="text-xs text-muted-foreground">
                  {produto.vendas} vendas
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {formatCurrency(produto.comissao)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

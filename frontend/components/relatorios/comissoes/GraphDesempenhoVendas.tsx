'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface GraphDesempenhoVendasProps {
  produtosVendidos: Array<{
    id: number;
    name: string;
    vendas: number;
    comissao: number;
  }>;
  formatCurrency: (value: number) => string;
}

export function GraphDesempenhoVendas({
  produtosVendidos,
  formatCurrency,
}: GraphDesempenhoVendasProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desempenho de Vendas</CardTitle>
        <CardDescription>
          Visualização do total de comissões por produto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={produtosVendidos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="comissao" name="Comissão" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

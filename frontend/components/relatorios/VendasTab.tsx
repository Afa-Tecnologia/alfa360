'use client';


import { SalesSummary } from '@/types/reports';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PedidosPageSales from '../pages/pedidos/PedidosSalesPage';

interface VendasTabProps {
  salesSummary: SalesSummary | null;
  loading: boolean;
  formatCurrency: (value: number) => string;
  period: 'day' | 'week' | 'month';
  setPeriod: (period: 'day' | 'week' | 'month') => void;
}

export function VendasTab({
  salesSummary,
  loading,
  formatCurrency,
  period,
  setPeriod,
}: VendasTabProps) {
  // Dados de exemplo para o gráfico
  const revenueData = [
    { name: 'Jan', value: 4000 },
    { name: 'Fev', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Abr', value: 2780 },
    { name: 'Mai', value: 1890 },
    { name: 'Jun', value: 2390 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Vendas
            </CardTitle>
            <CardDescription>Período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? 'Carregando...' : salesSummary?.totalSales || 0}
            </div>
            {salesSummary?.periodComparison && (
              <p
                className={`text-xs ${
                  salesSummary.periodComparison.percentChange >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                } flex items-center`}
              >
                <span>
                  {salesSummary.periodComparison.percentChange >= 0 ? '↑' : '↓'}
                  {Math.abs(
                    salesSummary.periodComparison.percentChange
                  ).toFixed(1)}
                  % comparado ao período anterior
                </span>
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <CardDescription>Período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading
                ? 'Carregando...'
                : formatCurrency(salesSummary?.totalRevenue || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <CardDescription>Valor médio por venda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading
                ? 'Carregando...'
                : formatCurrency(salesSummary?.averageTicket || 0)}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Relatorio de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
       <PedidosPageSales/>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Receita por Período</CardTitle>
              <Select
                value={period}
                onValueChange={(value) =>
                  setPeriod(value as 'day' | 'week' | 'month')
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Diário</SelectItem>
                  <SelectItem value="week">Semanal</SelectItem>
                  <SelectItem value="month">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Receita" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

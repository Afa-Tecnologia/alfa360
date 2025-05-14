'use client';

import { useEffect, useState } from 'react';
import { SalesSummary, RevenueByPeriod } from '@/types/reports';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { reportService } from '@/lib/services/ReportService';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  TrendingUpIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  DollarSignIcon,
  ShoppingCartIcon,
  CreditCardIcon,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PedidosTab } from './PedidosTab';

interface VendasTabProps {
  salesSummary: SalesSummary | null;
  loading: boolean;
  formatCurrency: (value: number) => string;
  period: 'day' | 'week' | 'month';
  setPeriod: (period: 'day' | 'week' | 'month') => void;
  startDate: Date;
  endDate: Date;
  selectedVendorId: string;
  selectedCategoryId: string;
}

export function VendasTab({
  salesSummary,
  loading,
  formatCurrency,
  period,
  setPeriod,
  startDate,
  endDate,
  selectedVendorId,
  selectedCategoryId,
}: VendasTabProps) {
  const [revenueData, setRevenueData] = useState<RevenueByPeriod[]>([]);
  const [loadingRevenue, setLoadingRevenue] = useState(false);
  const [graphType, setGraphType] = useState<'line' | 'bar' | 'area'>('area');

  // Função para buscar dados de receita por período
  const fetchRevenueData = async () => {
    try {
      setLoadingRevenue(true);

      const filters = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        vendorId:
          selectedVendorId && selectedVendorId !== 'todos'
            ? parseInt(selectedVendorId)
            : undefined,
      };

      const data = await reportService.getRevenueByPeriod(period, filters);
      setRevenueData(data);
    } catch (error) {
      console.error('Erro ao buscar dados de receita:', error);
    } finally {
      setLoadingRevenue(false);
    }
  };

  // Atualizar dados quando os filtros mudarem
  useEffect(() => {
    fetchRevenueData();
  }, [period, startDate, endDate, selectedVendorId]);

  // Métodos de pagamento (simulados)
  const paymentMethods = salesSummary?.paymentMethods || {
    'Cartão de Crédito': 45,
    PIX: 30,
    Dinheiro: 15,
    'Cartão de Débito': 10,
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="resumo" className="w-full">
        <TabsList>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
        </TabsList>
        <TabsContent value="resumo" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Vendas
                </CardTitle>
                <CardDescription>Período selecionado</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-10 w-28" />
                ) : (
                  <div className="flex items-center">
                    <ShoppingCartIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div className="text-2xl font-bold">
                      {salesSummary?.totalSales || 0}
                    </div>
                  </div>
                )}
                {!loading && salesSummary?.periodComparison && (
                  <div className="mt-2">
                    <div
                      className={`text-xs flex items-center ${
                        salesSummary.periodComparison.percentChange >= 0
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {salesSummary.periodComparison.percentChange >= 0 ? (
                        <ChevronUpIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4 mr-1" />
                      )}
                      <span>
                        {Math.abs(
                          salesSummary.periodComparison.percentChange
                        ).toFixed(1)}
                        %
                      </span>
                      <span className="ml-1 text-muted-foreground">
                        vs. período anterior
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Receita Total
                </CardTitle>
                <CardDescription>Período selecionado</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-10 w-28" />
                ) : (
                  <div className="flex items-center">
                    <DollarSignIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div className="text-2xl font-bold">
                      {formatCurrency(salesSummary?.totalRevenue || 0)}
                    </div>
                  </div>
                )}
                {!loading && salesSummary?.periodComparison && (
                  <div className="mt-2">
                    <div
                      className={`text-xs flex items-center ${
                        salesSummary.periodComparison.percentChange >= 0
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {salesSummary.periodComparison.percentChange >= 0 ? (
                        <TrendingUpIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 mr-1" />
                      )}
                      <span>
                        {formatCurrency(
                          salesSummary.periodComparison.previousPeriodTotal
                        )}
                      </span>
                      <span className="ml-1 text-muted-foreground">
                        período anterior
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Ticket Médio
                </CardTitle>
                <CardDescription>Valor médio por venda</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-10 w-28" />
                ) : (
                  <div className="flex items-center">
                    <CreditCardIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div className="text-2xl font-bold">
                      {formatCurrency(salesSummary?.averageTicket || 0)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Taxa de Conversão
                </CardTitle>
                <CardDescription>Visitantes que compram</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-10 w-28" />
                ) : (
                  <div className="flex items-center">
                    <ArrowUpIcon className="mr-2 h-4 w-4 text-emerald-600" />
                    <div className="text-2xl font-bold">
                      {salesSummary?.conversionRate || '15.2'}%
                    </div>
                  </div>
                )}
              </CardContent>
            </Card> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Receita por Período</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Tabs
                        defaultValue={graphType}
                        onValueChange={(v) => setGraphType(v as any)}
                      >
                        <TabsList className="h-8">
                          <TabsTrigger value="line" className="text-xs px-2">
                            Linha
                          </TabsTrigger>
                          <TabsTrigger value="area" className="text-xs px-2">
                            Área
                          </TabsTrigger>
                          <TabsTrigger value="bar" className="text-xs px-2">
                            Barras
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>

                      <Select
                        value={period}
                        onValueChange={(value) =>
                          setPeriod(value as 'day' | 'week' | 'month')
                        }
                      >
                        <SelectTrigger className="w-[100px] h-8">
                          <SelectValue placeholder="Período" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">Diário</SelectItem>
                          <SelectItem value="week">Semanal</SelectItem>
                          <SelectItem value="month">Mensal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {loadingRevenue ? (
                      <div className="h-full flex items-center justify-center">
                        <Skeleton className="h-full w-full" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        {graphType === 'line' ? (
                          <LineChart
                            data={revenueData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#f0f0f0"
                            />
                            <XAxis
                              dataKey="period"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              fontSize={12}
                              tickFormatter={(value) => `R$ ${value}`}
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip
                              formatter={(value) => [
                                formatCurrency(Number(value)),
                                'Receita',
                              ]}
                              labelFormatter={(label) => `Período: ${label}`}
                              contentStyle={{
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="revenue"
                              stroke="#10b981"
                              strokeWidth={2}
                              dot={{ r: 4, strokeWidth: 2 }}
                              activeDot={{ r: 6, strokeWidth: 2 }}
                            />
                          </LineChart>
                        ) : graphType === 'area' ? (
                          <AreaChart
                            data={revenueData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <defs>
                              <linearGradient
                                id="colorRevenue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#10b981"
                                  stopOpacity={0.3}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#10b981"
                                  stopOpacity={0.05}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#f0f0f0"
                            />
                            <XAxis
                              dataKey="period"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              fontSize={12}
                              tickFormatter={(value) => `R$ ${value}`}
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip
                              formatter={(value) => [
                                formatCurrency(Number(value)),
                                'Receita',
                              ]}
                              labelFormatter={(label) => `Período: ${label}`}
                              contentStyle={{
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="revenue"
                              stroke="#10b981"
                              strokeWidth={2}
                              fill="url(#colorRevenue)"
                              dot={{ r: 4, strokeWidth: 2 }}
                              activeDot={{ r: 6, strokeWidth: 2 }}
                            />
                          </AreaChart>
                        ) : (
                          <BarChart
                            data={revenueData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#f0f0f0"
                            />
                            <XAxis
                              dataKey="period"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              fontSize={12}
                              tickFormatter={(value) => `R$ ${value}`}
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip
                              formatter={(value) => [
                                formatCurrency(Number(value)),
                                'Receita',
                              ]}
                              labelFormatter={(label) => `Período: ${label}`}
                              contentStyle={{
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              }}
                            />
                            <Bar
                              dataKey="revenue"
                              name="Receita"
                              fill="#10b981"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  {period === 'day'
                    ? 'Dados diários'
                    : period === 'week'
                      ? 'Dados semanais'
                      : 'Dados mensais'}{' '}
                  do período selecionado
                </CardFooter>
              </Card>
            </div>

            <Card className="h-full">
              <CardHeader>
                <CardTitle>Método de Pagamento</CardTitle>
                <CardDescription>Distribuição por método</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  {loading ? (
                    <Skeleton className="h-full w-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(paymentMethods).map(
                            ([name, value]) => ({
                              name,
                              value,
                            })
                          )}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {Object.entries(paymentMethods).map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'][
                                    index % 4
                                  ]
                                }
                              />
                            )
                          )}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value}%`, 'Percentual']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="mt-4 space-y-3">
                  {Object.entries(paymentMethods).map(
                    ([method, percentage], index) => (
                      <div
                        key={method}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{
                              backgroundColor: [
                                '#10b981',
                                '#3b82f6',
                                '#f59e0b',
                                '#8b5cf6',
                              ][index % 4],
                            }}
                          ></div>
                          <span className="text-sm">{method}</span>
                        </div>
                        <span className="text-sm font-medium">
                          {percentage}%
                        </span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="pedidos">
          <PedidosTab
            startDate={startDate}
            endDate={endDate}
            selectedVendorId={selectedVendorId}
            selectedCategoryId={selectedCategoryId}
            formatCurrency={formatCurrency}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

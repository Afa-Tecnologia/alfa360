'use client';

import { useState } from 'react';
import { ProductSales } from '@/types/reports';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowUpIcon,
  TrendingUpIcon,
  Package2Icon,
  SearchIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ProdutosTabProps {
  topProducts: ProductSales[];
  loading: boolean;
  formatCurrency: (value: number) => string;
}

// Cores para os gráficos
const COLORS = [
  '#10b981', // Verde
  '#3b82f6', // Azul
  '#f59e0b', // Laranja
  '#8b5cf6', // Roxo
  '#ec4899', // Rosa
  '#06b6d4', // Ciano
  '#f43f5e', // Vermelho
  '#84cc16', // Verde limão
];

export function ProdutosTab({
  topProducts,
  loading,
  formatCurrency,
}: ProdutosTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'chart' | 'detailed'>(
    'list'
  );

  // Filtrar produtos com base no termo de pesquisa
  const filteredProducts = topProducts.filter((product) =>

    product.productName?.toLowerCase().includes(searchTerm.toLowerCase())

  );

  // Dados para o gráfico de barras
  const barChartData = topProducts.slice(0, 8).map((product) => {
    let name = '';
    if (product.productName) {
      name =
        product.productName?.length > 20
          ? product.productName?.substring(0, 20) + '...'
          : product.productName;
    }
    return {
      name,
      value: product.totalRevenue,
      quantity: product.quantity,
    };
  });

  // Dados para o gráfico de pizza
  const pieChartData = topProducts.slice(0, 6).map((product) => {
    let name = '';
    if (product.productName) {
      name =
        product.productName?.length > 15
          ? product.productName?.substring(0, 15) + '...'
          : product.productName;
    }
    return {
      name,
      value: product.quantity,
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="relative w-full sm:w-64">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar produtos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs
          defaultValue={viewMode}
          onValueChange={(value) => setViewMode(value as any)}
        >
          <TabsList>
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="chart">Gráficos</TabsTrigger>
            <TabsTrigger value="detailed">Detalhado</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Resumo em cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Produtos Vendidos
            </CardTitle>
            <CardDescription>Período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-28" />
            ) : (
              <div className="text-2xl font-bold">
                {topProducts.reduce(
                  (sum, product) => sum + product.quantity,
                  0
                )}{' '}
                unidades
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Total de Produtos
            </CardTitle>
            <CardDescription>Período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-28" />
            ) : (
              <div className="text-2xl font-bold">
                {formatCurrency(
                  topProducts.reduce(
                    (sum, product) => sum + (product.totalRevenue || 0),
                    0
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Ticket Médio por Produto
            </CardTitle>
            <CardDescription>Valor médio por unidade</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-28" />
            ) : (
              <div className="text-2xl font-bold">
                {formatCurrency(
                  topProducts.length > 0
                    ? topProducts.reduce(
                        (sum, product) => sum + (product.totalRevenue || 0),
                        0
                      ) /
                        topProducts.reduce(
                          (sum, product) => sum + product.quantity,
                          0
                        )
                    : 0
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo principal baseado na visualização selecionada */}
      {viewMode === 'list' && (
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Produtos Mais Vendidos</CardTitle>
            <CardDescription>
              Produtos com maior volume de vendas no período
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="space-y-5">
                {filteredProducts.map((product, index) => (
                  <div key={product.productId} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-6 h-6 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-xs mr-2">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium">
                          {product.productName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          {product.quantity} unidades
                        </span>
                        <span className="text-sm font-medium">
                          {formatCurrency(product.totalRevenue || 0)}
                        </span>
                      </div>
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
                        <span>
                          {product.percentage?.toFixed(1)}% das vendas
                        </span>
                        <span>
                          {formatCurrency(
                            (product.totalRevenue || 0) / (product.quantity || 1)
                          )}{' '}
                          / unidade
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchTerm
                  ? 'Nenhum produto encontrado'
                  : 'Nenhum produto vendido no período selecionado'}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {viewMode === 'chart' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Top 8 Produtos por Receita</CardTitle>
              <CardDescription>
                Produtos com maior receita no período
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-80 w-full" />
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                      layout="vertical"
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={true}
                        vertical={false}
                      />
                      <XAxis
                        type="number"
                        tickFormatter={(value) => formatCurrency(value)}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={120}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(value, name) => [
                          name === 'value'
                            ? formatCurrency(Number(value))
                            : `${value} unid.`,
                          name === 'value' ? 'Receita' : 'Quantidade',
                        ]}
                      />
                      <Legend />
                      <Bar
                        dataKey="value"
                        name="Receita"
                        fill="#10b981"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top 6 Produtos por Quantidade</CardTitle>
              <CardDescription>
                Produtos mais vendidos em volume
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-80 w-full" />
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          `${value} unidades`,
                          'Quantidade',
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {viewMode === 'detailed' && (
        <Card>
          <CardHeader>
            <CardTitle>Análise Detalhada dos Produtos</CardTitle>
            <CardDescription>
              Informações detalhadas sobre cada produto
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-96 w-full" />
            ) : filteredProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Produto</th>
                      <th className="text-center py-3 px-4">Quantidade</th>
                      <th className="text-center py-3 px-4">% do Total</th>
                      <th className="text-right py-3 px-4">Preço Médio</th>
                      <th className="text-right py-3 px-4">Receita Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.productId}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium">
                            {product.productName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ID: {product.productId}
                          </div>
                        </td>
                        <td className="text-center py-3 px-4">
                          <div className="font-medium">{product.quantity}</div>
                          <div className="text-xs text-muted-foreground">
                            unidades
                          </div>
                        </td>
                        <td className="text-center py-3 px-4">
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            {product.percentage?.toFixed(1)}%
                          </div>
                        </td>
                        <td className="text-right py-3 px-4">
                          {formatCurrency(
                            (product.totalRevenue || 0) / (product.quantity || 1)
                          )}
                        </td>
                        <td className="text-right py-3 px-4 font-medium">
                          {formatCurrency(product.totalRevenue || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/30">
                      <td className="py-3 px-4 font-medium">Total</td>
                      <td className="text-center py-3 px-4 font-medium">
                        {filteredProducts.reduce(
                          (sum, p) => sum + p.quantity,
                          0
                        )}
                      </td>
                      <td className="text-center py-3 px-4 font-medium">
                        100%
                      </td>
                      <td className="text-right py-3 px-4">-</td>
                      <td className="text-right py-3 px-4 font-medium">
                        {formatCurrency(
                          filteredProducts.reduce(
                            (sum, p) => sum + (p.totalRevenue || 0),
                            0
                          )
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchTerm
                  ? 'Nenhum produto encontrado'
                  : 'Nenhum produto vendido no período selecionado'}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t flex justify-between">
            <div className="text-sm text-muted-foreground">
              Exibindo {filteredProducts.length} produtos de{' '}
              {topProducts.length} no total
            </div>
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm('')}
              >
                Limpar filtro
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

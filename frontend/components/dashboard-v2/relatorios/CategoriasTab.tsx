'use client';

import { useState } from 'react';
import { CategorySales } from '@/types/reports';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Treemap,
} from 'recharts';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DollarSignIcon, TrendingUpIcon, ShoppingBagIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoriasTabProps {
  categorySales: any[];
  loading: boolean;
  formatCurrency: (value: number) => string;
}

// Cores para o gráfico de pizza
const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82ca9d',
  '#ffc658',
  '#8dd1e1',
  '#a4de6c',
  '#d0ed57',
];

export function CategoriasTab({
  categorySales,
  loading,
  formatCurrency,
}: CategoriasTabProps) {
  const [viewType, setViewType] = useState<'pie' | 'bar' | 'treemap' | 'list'>(
    'pie'
  );

  // Ordenar categorias por receita
  const sortedCategories = [...categorySales].sort(
    (a, b) => b.totalRevenue - a.totalRevenue
  );

  // Calcular totais
  const totalRevenue = categorySales.reduce(
    (sum, cat) => sum + cat.totalRevenue,
    0
  );
  const totalSales = categorySales.reduce(
    (sum, cat) => sum + cat.totalSales,
    0
  );

  // Dados formatados para o Treemap
  const treemapData = {
    name: 'Categorias',
    children: categorySales.map((category) => ({
      name: category.categoryName,
      size: category.totalRevenue,
      percentage: category.percentage,
    })),
  };

  return (
    <div className="space-y-4">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Categorias
            </CardTitle>
            <CardDescription>Categorias com vendas</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-28" />
            ) : (
              <div className="flex items-center">
                <ShoppingBagIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">{categorySales.length}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <CardDescription>Todas as categorias</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-28" />
            ) : (
              <div className="flex items-center">
                <DollarSignIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">
                  {formatCurrency(totalRevenue)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Unidades Vendidas
            </CardTitle>
            <CardDescription>Todas as categorias</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-28" />
            ) : (
              <div className="flex items-center">
                <TrendingUpIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">{totalSales}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Controles de visualização */}
      <div className="flex justify-end">
        <Tabs
          defaultValue={viewType}
          onValueChange={(value) => setViewType(value as any)}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md ml-auto grid-cols-4">
            <TabsTrigger value="pie">Pizza</TabsTrigger>
            <TabsTrigger value="bar">Barras</TabsTrigger>
            <TabsTrigger value="treemap">Treemap</TabsTrigger>
            <TabsTrigger value="list">Lista</TabsTrigger>
          </TabsList>

          {/* Conteúdo das visualizações */}
          <TabsContent value="pie">
            <Card>
              <CardHeader>
                <CardTitle>Vendas por Categoria</CardTitle>
                <CardDescription>
                  Distribuição de receita por categoria no período selecionado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 relative">
                  {loading ? (
                    <div className="h-full flex items-center justify-center">
                      <Skeleton className="h-full w-full rounded-full" />
                    </div>
                  ) : categorySales.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categorySales}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="totalRevenue"
                          nameKey="categoryName"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(1)}%`
                          }
                        >
                          {categorySales.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [
                            formatCurrency(Number(value)),
                            'Receita',
                          ]}
                          contentStyle={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      Nenhuma venda por categoria no período selecionado
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bar">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho por Categoria</CardTitle>
                <CardDescription>
                  Receita e quantidade por categoria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  {loading ? (
                    <Skeleton className="h-full w-full" />
                  ) : categorySales.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={sortedCategories}
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
                          dataKey="categoryName"
                          width={100}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                          formatter={(value, name) => [
                            name === 'totalRevenue'
                              ? formatCurrency(Number(value))
                              : `${value} unid.`,
                            name === 'totalRevenue' ? 'Receita' : 'Quantidade',
                          ]}
                          contentStyle={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="totalRevenue"
                          name="Receita"
                          fill="#0088FE"
                          radius={[0, 4, 4, 0]}
                        />
                        <Bar
                          dataKey="totalSales"
                          name="Quantidade"
                          fill="#00C49F"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      Nenhuma venda por categoria no período selecionado
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="treemap">
            <Card>
              <CardHeader>
                <CardTitle>Mapa de Árvore de Categorias</CardTitle>
                <CardDescription>
                  Visualização proporcional da receita por categoria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  {loading ? (
                    <Skeleton className="h-full w-full" />
                  ) : categorySales.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <Treemap
                        data={treemapData.children}
                        dataKey="size"
                        nameKey="name"
                        stroke="#fff"
                        fill="#8884d8"
                      >
                        {categorySales.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                        <Tooltip
                          formatter={(value) => formatCurrency(Number(value))}
                          contentStyle={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          }}
                        />
                      </Treemap>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      Nenhuma venda por categoria no período selecionado
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho por Categoria</CardTitle>
                <CardDescription>
                  Detalhes de todas as categorias
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-5 w-48" />
                          <Skeleton className="h-5 w-24" />
                        </div>
                        <Skeleton className="h-2 w-full" />
                      </div>
                    ))}
                  </div>
                ) : categorySales.length > 0 ? (
                  <div>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Categoria</th>
                            <th className="text-center py-3 px-4">
                              Produtos Vendidos
                            </th>
                            <th className="text-center py-3 px-4">
                              % do Total
                            </th>
                            <th className="text-right py-3 px-4">Receita</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedCategories.map((category) => (
                            <tr
                              key={category.categoryId}
                              className="border-b hover:bg-muted/50"
                            >
                              <td className="py-3 px-4">
                                <div className="font-medium">
                                  {category.categoryName}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  ID: {category.categoryId}
                                </div>
                              </td>
                              <td className="text-center py-3 px-4">
                                {category.totalSales}
                              </td>
                              <td className="text-center py-3 px-4">
                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {category.percentage.toFixed(1)}%
                                </div>
                              </td>
                              <td className="text-right py-3 px-4 font-medium">
                                {formatCurrency(category.totalRevenue)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-muted/30">
                            <td className="py-3 px-4 font-medium">Total</td>
                            <td className="text-center py-3 px-4 font-medium">
                              {totalSales}
                            </td>
                            <td className="text-center py-3 px-4 font-medium">
                              100%
                            </td>
                            <td className="text-right py-3 px-4 font-medium">
                              {formatCurrency(totalRevenue)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div className="mt-8 space-y-4">
                      <h3 className="font-medium text-sm">
                        Distribuição de Vendas
                      </h3>
                      {sortedCategories.map((category, index) => (
                        <div key={category.categoryId} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              {category.categoryName}
                            </span>
                            <span className="text-sm text-gray-500">
                              {category.totalSales} unidades •{' '}
                              {formatCurrency(category.totalRevenue)}
                            </span>
                          </div>
                          <Progress
                            value={category.percentage}
                            className="h-2"
                            style={
                              {
                                backgroundColor: '#f5f5f5',
                                '--tw-progress-fill':
                                  COLORS[index % COLORS.length],
                              } as any
                            }
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>
                              {category.percentage.toFixed(1)}% das vendas
                            </span>
                            <span>
                              {formatCurrency(
                                category.totalRevenue / category.totalSales
                              )}{' '}
                              / unidade
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma venda por categoria no período selecionado
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t text-sm text-muted-foreground">
                Total de categorias com vendas: {categorySales.length}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

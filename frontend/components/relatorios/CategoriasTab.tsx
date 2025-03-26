'use client';

import { CategorySales } from '@/types/reports';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Progress } from '@/components/ui/progress';

interface CategoriasTabProps {
  categorySales: CategorySales[];
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendas por Categoria</CardTitle>
        <CardDescription>
          Distribuição de vendas por categoria no período selecionado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              Carregando dados de categorias...
            </div>
          ) : categorySales.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySales}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="totalRevenue"
                  nameKey="categoryName"
                >
                  {categorySales.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Nenhuma venda por categoria no período selecionado
            </div>
          )}
        </div>

        {!loading && categorySales.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="font-medium text-sm">Desempenho por Categoria</h3>
            {categorySales.map((category, index) => (
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
                      '--tw-progress-fill': COLORS[index % COLORS.length],
                    } as any
                  }
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

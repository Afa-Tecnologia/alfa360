'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp, ShoppingBag } from 'lucide-react';
import { useOrdersManagement } from '@/hooks/useOrdersManagement';
import { useMemo } from 'react';
import { Skeleton } from '../ui/skeleton';

export default function CardMetricMonth() {
  const { orders, loading } = useOrdersManagement({
    initialFilters: {
      limit: 1000,
      startDate: new Date(new Date().setDate(new Date().getDate() - 30))
        .toISOString()
        .split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    },
  });
  console
  const hoje = new Date();
  const trintaDiasAtras = new Date(hoje);
  trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);

  const sessentaDiasAtras = new Date(hoje);
  sessentaDiasAtras.setDate(sessentaDiasAtras.getDate() - 60);

  const { totalAtual, totalAnterior, trend } = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        totalAtual: 0,
        totalAnterior: 0,
        trend: { isPositive: true, value: 0 },
      };
    }

    const hoje = new Date();
    const trintaDiasAtras = new Date(hoje);
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);

    const sessentaDiasAtras = new Date(hoje);
    sessentaDiasAtras.setDate(sessentaDiasAtras.getDate() - 60);

    const totalAtual = orders
      .filter((order) => new Date(order.createdAt) >= trintaDiasAtras)
      .reduce((acc, order) => acc + Number(order.total) || 0, 0);

    const totalAnterior = orders
      .filter(
        (order) =>
          new Date(order.createdAt) < trintaDiasAtras &&
          new Date(order.createdAt) >= sessentaDiasAtras
      )
      .reduce((acc, order) => acc + Number(order.total) || 0, 0);

    const variacao =
      totalAnterior > 0
        ? ((totalAtual - totalAnterior) / totalAnterior) * 100
        : 0;

    return {
      totalAtual,
      totalAnterior,
      trend: {
        isPositive: variacao >= 0,
        value: parseFloat(Math.abs(variacao).toFixed(1)),
      },
    };
  }, [orders]);
  const MetricsLoading = () => (
    <div className="">
      {[1].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
  return loading ? (
    <MetricsLoading />
  ) : (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn('overflow-hidden')}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vendas do Mês
            </CardTitle>
            <div className="p-2 rounded-full bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-7 w-24 animate-pulse rounded bg-muted" />
          ) : (
            <div className="flex items-baseline">
              <div className="text-2xl font-bold">
                <div className="text-2xl font-bold">
                  R${' '}
                  {(typeof totalAtual === 'number' && !isNaN(totalAtual)
                    ? totalAtual
                    : 0
                  ).toFixed(2)}
                </div>
              </div>

              {trend && (
                <Badge
                  variant="outline"
                  className={cn(
                    'ml-2 flex items-center gap-0.5',
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {trend.isPositive ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {trend.value}%
                </Badge>
              )}
            </div>
          )}

          <CardDescription className="mt-1 text-xs">
            Total das vendas nos últimos 30 dias
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}

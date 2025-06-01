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
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useOrdersManagement } from '@/hooks/useOrdersManagement';
import { useMemo } from 'react';
import { Skeleton } from '../ui/skeleton';

export default function CardMetricToday() {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]; // 86400000ms = 1 dia

  const { orders: ordersToday, loading: loadingToday } = useOrdersManagement({
    initialFilters: {
      limit: 100,
      startDate: today,
      endDate: today,
    },
  });

  const { orders: ordersYesterday, loading: loadingYesterday } =
    useOrdersManagement({
      initialFilters: {
        limit: 100,
        startDate: yesterday,
        endDate: yesterday,
      },
    });

  const totalHoje = useMemo(() => {
    return (
      ordersToday?.reduce((acc, order) => acc + Number(order.total) || 0, 0) ??
      0
    );
  }, [ordersToday]);

const totalOntem = useMemo(() => {
  return ordersYesterday?.reduce((acc, order) => acc + (Number(order.total) || 0), 0) ?? 0;
}, [ordersYesterday]);

  const trend = useMemo(() => {
    if (totalOntem === 0) {
      return {
        isPositive: true,
        value: 0,
      };
    }

    const diff = totalHoje - totalOntem;
    const value = (diff / totalOntem) * 100;

    const safeValue = Number(value);
    return {
      isPositive: safeValue >= 0,
      value: isNaN(safeValue) ? 0 : parseFloat(Math.abs(safeValue).toFixed(1)),
    };
  }, [totalHoje, totalOntem]);

  const loading = loadingToday || loadingYesterday;

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
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vendas de Hoje
            </CardTitle>
            <div className="p-2 rounded-full bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
              <ArrowUp className="h-4 w-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-7 w-24 animate-pulse rounded bg-muted"></div>
          ) : (
            <div className="flex items-baseline">
              <div className="text-2xl font-bold">
                R$ {totalHoje.toFixed(2).replace('.', ',')}
              </div>
              {trend && (
                <Badge
                  variant="outline"
                  className={cn(
                    'ml-2 flex items-center gap-0.5',
                    trend.isPositive
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
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
            Total de vendas realizadas hoje
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}

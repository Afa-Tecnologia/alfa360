'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart, DollarSign, CreditCard, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrdersMetricsProps {
  statusSummary: {
    total: number;
    pending: number;
    confirmed: number;
    partial: number;
    conditional: number;
    cancelled: number;
  };
  totalSales: number;
  loading: boolean;
}

export function OrdersMetrics({
  statusSummary,
  totalSales,
  loading,
}: OrdersMetricsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-1" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))
        ) : (
          // Actual metric cards
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Pedidos
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statusSummary.total}</div>
                <p className="text-xs text-muted-foreground">
                  No período selecionado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Valor Total
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(totalSales)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Incluindo todos os status
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pagos/Confirmados
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statusSummary.confirmed}
                </div>
                <div className="flex items-center pt-1">
                  <span className="text-xs text-muted-foreground">
                    {statusSummary.total > 0
                      ? `${Math.round((statusSummary.confirmed / statusSummary.total) * 100)}%`
                      : '0%'}{' '}
                    dos pedidos
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pendentes de Pagamento
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statusSummary.pending +
                    statusSummary.partial +
                    statusSummary.conditional}
                </div>
                <div className="flex items-center pt-1">
                  <span className="text-xs text-muted-foreground">
                    Requer ação
                  </span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </motion.div>
  );
}

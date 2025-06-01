'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CaixaStatusCard } from '@/components/dashboard-v2/caixa-status-card';
import { QuickActions } from '@/components/dashboard-v2/quick-actions';
import { MetricCard } from '@/components/dashboard-v2/metric-card';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ShoppingBag,
  DollarSign,
  Users,
  Package,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '../../api/api';
import { Button } from '@/components/ui/button';
import { CardsVendas } from '@/components/dashboard-v2/cards-vendas';
import CardMetricMonth from '@/components/dashboard-v2/card-metric-month';
import CardMetricToday from '@/components/dashboard-v2/card-metric-today';
import CardMetricClientActives from '@/components/dashboard-v2/card-client-metric';
import CardProductStock from '@/components/dashboard-v2/card-metric-stock';
import CardProdutosPopulares from '@/components/dashboard-v2/card-products';

export default function DashboardPage() {

 
  // Formatar data para exibição
  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">

      {/* Status do Caixa */}
      <CaixaStatusCard />

      {/* Ações Rápidas */}
      <QuickActions />

      {/* Métricas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-4">Métricas</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <CardMetricToday />
          <CardMetricMonth />
          <CardMetricClientActives />
          <CardProductStock />
        </div>
      </motion.div>

      {/* Últimas Atividades e Produtos Populares */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid gap-6 grid-cols-1 md:grid-cols-2"
      >
        {/* Últimas Vendas */}
        <CardsVendas />

        {/* Produtos Populares */}
       <CardProdutosPopulares />
      </motion.div>
    </div>
  );
}

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

// Dados mockados para demonstração
const metricsData = {
  vendasHoje: 1253.75,
  vendasMes: 32450.9,
  clientesAtivos: 128,
  produtosEstoque: 532,
  produtosBaixoEstoque: 12,
  ultimasVendas: [
    {
      id: 1,
      cliente: 'João Silva',
      valor: 124.9,
      data: '2023-09-01T14:30:00',
      itens: 3,
    },
    {
      id: 2,
      cliente: 'Maria Oliveira',
      valor: 356.5,
      data: '2023-09-01T15:45:00',
      itens: 7,
    },
    {
      id: 3,
      cliente: 'Carlos Santos',
      valor: 89.9,
      data: '2023-09-01T16:20:00',
      itens: 2,
    },
    {
      id: 4,
      cliente: 'Ana Pereira',
      valor: 215.3,
      data: '2023-09-01T17:10:00',
      itens: 5,
    },
    {
      id: 5,
      cliente: 'Roberto Almeida',
      valor: 175.6,
      data: '2023-09-01T18:05:00',
      itens: 4,
    },
  ],
  produtosPopulares: [
    { id: 1, nome: 'Smartphone X12', quantidade: 32, valor: 1899.9 },
    { id: 2, nome: 'Fone de Ouvido Bluetooth', quantidade: 28, valor: 159.9 },
    { id: 3, nome: 'Notebook Pro 15"', quantidade: 15, valor: 4599.9 },
    { id: 4, nome: 'Carregador Tipo C', quantidade: 45, valor: 59.9 },
    { id: 5, nome: 'Mouse Sem Fio', quantidade: 37, valor: 89.9 },
  ],
};

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
      {/* <Button onClick={() => refreshToken()}>Refresh Token</Button> */}
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

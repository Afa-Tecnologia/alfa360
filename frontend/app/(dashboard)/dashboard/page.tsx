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
  const [isLoading, setIsLoading] = useState(true);

  // Simular carregamento de dados
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);
  // const refreshToken = () => {
  //   api.post('/refresh').then((response: any) => {
  //     console.log(response);
  //   });
  // };

  // Componente para renderizar métricas em estado de carregamento
  const MetricsLoading = () => (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
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

  // Componente para renderizar últimas vendas em estado de carregamento
  const LatestSalesLoading = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

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

        {isLoading ? (
          <MetricsLoading />
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Vendas Hoje"
              value={formatCurrency(metricsData.vendasHoje)}
              description="Comparado com ontem"
              icon={<ShoppingBag className="h-5 w-5" />}
              trend={{ value: 12.5, isPositive: true }}
              color="green"
              index={0}
            />

            <MetricCard
              title="Vendas do Mês"
              value={formatCurrency(metricsData.vendasMes)}
              description="Comparado com mês anterior"
              icon={<DollarSign className="h-5 w-5" />}
              trend={{ value: 8.3, isPositive: true }}
              color="blue"
              index={1}
            />

            <MetricCard
              title="Clientes Ativos"
              value={metricsData.clientesAtivos}
              description="Comparado com mês anterior"
              icon={<Users className="h-5 w-5" />}
              trend={{ value: 4.6, isPositive: true }}
              color="purple"
              index={2}
            />

            <MetricCard
              title="Produtos em Estoque"
              value={metricsData.produtosEstoque}
              description={`${metricsData.produtosBaixoEstoque} com estoque baixo`}
              icon={<Package className="h-5 w-5" />}
              trend={{ value: 2.1, isPositive: false }}
              color="orange"
              index={3}
            />
          </div>
        )}
      </motion.div>

      {/* Últimas Atividades e Produtos Populares */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid gap-6 grid-cols-1 md:grid-cols-2"
      >
        {/* Últimas Vendas */}
        {isLoading ? (
          <LatestSalesLoading />
        ) : (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Últimas Vendas</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>Vendas mais recentes realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[280px]">
                <div className="space-y-4">
                  {metricsData.ultimasVendas.map((venda) => (
                    <div
                      key={venda.id}
                      className="flex justify-between items-center pb-3 border-b"
                    >
                      <div>
                        <p className="font-medium">{venda.cliente}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatarData(venda.data)}</span>
                          <span>•</span>
                          <span>{venda.itens} itens</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold">
                          {formatCurrency(venda.valor)}
                        </span>
                        <ArrowUpRight className="ml-1 h-4 w-4 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Produtos Populares */}
        {isLoading ? (
          <LatestSalesLoading />
        ) : (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Produtos Populares</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>
                Produtos mais vendidos no período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[280px]">
                <div className="space-y-4">
                  {metricsData.produtosPopulares.map((produto) => (
                    <div
                      key={produto.id}
                      className="flex justify-between items-center pb-3 border-b"
                    >
                      <div>
                        <p className="font-medium">{produto.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {produto.quantidade} unidades vendidas
                        </p>
                      </div>
                      <div className="font-semibold">
                        {formatCurrency(produto.valor)}
                      </div>
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}

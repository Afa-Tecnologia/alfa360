'use client';


import { useState } from 'react';
import { CommissionSummary, Commission } from '@/types/reports';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
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
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  CheckIcon,
  ClockIcon,
  DollarSignIcon,
  Trophy,
  UserIcon,
  SearchIcon,
  CalendarIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ComissoesTabProps {
  commissionSummary: CommissionSummary | null;
  loading: boolean;
  formatCurrency: (value: number) => string;
}

// Cores para os gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function ComissoesTab({
  commissionSummary,
  loading,
  formatCurrency,
}: ComissoesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('resumo');

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!commissionSummary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comissões</CardTitle>
          <CardDescription>
            Acompanhe o desempenho e comissões dos vendedores
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
          <UserIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Selecione um Vendedor</h3>
          <p className="text-center text-muted-foreground max-w-md">
            Selecione um vendedor no filtro acima para visualizar as informações
            detalhadas de comissões e desempenho de vendas.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Filtrar comissões pelo termo de pesquisa
  const filteredCommissions = commissionSummary.comissoes.filter(
    (comissao) =>
      comissao.pedido_id.toString().includes(searchTerm) ||
      (comissao.produto?.name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Agrupar comissões por status
  const comissoesPorStatus = {
    pendente: commissionSummary.comissoes.filter((c) => c.status === 'pendente')
      .length,
    pago: commissionSummary.comissoes.filter((c) => c.status === 'pago').length,
  };

  // Dados para gráfico de desempenho (simulado)
  const performanceData = [
    { name: 'Jan', valor: 4000 },
    { name: 'Fev', valor: 3200 },
    { name: 'Mar', valor: 5600 },
    { name: 'Abr', valor: 7800 },
    { name: 'Mai', valor: 4800 },
    { name: 'Jun', valor: 6000 },
  ];

  // Dados para gráfico de produtos mais vendidos
  const produtosVendidos = Array.from(
    new Set(commissionSummary.comissoes.map((c) => c.produto_id))
  )
    .map((produtoId) => {
      const comissoesDoProduto = commissionSummary.comissoes.filter(
        (c) => c.produto_id === produtoId
      );
      const nomeProduto =
        comissoesDoProduto[0]?.produto?.name || `Produto #${produtoId}`;
      const totalVendas = comissoesDoProduto.reduce(
        (total, comissao) => total + comissao.quantity,
        0
      );
      const totalComissao = comissoesDoProduto.reduce(
        (total, comissao) => total + comissao.valor,
        0
      );

      return {
        id: produtoId,
        name:
          nomeProduto.length > 20
            ? nomeProduto.substring(0, 20) + '...'
            : nomeProduto,
        vendas: totalVendas,
        comissao: totalComissao,
      };
    })
    .sort((a, b) => b.comissao - a.comissao)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-amber-900 text-sm font-medium">
                  Comissão Total
                </CardTitle>
                <CardDescription className="text-amber-700">
                  Vendedor{' '}
                  {commissionSummary.vendedor?.name ||
                    commissionSummary.vendedor_id}
                </CardDescription>
              </div>
              <Trophy className="h-6 w-6 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">
              {formatCurrency(commissionSummary.comissao_total)}
            </div>
            <p className="text-xs text-amber-800 mt-1">
              Total de {commissionSummary.comissoes.length} vendas comissionadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Status das Comissões
            </CardTitle>
            <CardDescription>Comissões pagas vs pendentes</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                  <span>Pagas</span>
                </div>
                <div className="flex space-x-2 items-center">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    {comissoesPorStatus.pago}
                  </Badge>
                  <span className="text-sm font-medium">
                    {formatCurrency(
                      commissionSummary.comissoes
                        .filter((c) => c.status === 'pago')
                        .reduce((total, c) => total + c.valor, 0)
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 text-amber-500 mr-2" />
                  <span>Pendentes</span>
                </div>
                <div className="flex space-x-2 items-center">
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 border-amber-200"
                  >
                    {comissoesPorStatus.pendente}
                  </Badge>
                  <span className="text-sm font-medium">
                    {formatCurrency(
                      commissionSummary.comissoes
                        .filter((c) => c.status === 'pendente')
                        .reduce((total, c) => total + c.valor, 0)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Ticket Médio de Comissão
            </CardTitle>
            <CardDescription>Valor médio por venda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSignIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <div className="text-2xl font-bold">
                {formatCurrency(
                  commissionSummary.comissoes.length > 0
                    ? commissionSummary.comissao_total /
                        commissionSummary.comissoes.length
                    : 0
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Taxa média de comissão:{' '}
              {(
                commissionSummary.comissoes.reduce(
                  (sum, c) => sum + c.percentual,
                  0
                ) / commissionSummary.comissoes.length
              ).toFixed(1)}
              %
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Abas de navegação */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Aba de Resumo */}
        <TabsContent value="resumo" className="space-y-4">
          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Produtos</CardTitle>
                <CardDescription>Produtos com maior comissão</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={produtosVendidos}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
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
                        formatter={(value) => [
                          formatCurrency(Number(value)),
                          'Comissão',
                        ]}
                        contentStyle={{
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="comissao"
                        name="Comissão"
                        fill="#8884d8"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Status</CardTitle>
                <CardDescription>Comissões pagas vs pendentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Pagas', value: comissoesPorStatus.pago },
                          {
                            name: 'Pendentes',
                            value: comissoesPorStatus.pendente,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        <Cell fill="#4ade80" />
                        <Cell fill="#fbbf24" />
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} comissões`, '']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumo de Desempenho */}
          <Card>
            <CardHeader>
              <CardTitle>Desempenho de Vendas</CardTitle>
              <CardDescription>
                Tendência de comissões ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(Number(value)),
                        'Comissão',
                      ]}
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="valor"
                      name="Comissão"
                      stroke="#8884d8"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Detalhes */}
        <TabsContent value="detalhes">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>Detalhes das Comissões</CardTitle>
                  <CardDescription>
                    Lista de todas as comissões do vendedor
                  </CardDescription>
                </div>
                <div className="relative w-full md:w-64">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar por ID ou produto..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left">ID Pedido</th>
                      <th className="py-3 px-4 text-left">Produto</th>
                      <th className="py-3 px-4 text-center">Qtde</th>
                      <th className="py-3 px-4 text-center">%</th>
                      <th className="py-3 px-4 text-right">Valor</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCommissions.length > 0 ? (
                      filteredCommissions.map((comissao) => (
                        <tr
                          key={comissao.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="py-3 px-4">#{comissao.pedido_id}</td>
                          <td className="py-3 px-4">
                            {comissao.produto?.name ||
                              `Produto #${comissao.produto_id}`}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {comissao.quantity}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {comissao.percentual}%
                          </td>
                          <td className="py-3 px-4 text-right font-medium">
                            {formatCurrency(comissao.valor)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-center">
                              <Badge
                                variant="outline"
                                className={
                                  comissao.status === 'pendente'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-green-50 text-green-700 border-green-200'
                                }
                              >
                                {comissao.status === 'pendente'
                                  ? 'Pendente'
                                  : 'Pago'}
                              </Badge>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right text-muted-foreground">
                            {comissao.created_at
                              ? format(
                                  new Date(comissao.created_at),
                                  'dd/MM/yyyy',
                                  { locale: ptBR }
                                )
                              : '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-6 text-center text-muted-foreground"
                        >
                          {searchTerm
                            ? 'Nenhuma comissão encontrada com os termos buscados.'
                            : 'Nenhuma comissão registrada para este vendedor.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t">
              <div className="text-sm text-muted-foreground">
                Exibindo {filteredCommissions.length} de{' '}
                {commissionSummary.comissoes.length} comissões
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
        </TabsContent>

        {/* Aba de Performance */}
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Performance do Vendedor</CardTitle>
              <CardDescription>
                Métricas e indicadores de desempenho
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Métricas Principais</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center">
                        <CalendarIcon className="h-5 w-5 text-slate-600 mr-3" />
                        <span>Média diária</span>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(commissionSummary.comissao_total / 30)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center">
                        <TrendingUpIcon className="h-5 w-5 text-slate-600 mr-3" />
                        <span>Taxa de conversão</span>
                      </div>
                      <span className="font-medium">24.8%</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center">
                        <DollarSignIcon className="h-5 w-5 text-slate-600 mr-3" />
                        <span>Valor médio por venda</span>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(
                          commissionSummary.comissoes.length > 0
                            ? commissionSummary.comissao_total /
                                commissionSummary.comissoes.length
                            : 0
                        )}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium mt-6">Ranking</h3>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-amber-100 text-amber-800 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                        #2
                      </div>
                      <div>
                        <div className="font-medium">
                          {commissionSummary.vendedor?.name ||
                            `Vendedor #${commissionSummary.vendedor_id}`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Top 10% dos vendedores
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Tendência de Comissões
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={performanceData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorComissao"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#8884d8"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#8884d8"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis
                          tickFormatter={(value) => formatCurrency(value)}
                        />
                        <Tooltip
                          formatter={(value) => [
                            formatCurrency(Number(value)),
                            'Comissão',
                          ]}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="valor"
                          stroke="#8884d8"
                          fillOpacity={1}
                          fill="url(#colorComissao)"
                          name="Comissão"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-6 space-y-2">
                    <h3 className="text-lg font-medium">Metas e Objetivos</h3>
                    <div className="space-y-3 mt-2">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            Meta mensal
                          </span>
                          <span className="text-sm font-medium">
                            {formatCurrency(commissionSummary.comissao_total)} /{' '}
                            {formatCurrency(10000)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{
                              width: `${Math.min((commissionSummary.comissao_total / 10000) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-right mt-1 text-gray-500">
                          {Math.min(
                            (commissionSummary.comissao_total / 10000) * 100,
                            100
                          ).toFixed(0)}
                          % concluído
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

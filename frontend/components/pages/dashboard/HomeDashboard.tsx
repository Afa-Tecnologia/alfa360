'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/format';
import {
  ArrowRight,
  ShoppingCart,
  Package,
  DollarSign,
  Users,
  Clock,
  BarChart,
  Settings,
  Receipt,
  AlertCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Tag,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CaixaService } from '@/services/caixaService';
import { CaixaStatus, MovimentacaoCaixa } from '@/types/caixa';
import { ScrollArea } from '@/components/ui/scroll-area';

export function WelcomeScreenDashboard() {
  const router = useRouter();
  const [statusCaixa, setStatusCaixa] = useState<CaixaStatus | null>(null);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoCaixa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statusData, movimentacoesData] = await Promise.all([
          CaixaService.checkStatus(),
          CaixaService.getMovimentacoes(),
        ]);
        setStatusCaixa(statusData);
        setMovimentacoes(movimentacoesData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Não foi possível carregar os dados.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const isCaixaOpen = statusCaixa?.status === 'open';
  const caixaId = statusCaixa?.id || 0;

  const handleNovaVenda = () => {
    router.push(`/caixa/${caixaId}/venda`);
  };

  const handleHistoricoVendas = () => {
    router.push(`/caixa/${caixaId}/historico`);
  };

  const handleRelatorio = () => {
    router.push(`/caixa/${caixaId}/report`);
  };

  const handleConfiguracoes = () => {
    router.push('/configuracoes');
  };

  const handleCategorias = () => {
    router.push('/categorias');
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Status do Caixa */}
      <Card
        className={isCaixaOpen ? 'border-green-500/50' : 'border-orange-500/50'}
      >
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">
                {isCaixaOpen ? (
                  <div className="flex items-center">
                    <Badge className="mr-2 bg-green-500 hover:bg-green-600">
                      Aberto
                    </Badge>
                    PDV em Operação
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Badge className="mr-2 bg-orange-500 hover:bg-orange-600">
                      Fechado
                    </Badge>
                    PDV Inativo
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                {isCaixaOpen
                  ? 'O PDV está aberto e pronto para realizar vendas'
                  : 'O PDV está fechado. Abra-o para iniciar as operações'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        {isCaixaOpen && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Saldo Atual</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(Number(statusCaixa?.saldoAtual || 0))}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </CardContent>
              </Card>

              <Card className="bg-card/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Operador</p>
                    <p className="text-lg font-semibold">
                      {statusCaixa?.user?.name || 'Não identificado'}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </CardContent>
              </Card>

              <Card className="bg-card/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Desde</p>
                    <p className="text-lg font-semibold">
                      {statusCaixa?.open_date
                        ? formatarData(statusCaixa.open_date)
                        : 'N/A'}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-500" />
                </CardContent>
              </Card>

              <Card className="bg-card/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-lg font-semibold">Ativo</p>
                  </div>
                  <BarChart className="h-8 w-8 text-purple-500" />
                </CardContent>
              </Card>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Ações Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={handleNovaVenda}
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-green-100 rounded-full">
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Nova Venda</h3>
                <p className="text-sm text-muted-foreground">
                  Iniciar uma nova venda
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={handleHistoricoVendas}
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Receipt className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Histórico</h3>
                <p className="text-sm text-muted-foreground">
                  Visualizar vendas realizadas
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={handleRelatorio}
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Relatório</h3>
                <p className="text-sm text-muted-foreground">
                  Gerar relatório do período
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={handleConfiguracoes}
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Settings className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Configurações</h3>
                <p className="text-sm text-muted-foreground">
                  Ajustar configurações do PDV
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={handleCategorias}
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-indigo-100 rounded-full">
                <Tag className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Categorias</h3>
                <p className="text-sm text-muted-foreground">
                  Gerenciar categorias de produtos
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Atividades Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>
            Últimas movimentações realizadas no caixa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {movimentacoes.length > 0 ? (
                movimentacoes.map((mov) => (
                  <div
                    key={mov.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2 rounded-full ${
                          mov.type === 'entrada' ? 'bg-green-100' : 'bg-red-100'
                        }`}
                      >
                        {mov.type === 'entrada' ? (
                          <ArrowUpCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowDownCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{mov.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {mov.pedido
                            ? `Pedido #${mov.pedido.codigo}`
                            : mov.payment_method || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          mov.type === 'entrada'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {formatCurrency(Number(mov.value))}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatarData(mov.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma movimentação recente
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Alertas e Informações */}
      {!isCaixaOpen && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Atenção!</AlertTitle>
          <AlertDescription>
            O PDV está fechado. Para iniciar as operações, é necessário abrir o
            caixa primeiro.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

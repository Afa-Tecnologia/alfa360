'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  User,
} from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime } from '@/utils/format';
import { CaixaService } from '@/services/caixaService';
import { CaixaDetalhesResponse } from '@/types/caixa';
import { MovimentacoesPanel } from '@/components/caixa/MovimentacoesPanel';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DetalheCaixaPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [detalhes, setDetalhes] = useState<CaixaDetalhesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetalhes = async () => {
      try {
        setIsLoading(true);
        const response = await CaixaService.getDetalhes(Number(params.id));
        setDetalhes(response);
      } catch (error) {
        console.error('Erro ao buscar detalhes do caixa:', error);
        setError('Não foi possível carregar os detalhes do caixa.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetalhes();
  }, [params.id]);

  const handleVoltar = () => {
    router.push('/caixa/historico');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <p>Carregando detalhes do caixa...</p>
        </div>
      </div>
    );
  }

  if (error || !detalhes) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center min-h-[400px] flex-col">
          <p className="text-red-500 mb-4">{error || 'Caixa não encontrado'}</p>
          <Button onClick={handleVoltar}>Voltar para o histórico</Button>
        </div>
      </div>
    );
  }

  const { caixa, report } = detalhes;

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleVoltar}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Detalhes do Caixa #{caixa.id}</h1>
          <Badge
            className={
              caixa.status === 'open' ? 'bg-green-500' : 'bg-slate-500'
            }
          >
            {caixa.status === 'open' ? 'Aberto' : 'Fechado'}
          </Badge>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => window.open(`/caixa/${params.id}/report`, '_blank')}
        >
          <FileText className="h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <h3 className="font-medium">Saldo Inicial</h3>
            </div>
            <p className="text-2xl font-bold mt-1">
              {formatCurrency(Number(caixa.saldo_inicial))}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <h3 className="font-medium">Saldo Final</h3>
            </div>
            <p className="text-2xl font-bold mt-1">
              {caixa.saldo_final
                ? formatCurrency(Number(caixa.saldo_final))
                : formatCurrency(Number(report.saldo_final))}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500" />
              <h3 className="font-medium">Data de Abertura</h3>
            </div>
            <p className="text-lg font-medium mt-1">
              {formatDateTime(caixa.open_date)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-purple-500" />
              <h3 className="font-medium">Operador</h3>
            </div>
            <p className="text-lg font-medium mt-1">
              {caixa.user?.name || 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Total de Entradas
                </h3>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(Number(report.total_entradas))}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Total de Saídas
                </h3>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(Number(report.total_saidas))}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Saldo do Período
                </h3>
                <p className="text-xl font-bold">
                  {formatCurrency(
                    Number(report.total_entradas) - Number(report.total_saidas)
                  )}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Data de Fechamento
                </h3>
                <p className="text-lg">
                  {caixa.close_date
                    ? formatDateTime(caixa.close_date)
                    : 'Em aberto'}
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            <h3 className="font-medium mb-3">
              Recebimentos por Método de Pagamento
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {Object.entries(report.por_forma_pagamento).map(
                ([method, value]) => (
                  <Card key={method}>
                    <CardContent className="p-3">
                      <h4 className="text-xs font-medium text-muted-foreground mb-1">
                        {method === 'MONEY'
                          ? 'Dinheiro'
                          : method === 'CREDIT_CARD'
                            ? 'Cartão de Crédito'
                            : method === 'DEBIT_CARD'
                              ? 'Cartão de Débito'
                              : method === 'PIX'
                                ? 'PIX'
                                : method === 'TRANSFER'
                                  ? 'Transferência'
                                  : method === 'CONDITIONAL'
                                    ? 'Condicional'
                                    : method}
                      </h4>
                      <p className="text-lg font-bold">
                        {formatCurrency(Number(value))}
                      </p>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {caixa.observation || 'Nenhuma observação registrada.'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="movimentacoes" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
          <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
        </TabsList>
        <TabsContent value="movimentacoes">
          <MovimentacoesPanel
            movimentacoes={caixa.movimentacoes}
            onReload={() => {}} // Sem necessidade, já que é uma visualização estática
            onRegistrarEntrada={() => {}} // Desativado na visualização
            onRegistrarSaida={() => {}} // Desativado na visualização
          />
        </TabsContent>
        <TabsContent value="pedidos">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Relacionados</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {caixa.movimentacoes.filter((m) => m.pedido_id).length > 0
                  ? `${caixa.movimentacoes.filter((m) => m.pedido_id).length} pedidos associados a este caixa.`
                  : 'Nenhum pedido associado a este caixa.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

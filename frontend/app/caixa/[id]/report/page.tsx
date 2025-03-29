'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, DollarSign, User, FileText } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { CaixaService } from '@/services/caixaService';
import { ReportResponse } from '@/types/caixa';
import { Separator } from '@/components/ui/separator';

export default function RelatorioCaixaPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true);
        const data = await CaixaService.getReport(Number(params.id));
        setReport(data);
      } catch (error) {
        console.error('Erro ao buscar relatório do caixa:', error);
        setError('Não foi possível carregar o relatório do caixa.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [params.id]);

  const handleVoltar = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <p>Carregando relatório do caixa...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center min-h-[400px] flex-col">
          <p className="text-red-500 mb-4">
            {error || 'Relatório não encontrado'}
          </p>
          <Button onClick={handleVoltar}>Voltar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleVoltar}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            Relatório do Caixa #{params.id}
          </h1>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => window.print()}
        >
          <FileText className="h-4 w-4" />
          Imprimir Relatório
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
              {formatCurrency(Number(report.saldo_inicial))}
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
              {formatCurrency(Number(report.saldo_final))}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500" />
              <h3 className="font-medium">Data</h3>
            </div>
            <p className="text-lg font-medium mt-1">
              {formatDateTime(report.open_date)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-purple-500" />
              <h3 className="font-medium">Operador</h3>
            </div>
            <p className="text-lg font-medium mt-1">N/A</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
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
                {report.close_date
                  ? formatDateTime(report.close_date)
                  : 'Em aberto'}
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          <h3 className="font-medium mb-3">Entradas por Método de Pagamento</h3>
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
    </div>
  );
}

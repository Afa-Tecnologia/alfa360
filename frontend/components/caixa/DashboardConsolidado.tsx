import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CalendarIcon, RefreshCcw, FileText } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/format';
import { CaixaService } from '@/services/caixaService';
import { ConsolidadoCaixas } from '@/types/caixa';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';

// Componente principal do Dashboard Consolidado
export function DashboardConsolidado({
  startDate,
  endDate,
}: {
  startDate?: Date;
  endDate?: Date;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [consolidado, setConsolidado] = useState<ConsolidadoCaixas | null>(
    null
  );
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Função para buscar o consolidado
  const fetchConsolidado = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Formatar datas para enviar ao backend
      const dataInicio = startDate
        ? format(startDate, 'yyyy-MM-dd')
        : undefined;
      const dataFim = endDate ? format(endDate, 'yyyy-MM-dd') : undefined;

      const data = await CaixaService.getConsolidado(dataInicio, dataFim);
      setConsolidado(data);
    } catch (error) {
      console.error('Erro ao buscar consolidado:', error);
      setError('Não foi possível carregar o consolidado de caixas.');
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar dados ao montar o componente ou quando o filtro de data mudar
  useEffect(() => {
    fetchConsolidado();
  }, [startDate, endDate]);

  // Formatar período para exibição
  const periodoFormatado =
    startDate && endDate
      ? `${format(startDate, 'dd/MM/yyyy')} até ${format(endDate, 'dd/MM/yyyy')}`
      : 'Hoje';

  // Função para fazer download do PDF
  const handleDownloadPDF = async () => {
    if (!consolidado) return;

    try {
      setIsDownloadingPdf(true);

      // Formatar datas para enviar ao backend
      const dataInicio = startDate
        ? format(startDate, 'yyyy-MM-dd')
        : undefined;
      const dataFim = endDate ? format(endDate, 'yyyy-MM-dd') : undefined;

      await CaixaService.downloadConsolidadoPDF(dataInicio, dataFim);
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchConsolidado} className="mt-4">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Relatório Consolidado dos Caixas
          </h2>
          <p className="text-muted-foreground">
            Relatório consolidado de caixas {periodoFormatado}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={fetchConsolidado}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>

          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            disabled={isDownloadingPdf || !consolidado}
          >
            <FileText className="h-4 w-4 mr-2" />
            {isDownloadingPdf ? 'Baixando...' : 'Exportar PDF'}
          </Button>
        </div>
      </div>

      {consolidado && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground">
                  Total de Caixas
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-2xl font-bold">
                    {consolidado.totais.caixas}
                  </div>
                  <div className="flex gap-1">
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      {consolidado.totais.caixas_abertos} abertos
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-slate-50 text-slate-700 border-slate-200"
                    >
                      {consolidado.totais.caixas_fechados} fechados
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground">
                  Total de Entradas
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(consolidado.totais.total_entradas)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground">
                  Total de Saídas
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(consolidado.totais.total_saidas)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground">
                  Saldo Bruto (Entradas - Saídas)
                </div>
                <div
                  className={`text-2xl font-bold ${consolidado.totais.saldo_liquido >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {formatCurrency(consolidado.totais.saldo_liquido)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="por-usuario">
            <TabsList className="mb-4">
              <TabsTrigger value="por-usuario">Por Operador</TabsTrigger>
              <TabsTrigger value="por-metodo">
                Por Método de Pagamento
              </TabsTrigger>
            </TabsList>

            <TabsContent value="por-usuario">
              <Card>
                <CardHeader>
                  <CardTitle>Operações por Usuário</CardTitle>
                  <CardDescription>
                    Relatório de movimentações financeiras agrupadas por
                    operador
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left font-medium p-2">
                            Operador
                          </th>
                          <th className="text-center font-medium p-2">
                            Caixas
                          </th>
                          <th className="text-right font-medium p-2">
                            Entradas
                          </th>
                          <th className="text-right font-medium p-2">Saídas</th>
                          <th className="text-right font-medium p-2">Saldo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consolidado.por_usuario.map((item) => (
                          <tr
                            key={item.usuario.id}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="p-2">{item.usuario.nome}</td>
                            <td className="p-2 text-center">
                              {item.total_caixas}
                            </td>
                            <td className="p-2 text-right text-green-600">
                              {formatCurrency(item.total_entradas)}
                            </td>
                            <td className="p-2 text-right text-red-600">
                              {formatCurrency(item.total_saidas)}
                            </td>
                            <td
                              className={`p-2 text-right font-medium ${item.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}
                            >
                              {formatCurrency(item.saldo)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-muted/30">
                          <td className="p-2 font-bold">TOTAL</td>
                          <td className="p-2 text-center font-bold">
                            {consolidado.totais.caixas}
                          </td>
                          <td className="p-2 text-right font-bold text-green-600">
                            {formatCurrency(consolidado.totais.total_entradas)}
                          </td>
                          <td className="p-2 text-right font-bold text-red-600">
                            {formatCurrency(consolidado.totais.total_saidas)}
                          </td>
                          <td
                            className={`p-2 text-right font-bold ${consolidado.totais.saldo_liquido >= 0 ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {formatCurrency(consolidado.totais.saldo_liquido)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="por-metodo">
              <Card>
                <CardHeader>
                  <CardTitle>Entradas por Método de Pagamento</CardTitle>
                  <CardDescription>
                    Distribuição das entradas por método de pagamento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left font-medium p-2">Método</th>
                          <th className="text-right font-medium p-2">Valor</th>
                          <th className="text-right font-medium p-2">%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consolidado.entradas_por_metodo.map((item, index) => {
                          const percentual =
                            consolidado.totais.total_entradas > 0
                              ? (item.valor /
                                  consolidado.totais.total_entradas) *
                                100
                              : 0;

                          return (
                            <tr
                              key={index}
                              className="border-b hover:bg-muted/50"
                            >
                              <td className="p-2 capitalize">{item.metodo}</td>
                              <td className="p-2 text-right">
                                {formatCurrency(item.valor)}
                              </td>
                              <td className="p-2 text-right">
                                {percentual.toFixed(1)}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-muted/30">
                          <td className="p-2 font-bold">TOTAL</td>
                          <td className="p-2 text-right font-bold">
                            {formatCurrency(consolidado.totais.total_entradas)}
                          </td>
                          <td className="p-2 text-right font-bold">100%</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

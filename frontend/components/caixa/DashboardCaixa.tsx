'use client';

import { useState } from 'react';
import { CaixaStatus, MovimentacaoCaixa } from '@/types/caixa';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/format';
import { EstatisticasCaixa, EntradaItem, SaidaItem } from './EstatisticasCaixa';
import { MovimentacoesPanel } from './MovimentacoesPanel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AbrirCaixaForm } from './forms/AbrirCaixaForm';
import { FecharCaixaForm } from './forms/FecharCaixaForm';
import { MovimentacaoForm } from './forms/MovimentacaoForm';
import {
  AlertCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  CircleDollarSign,
  Clock,
  Lock,
  ShoppingBag,
  UserRound,
  Wallet,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface DashboardCaixaProps {
  statusCaixa: CaixaStatus | null;
  movimentacoes: MovimentacaoCaixa[];
  onUpdate: () => void;
}

export function DashboardCaixa({
  statusCaixa,
  movimentacoes,
  onUpdate,
}: DashboardCaixaProps) {
  const [modalAbrir, setModalAbrir] = useState(false);
  const [modalFechar, setModalFechar] = useState(false);
  const [modalMovimentacao, setModalMovimentacao] = useState(false);
  const [tipoMovimentacao, setTipoMovimentacao] = useState<'entrada' | 'saida'>(
    'entrada'
  );

  // Calcular estatísticas
  const totalEntradas = movimentacoes
    .filter((m) => m.type === 'entrada')
    .reduce((sum, m) => sum + Number(m.value), 0);

  const totalSaidas = movimentacoes
    .filter((m) => m.type === 'saida')
    .reduce((sum, m) => sum + Number(m.value), 0);

  const saldoInicial = statusCaixa?.caixa
    ? Number(statusCaixa.caixa.saldo_inicial)
    : 0;
  const saldoAtual = statusCaixa?.saldoAtual
    ? Number(statusCaixa.saldoAtual)
    : saldoInicial + totalEntradas - totalSaidas;

  // Calcular entradas por método de pagamento
  const entradasPorMetodo = movimentacoes
    .filter((m) => m.type === 'entrada')
    .reduce(
      (acc, m) => {
        const metodo = m.payment_method || 'Não informado';
        if (!acc[metodo]) {
          acc[metodo] = 0;
        }
        acc[metodo] += Number(m.value);
        return acc;
      },
      {} as Record<string, number>
    );

  // Agrupar dados para o componente de estatísticas
  const estatisticasData = {
    saldoInicial: formatCurrency(+saldoInicial.toString()),
    saldoAtual: formatCurrency(+saldoAtual.toString()),
    totalEntradas: formatCurrency(+totalEntradas.toString()),
    totalSaidas: formatCurrency(+totalSaidas.toString()),
    entradas: Object.entries(entradasPorMetodo).map(([metodo, valor]) => ({
      metodo,
      valor,
    })) as EntradaItem[],
    saidas: movimentacoes
      .filter((m) => m.type === 'saida')
      .map((m) => ({
        descricao: m.description,
        valor: Number(m.value),
      })) as SaidaItem[],
  };

  // Manipulador para abrir o modal de movimentação
  const handleAbrirModalMovimentacao = (tipo: 'entrada' | 'saida') => {
    setTipoMovimentacao(tipo);
    setModalMovimentacao(true);
  };

  // Estado do caixa
  const isCaixaOpen = statusCaixa?.status === 'open';
  const caixaId = statusCaixa?.id || 0;

  // Se não tem dados do status do caixa ainda
  if (!statusCaixa) {
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
    <div className="space-y-4">
      {/* Status do Caixa */}
      <Card
        className={isCaixaOpen ? 'border-green-500/50' : 'border-orange-500/50'}
      >
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-xl">
                {isCaixaOpen ? (
                  <div className="flex items-center">
                    <Badge className="mr-2 bg-green-500 hover:bg-green-600">
                      Aberto
                    </Badge>
                    Caixa em Operação
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Badge className="mr-2 bg-orange-500 hover:bg-orange-600">
                      Fechado
                    </Badge>
                    Caixa Inativo
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                {isCaixaOpen
                  ? 'O caixa está aberto e pronto para registrar movimentações'
                  : 'O caixa está fechado. Abra-o para iniciar as operações'}
              </CardDescription>
            </div>

            <div className="flex flex-wrap gap-2">
              {isCaixaOpen ? (
                <>
                  <Button
                    onClick={() => handleAbrirModalMovimentacao('entrada')}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <ArrowUpCircle className="mr-2 h-4 w-4" />
                    Entrada
                  </Button>
                  <Button
                    onClick={() => handleAbrirModalMovimentacao('saida')}
                    variant="destructive"
                    size="sm"
                  >
                    <ArrowDownCircle className="mr-2 h-4 w-4" />
                    Saída
                  </Button>
                  <Button
                    onClick={() => setModalFechar(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Fechar Caixa
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setModalAbrir(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Abrir Caixa
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {isCaixaOpen && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
              <Card className="bg-card/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Saldo Atual</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(+saldoAtual.toString())}
                      </p>
                    </div>
                    
                  </div>
                  <CircleDollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
                </CardContent>
              </Card>

              <Card className="bg-card/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                   
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Operador</p>
                      <p className="text-base font-medium truncate">
                        {statusCaixa.user?.name || 'Não identificado'}
                      </p>
                    </div>
                  </div>
                  <UserRound className="h-5 w-5 mr-2 text-muted-foreground" />
                </CardContent>
              </Card>

              <Card className="bg-card/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Desde</p>
                      <p className="text-base font-medium">
                        {statusCaixa?.open_date
                          ? new Date(
                              statusCaixa?.open_date
                            ).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '--'}
                      </p>
                    </div>
                  </div>
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                </CardContent>
              </Card>

              <Card className="bg-card/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Movimentações</p>
                      <p className="text-lg font-semibold">
                        {movimentacoes.length}
                      </p>
                    </div>
                  </div>
                  <ShoppingBag className="h-5 w-5 mr-2 text-muted-foreground" />
                </CardContent>
              </Card>
            </div>
          </CardContent>
        )}
      </Card>

      {!isCaixaOpen && (
        <Alert
          variant="default"
          className="bg-amber-500/10 border-amber-500/50 text-amber-700"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Caixa fechado</AlertTitle>
          <AlertDescription>
            O caixa está fechado e não é possível registrar movimentações. Abra
            o caixa para começar a operação.
          </AlertDescription>
        </Alert>
      )}

      {isCaixaOpen && (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <EstatisticasCaixa
              saldoInicial={estatisticasData.saldoInicial}
              saldoAtual={estatisticasData.saldoAtual}
              totalEntradas={estatisticasData.totalEntradas}
              totalSaidas={estatisticasData.totalSaidas}
              entradas={estatisticasData.entradas}
              saidas={estatisticasData.saidas}
            />
          </div>

          <div className="lg:col-span-2">
            <MovimentacoesPanel
              movimentacoes={movimentacoes}
              onReload={onUpdate}
              onRegistrarEntrada={() => handleAbrirModalMovimentacao('entrada')}
              onRegistrarSaida={() => handleAbrirModalMovimentacao('saida')}
            />
          </div>
        </div>
      )}

      {/* Modais */}
      <Dialog open={modalAbrir} onOpenChange={setModalAbrir}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Abrir Caixa</DialogTitle>
          </DialogHeader>
          <AbrirCaixaForm
            onSuccess={() => {
              setModalAbrir(false);
              onUpdate();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={modalFechar} onOpenChange={setModalFechar}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Fechar Caixa</DialogTitle>
          </DialogHeader>
          <FecharCaixaForm
            caixaId={Number(caixaId)}
            saldoAtual={saldoAtual}
            onSuccess={() => {
              setModalFechar(false);
              onUpdate();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={modalMovimentacao} onOpenChange={setModalMovimentacao}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {tipoMovimentacao === 'entrada'
                ? 'Registrar Entrada no Caixa'
                : 'Registrar Saída do Caixa'}
            </DialogTitle>
          </DialogHeader>
          <MovimentacaoForm
            caixaId={caixaId.toString()}
            tipoInicial={tipoMovimentacao}
            onSuccess={() => {
              setModalMovimentacao(false);
              onUpdate();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

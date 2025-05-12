'use client';

import { CaixaStatus } from '@/types/caixa';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/format';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CircleDollarSign,
  Clock,
  Lock,
  Wallet,
  UserRound,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EstadoCaixaProps {
  statusCaixa: CaixaStatus;
  saldoAtual: number;
  onOpenMovimentacao: (tipo: 'entrada' | 'saida') => void;
  onOpenCaixa: () => void;
  onCloseCaixa: () => void;
}

export function EstadoCaixa({
  statusCaixa,
  saldoAtual,
  onOpenMovimentacao,
  onOpenCaixa,
  onCloseCaixa,
}: EstadoCaixaProps) {
  const isCaixaOpen = statusCaixa?.status === 'aberto';

  return (
    <Card
      className={cn(
        'overflow-hidden border-2 relative',
        isCaixaOpen
          ? 'border-green-300 dark:border-green-700'
          : 'border-orange-300 dark:border-orange-700'
      )}
    >
      <div className="absolute top-0 right-0 w-20 h-20">
        <div
          className={cn(
            'absolute -right-10 -top-10 w-20 h-20 rotate-45',
            isCaixaOpen ? 'bg-green-500' : 'bg-orange-500'
          )}
        ></div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <div className="flex items-center">
              <Badge
                className={cn(
                  'mr-2 px-3 py-1',
                  isCaixaOpen
                    ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400'
                )}
              >
                {isCaixaOpen ? 'ABERTO' : 'FECHADO'}
              </Badge>
              <CardTitle className="text-xl">
                {isCaixaOpen ? 'Caixa em Operação' : 'Caixa Inativo'}
              </CardTitle>
            </div>
            <CardDescription>
              {isCaixaOpen
                ? 'O caixa está aberto e pronto para registrar movimentações'
                : 'O caixa está fechado. Abra-o para iniciar as operações'}
            </CardDescription>
          </div>

          <div className="flex flex-wrap gap-2">
            {isCaixaOpen && statusCaixa.id ? (
              <>
                <Button
                  onClick={() => onOpenMovimentacao('entrada')}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <ArrowUpCircle className="mr-2 h-4 w-4" />
                  Entrada
                </Button>
                <Button
                  onClick={() => onOpenMovimentacao('saida')}
                  variant="destructive"
                  size="sm"
                >
                  <ArrowDownCircle className="mr-2 h-4 w-4" />
                  Saída
                </Button>
                <Button onClick={onCloseCaixa} variant="outline" size="sm">
                  <Lock className="mr-2 h-4 w-4" />
                  Fechar Caixa
                </Button>
              </>
            ) : (
              <Button
                onClick={onOpenCaixa}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg flex items-center">
              <div className="mr-4 bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                <CircleDollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo Atual</p>
                <p className="text-lg font-bold">
                  {formatCurrency(saldoAtual)}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg flex items-center">
              <div className="mr-4 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <UserRound className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Operador</p>
                <p className="text-lg font-bold truncate">
                  {statusCaixa.user?.name || 'Não identificado'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg flex items-center">
              <div className="mr-4 bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aberto desde</p>
                <p className="text-lg font-bold">
                  {statusCaixa?.open_date
                    ? new Date(statusCaixa.open_date).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

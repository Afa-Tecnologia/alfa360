'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/lib/utils';
import {
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
  PiggyBank,
  CreditCard,
  Wallet,
} from 'lucide-react';

interface MetricsCardsProps {
  saldoInicial: number;
  saldoAtual: number;
  totalEntradas: number;
  totalSaidas: number;
  entradasPorMetodo: Record<string, number>;
}

export function MetricsCards({
  saldoInicial,
  saldoAtual,
  totalEntradas,
  totalSaidas,
  entradasPorMetodo,
}: MetricsCardsProps) {
  // Calcular porcentagem de lucro ou prejuízo
  const lucro = saldoAtual - saldoInicial;
  const percentualLucro = saldoInicial > 0 ? (lucro / saldoInicial) * 100 : 0;
  const isPositive = lucro >= 0;

  // Mapear métodos de pagamento para ícones
  const metodoPagamentoIcons: Record<string, React.ReactNode> = {
    CREDIT_CARD: <CreditCard className="h-4 w-4 text-blue-500" />,
    DEBIT_CARD: <CreditCard className="h-4 w-4 text-green-500" />,
    pix: <TrendingUp className="h-4 w-4 text-purple-500" />,
    MONEY: <Wallet className="h-4 w-4 text-green-600" />,
    'Não informado': <CreditCard className="h-4 w-4 text-gray-500" />,
  };

  // Obter o método de pagamento mais utilizado
  const metodosOrdenados = Object.entries(entradasPorMetodo).sort(
    ([, valorA], [, valorB]) => valorB - valorA
  );

  const metodoMaisUtilizado =
    metodosOrdenados.length > 0 ? metodosOrdenados[0][0] : 'Nenhum';

  const valorMetodoMaisUtilizado =
    metodosOrdenados.length > 0 ? metodosOrdenados[0][1] : 0;

  const percentualMetodoMaisUtilizado =
    totalEntradas > 0 ? (valorMetodoMaisUtilizado / totalEntradas) * 100 : 0;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Estatísticas do Caixa</h2>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Saldo Inicial */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Saldo Inicial</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {formatCurrency(saldoInicial)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Valor de abertura do caixa
            </p>
          </CardContent>
        </Card>

        {/* Total de Entradas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Entradas</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(totalEntradas)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de receitas registradas
            </p>
          </CardContent>
        </Card>

        {/* Total de Saídas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Saídas</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-600">
              {formatCurrency(totalSaidas)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de despesas registradas
            </p>
          </CardContent>
        </Card>

        {/* Método de Pagamento Principal */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Método Principal
            </CardTitle>
            {metodoPagamentoIcons[metodoMaisUtilizado] || (
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-base font-bold truncate">
                {metodoMaisUtilizado !== 'Nenhum'
                  ? metodoMaisUtilizado.replace('_', ' ').toLowerCase()
                  : 'Nenhum'}
              </div>
              <div className="text-sm font-medium">
                {valorMetodoMaisUtilizado > 0
                  ? `${formatCurrency(valorMetodoMaisUtilizado)} (${percentualMetodoMaisUtilizado.toFixed(0)}%)`
                  : 'N/A'}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Método de pagamento mais utilizado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resumo do Caixa */}
      <Card
        className={cn(
          'border-l-4',
          isPositive ? 'border-l-green-500' : 'border-l-red-500'
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Resumo do Caixa</CardTitle>
          {isPositive ? (
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div
              className={cn(
                'text-2xl font-bold',
                isPositive ? 'text-green-600' : 'text-red-600'
              )}
            >
              {formatCurrency(lucro)}
            </div>

            <div className="text-sm font-medium mt-1 flex items-center">
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(percentualLucro).toFixed(1)}%{' '}
                {isPositive ? 'de ganho' : 'de perda'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                Saldo Inicial
              </span>
              <span className="text-sm font-medium">
                {formatCurrency(saldoInicial)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Saldo Atual</span>
              <span className="text-sm font-medium">
                {formatCurrency(saldoAtual)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

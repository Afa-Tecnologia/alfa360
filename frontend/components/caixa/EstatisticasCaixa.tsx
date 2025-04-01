'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleDollarSign, CreditCard, Wallet } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface EntradaItem {
  metodo: string;
  valor: number;
}

export interface SaidaItem {
  descricao: string;
  valor: number;
}

interface EstatisticasCaixaProps {
  saldoInicial: string;
  saldoAtual: string;
  totalEntradas: string;
  totalSaidas: string;
  entradas: EntradaItem[];
  saidas: SaidaItem[];
}

/**
 * Componente para exibir estatísticas e gráficos relacionados ao caixa
 */
export function EstatisticasCaixa({
  saldoInicial,
  saldoAtual,
  totalEntradas,
  totalSaidas,
  entradas,
  saidas,
}: EstatisticasCaixaProps) {
  // Converter valores para números para cálculos
  const valorSaldoInicial = Number(
    saldoInicial.replace(/[^\d,-]/g, '').replace(',', '.')
  );
  const valorTotalEntradas = Number(
    totalEntradas.replace(/[^\d,-]/g, '').replace(',', '.')
  );
  const valorTotalSaidas = Number(
    totalSaidas.replace(/[^\d,-]/g, '').replace(',', '.')
  );

  // Calcular percentuais para exibição
  const percentualEntradas =
    valorSaldoInicial > 0
      ? (valorTotalEntradas / valorSaldoInicial) * 100
      : valorTotalEntradas > 0
        ? 100
        : 0;

  const percentualSaidas =
    valorSaldoInicial > 0
      ? (valorTotalSaidas / valorSaldoInicial) * 100
      : valorTotalSaidas > 0
        ? 100
        : 0;

  // Agrupar entradas por método de pagamento
  const totalValorEntradas = entradas.reduce(
    (sum, entry) => sum + entry.valor,
    0
  );

  // Função para traduzir método de pagamento
  const traduzirMetodo = (metodo: string) => {
    const traducoes: Record<string, string> = {
      MONEY: 'Dinheiro',
      CREDIT_CARD: 'Cartão de Crédito',
      DEBIT_CARD: 'Cartão de Débito',
      PIX: 'PIX',
      TRANSFER: 'Transferência',
      CONDITIONAL: 'Condicional',
    };

    return traducoes[metodo] || metodo;
  };

  // Obter ícone para método de pagamento
  const getIconForMethod = (metodo: string) => {
    switch (metodo) {
      case 'MONEY':
        return <CircleDollarSign className="h-4 w-4" />;
      case 'CREDIT_CARD':
      case 'DEBIT_CARD':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <Wallet className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Estatísticas do Caixa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Resumo do caixa */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div>Saldo Inicial</div>
            <div className="font-medium">{saldoInicial}</div>
          </div>

          <div className="flex justify-between text-sm">
            <div className="flex items-center text-green-600">
              <span className="mr-1">+</span> Entradas
            </div>
            <div className="font-medium text-green-600">{totalEntradas}</div>
          </div>

          <div className="flex justify-between text-sm">
            <div className="flex items-center text-red-600">
              <span className="mr-1">-</span> Saídas
            </div>
            <div className="font-medium text-red-600">{totalSaidas}</div>
          </div>

          <div className="h-px bg-gray-200 my-2"></div>

          <div className="flex justify-between font-semibold">
            <div>Saldo Atual</div>
            <div>{saldoAtual}</div>
          </div>
        </div>

        {/* Progresso de entradas e saídas */}
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>Entradas</span>
              <span className="text-green-600">
                {Math.round(percentualEntradas)}%
              </span>
            </div>
            <Progress value={percentualEntradas} className="h-2 bg-gray-100" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>Saídas</span>
              <span className="text-red-600">
                {Math.round(percentualSaidas)}%
              </span>
            </div>
            <Progress value={percentualSaidas} className="h-2 bg-gray-100" />
          </div>
        </div>

        {/* Distribuição por método de pagamento */}
        {entradas.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2">Entradas por Método</div>
            <div className="space-y-2">
              {entradas.map((entrada, index) => {
                const percentual =
                  totalValorEntradas > 0
                    ? (entrada.valor / totalValorEntradas) * 100
                    : 0;

                return (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2 p-1">
                          {getIconForMethod(entrada.metodo)}
                        </Badge>
                        <span>{traduzirMetodo(entrada.metodo)}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {Math.round(percentual)}%
                      </span>
                    </div>
                    <Progress
                      value={percentual}
                      className="h-1.5 bg-gray-100"
                    
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

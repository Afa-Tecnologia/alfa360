'use client';

import { CommissionSummary } from '@/types/reports';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DetalhesComissoesProps {
  commissionSummary: CommissionSummary;
  formatCurrency: (value: number) => string;
}

export function DetalhesComissoes({
  commissionSummary,
  formatCurrency,
}: DetalhesComissoesProps) {
  // Calcular totais
  const comissoesPagas = commissionSummary.comissoes
    .filter((c) => c.status === 'pago')
    .reduce((total, c) => total + c.valor, 0);

  const comissoesPendentes = commissionSummary.comissoes
    .filter((c) => c.status === 'pendente')
    .reduce((total, c) => total + c.valor, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes das Comissões</CardTitle>
        <CardDescription>
          Informações detalhadas sobre as comissões do vendedor
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Resumo Geral</h4>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-muted-foreground">
                  Total de Vendas
                </dt>
                <dd className="text-2xl font-bold">
                  {commissionSummary.comissoes.length}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">
                  Comissão Total
                </dt>
                <dd className="text-2xl font-bold">
                  {formatCurrency(commissionSummary.comissao_total)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">
                  Comissões Pagas
                </dt>
                <dd className="text-2xl font-bold text-green-600">
                  {formatCurrency(comissoesPagas)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">
                  Comissões Pendentes
                </dt>
                <dd className="text-2xl font-bold text-blue-600">
                  {formatCurrency(comissoesPendentes)}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">
              Informações do Vendedor
            </h4>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-muted-foreground">Nome</dt>
                <dd className="text-lg font-medium">
                  {commissionSummary.vendedor?.name}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">
                  ID do Vendedor
                </dt>
                <dd className="text-lg font-medium">
                  #{commissionSummary.vendedor?.id}
                </dd>
              </div>
            </dl>
          </div>

          {commissionSummary.dataInicial && commissionSummary.dataFinal && (
            <div>
              <h4 className="text-sm font-medium mb-2">Período</h4>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-muted-foreground">
                    Data Inicial
                  </dt>
                  <dd className="text-lg font-medium">
                    {format(
                      new Date(commissionSummary.dataInicial),
                      'dd/MM/yyyy',
                      {
                        locale: ptBR,
                      }
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Data Final</dt>
                  <dd className="text-lg font-medium">
                    {format(
                      new Date(commissionSummary.dataFinal),
                      'dd/MM/yyyy',
                      {
                        locale: ptBR,
                      }
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

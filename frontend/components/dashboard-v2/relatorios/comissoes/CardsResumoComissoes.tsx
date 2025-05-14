'use client';

import { Commission, CommissionSummary } from '@/types/reports';
import { CardResumoComissao } from './CardResumoComissao';
import { Trophy, CheckIcon, ClockIcon } from 'lucide-react';

interface CardsResumoComissoesProps {
  commissionSummary: CommissionSummary;
  formatCurrency: (value: number) => string;
}

export function CardsResumoComissoes({
  commissionSummary,
  formatCurrency,
}: CardsResumoComissoesProps) {
  // Calcular totais por status
  const comissoesPagas = commissionSummary.comissoes
    .filter((c) => c.status === 'pago')
    .reduce((total, c) => total + c.valor, 0);

  const comissoesPendentes = commissionSummary.comissoes
    .filter((c) => c.status === 'pendente')
    .reduce((total, c) => total + c.valor, 0);

  const totalComissoesPagas = commissionSummary.comissoes.filter(
    (c) => c.status === 'pago'
  ).length;

  const totalComissoesPendentes = commissionSummary.comissoes.filter(
    (c) => c.status === 'pendente'
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <CardResumoComissao
        title="Comissão Total"
        description={`Vendedor ${commissionSummary.vendedor?.name}`}
        value={formatCurrency(commissionSummary.comissao_total)}
        subtitle={`Total de ${commissionSummary.comissoes.length} vendas comissionadas`}
        icon={<Trophy className="h-6 w-6 text-amber-500" />}
        gradientFrom="amber-50"
        gradientTo="amber-100"
        borderColor="amber-200"
        titleColor="text-amber-900"
        descriptionColor="text-amber-700"
        valueColor="text-amber-900"
        subtitleColor="text-amber-800"
      />

      <CardResumoComissao
        title="Comissões Pagas"
        description="Status: Pago"
        value={formatCurrency(comissoesPagas)}
        subtitle={`${totalComissoesPagas} comissões pagas`}
        icon={<CheckIcon className="h-6 w-6 text-green-500" />}
        gradientFrom="green-50"
        gradientTo="green-100"
        borderColor="green-200"
        titleColor="text-green-900"
        descriptionColor="text-green-700"
        valueColor="text-green-900"
        subtitleColor="text-green-800"
      />

      <CardResumoComissao
        title="Comissões Pendentes"
        description="Status: Pendente"
        value={formatCurrency(comissoesPendentes)}
        subtitle={`${totalComissoesPendentes} comissões pendentes`}
        icon={<ClockIcon className="h-6 w-6 text-blue-500" />}
        gradientFrom="blue-50"
        gradientTo="blue-100"
        borderColor="blue-200"
        titleColor="text-blue-900"
        descriptionColor="text-blue-700"
        valueColor="text-blue-900"
        subtitleColor="text-blue-800"
      />
    </div>
  );
}

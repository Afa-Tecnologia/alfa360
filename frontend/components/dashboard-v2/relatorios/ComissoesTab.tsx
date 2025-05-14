'use client';

import { CommissionSummary } from '@/types/reports';
import { ComissaoSkeletonLoader } from './comissoes/ComissaoSkeletonLoader';
import { EmptyComissoesState } from './comissoes/EmptyComissoesState';
import { CardsResumoComissoes } from './comissoes/CardsResumoComissoes';
import { TabsConteudoComissoes } from './comissoes/TabsConteudoComissoes';

interface ComissoesTabProps {
  commissionSummary: CommissionSummary | null;
  loading: boolean;
  formatCurrency: (value: number) => string;
  selectedVendorId?: string;
}

export function ComissoesTab({
  commissionSummary,
  loading,
  formatCurrency,
  selectedVendorId = '',
}: ComissoesTabProps) {
  // Exibir o skeleton loader durante o carregamento
  if (loading) {
    return <ComissaoSkeletonLoader />;
  }

  // Verificar se há comissões e se o vendedor está selecionado
  if (!commissionSummary?.comissoes?.length) {
    // Verificar se é a seleção "todos os vendedores"
    const isAllVendors =
      selectedVendorId === 'todos' ||
      commissionSummary?.vendedor?.name === 'Todos os vendedores';
    return <EmptyComissoesState isAllVendors={isAllVendors} />;
  }

  return (
    <div className="space-y-6">
      {/* Cards de resumo */}
      <CardsResumoComissoes
        commissionSummary={commissionSummary}
        formatCurrency={formatCurrency}
      />

      {/* Tabs de conteúdo */}
      <TabsConteudoComissoes
        commissionSummary={commissionSummary}
        formatCurrency={formatCurrency}
      />
    </div>
  );
}

'use client';

import { CommissionSummary } from '@/types/reports';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraphDesempenhoVendas } from './GraphDesempenhoVendas';
import { GraphStatusComissoes } from './GraphStatusComissoes';
import { ListaProdutosMaisVendidos } from './ListaProdutosMaisVendidos';
import { ComissoesPorProduto } from './ComissoesPorProduto';
import { DetalhesComissoes } from './DetalhesComissoes';
import { useComissoesData } from './hooks/useComissoesData';

interface TabsConteudoComissoesProps {
  commissionSummary: CommissionSummary;
  formatCurrency: (value: number) => string;
}

export function TabsConteudoComissoes({
  commissionSummary,
  formatCurrency,
}: TabsConteudoComissoesProps) {
  const [activeTab, setActiveTab] = useState('resumo');
  const { produtosVendidos, statusPieData } =
    useComissoesData(commissionSummary);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="resumo">Resumo</TabsTrigger>
        <TabsTrigger value="produtos">Produtos</TabsTrigger>
        <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
      </TabsList>

      <TabsContent value="resumo" className="space-y-4">
        <GraphDesempenhoVendas
          produtosVendidos={produtosVendidos}
          formatCurrency={formatCurrency}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GraphStatusComissoes
            statusData={statusPieData}
            formatCurrency={formatCurrency}
          />

          <ListaProdutosMaisVendidos
            produtosVendidos={produtosVendidos}
            formatCurrency={formatCurrency}
          />
        </div>
      </TabsContent>

      <TabsContent value="produtos">
        <ComissoesPorProduto
          comissoes={commissionSummary.comissoes}
          formatCurrency={formatCurrency}
        />
      </TabsContent>

      <TabsContent value="detalhes">
        <DetalhesComissoes
          commissionSummary={commissionSummary}
          formatCurrency={formatCurrency}
        />
      </TabsContent>
    </Tabs>
  );
}

'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FilterBar } from '@/components/relatorios/FilterBar';
import { ComissoesTab } from '@/components/relatorios/ComissoesTab';
import { VendasTab } from '@/components/relatorios/VendasTab';
import { ProdutosTab } from '@/components/relatorios/ProdutosTab';
import { CategoriasTab } from '@/components/relatorios/CategoriasTab';
import { useReports } from '@/hooks/useReports';
import { DashboardConsolidado } from '../caixa/DashboardConsolidado';
import { HistoricoCaixaPanel } from '../caixa/HistoricoCaixaPanel';
export default function Relatorios() {
  const {
    activeTab,
    setActiveTab,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedVendorId,
    setSelectedVendorId,
    selectedCategoryId,
    setSelectedCategoryId,
    salesSummary,
    categorySales,
    topProducts,
    commissionSummary,
    loading,
    formatCurrency,
    period,
    setPeriod,
  } = useReports();

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <p className="text-gray-500">
          Acompanhe as métricas e desempenho da sua loja
        </p>
      </div>

      <FilterBar
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        selectedVendorId={selectedVendorId}
        setSelectedVendorId={setSelectedVendorId}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
      />

      <Tabs
        defaultValue="vendas"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto">
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="caixa">Caixa</TabsTrigger>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="comissoes">Comissões</TabsTrigger>
        </TabsList>

        {/* Tab de Vendas */}
        <TabsContent value="vendas" className="space-y-4">
          <VendasTab
            salesSummary={salesSummary}
            loading={loading.summary}
            formatCurrency={formatCurrency}
            period={period}
            setPeriod={setPeriod}
            startDate={startDate}
            endDate={endDate}
            selectedVendorId={selectedVendorId}
            selectedCategoryId={selectedCategoryId}
          />
        </TabsContent>

        {/* Tab de Caixa */}
        <TabsContent value="caixa" className="space-y-4">
          <DashboardConsolidado startDate={startDate} endDate={endDate} />
          <HistoricoCaixaPanel />
        </TabsContent>

        {/* Tab de Produtos */}
        <TabsContent value="produtos" className="space-y-4">
          <ProdutosTab
            topProducts={topProducts}
            loading={loading.products}
            formatCurrency={formatCurrency}
          />
        </TabsContent>

        {/* Tab de Categorias */}
        <TabsContent value="categorias" className="space-y-4">
          <CategoriasTab
            categorySales={categorySales}
            loading={loading.categories}
            formatCurrency={formatCurrency}
          />
        </TabsContent>

        {/* Tab de Comissões */}
        <TabsContent value="comissoes" className="space-y-4">
          <ComissoesTab
            commissionSummary={commissionSummary}
            loading={loading.commissions}
            formatCurrency={formatCurrency}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

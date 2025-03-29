'use client';

import { useState, useEffect, useRef } from 'react';
import { DashboardCaixa } from './DashboardCaixa';
import { useCaixaStore } from '@/stores/caixa-store';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HistoricoCaixas } from './HistoricoCaixas';
import { FluxogramaCaixa } from './FluxogramaCaixa';

/**
 * Componente principal para gerenciamento de caixa
 */
export function GerenciamentoCaixa() {
  const {
    statusCaixa,
    movimentacoes,
    isLoading,
    error,
    fetchStatus,
    fetchMovimentacoes,
  } = useCaixaStore();

  const [activeTab, setActiveTab] = useState('atual');
  const [refreshKey, setRefreshKey] = useState(0);

  // Usar useRef para armazenar o ID do caixa e evitar loops
  const caixaIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Primeiro busca o status do caixa
    const loadData = async () => {
      await fetchStatus();

      // Verificar se temos um caixa e se o ID mudou
      const caixaAtualId = statusCaixa?.caixa?.id || null;

      // Buscar movimentações apenas se o ID do caixa mudou ou se estamos atualizando
      if (caixaAtualId) {
        caixaIdRef.current = caixaAtualId;
        await fetchMovimentacoes(caixaAtualId);
      } else {
        // Se não temos um caixa aberto, buscar com lista vazia
        caixaIdRef.current = null;
        await fetchMovimentacoes();
      }
    };

    loadData();
  }, [fetchStatus, fetchMovimentacoes, refreshKey]); // Remover statusCaixa das dependências

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (isLoading && !statusCaixa) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-[250px]" />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar</AlertTitle>
        <AlertDescription className="flex justify-between items-center">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs
        defaultValue="atual"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="atual">Caixa Atual</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
            <TabsTrigger value="fluxograma">Como Funciona</TabsTrigger>
          </TabsList>

          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>

        <TabsContent value="atual" className="space-y-4">
          <DashboardCaixa
            statusCaixa={statusCaixa}
            movimentacoes={movimentacoes}
            onUpdate={handleRefresh}
          />
        </TabsContent>

        <TabsContent value="historico">
          <HistoricoCaixas
            onSelect={(caixaId: number) => {
              setActiveTab('atual');
            }}
          />
        </TabsContent>

        <TabsContent value="fluxograma">
          <FluxogramaCaixa />
        </TabsContent>
      </Tabs>
    </div>
  );
}

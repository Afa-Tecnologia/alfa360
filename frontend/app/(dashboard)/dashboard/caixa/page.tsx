'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCaixaStore } from '@/stores/caixa-store';
import { MovimentacaoCaixa } from '@/types/caixa';
import { CaixaDashboard } from '@/components/dashboard-v2/caixa/dashboard';
import { HistoricoCaixas } from '@/components/caixa/HistoricoCaixas';
import { FluxogramaCaixa } from '@/components/caixa/FluxogramaCaixa';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function CaixaPage() {
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

  useEffect(() => {
    const loadData = async () => {
      await fetchStatus();

      const caixaAtualId = statusCaixa?.caixa?.id || null;

      if (caixaAtualId) {
        await fetchMovimentacoes(caixaAtualId);
      } else {
        await fetchMovimentacoes();
      }
    };

    loadData();
  }, [fetchStatus, fetchMovimentacoes, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (isLoading && !statusCaixa) {
    return (
      <div className="space-y-6">
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold">Gerenciamento de Caixa</h1>

      <Tabs
        defaultValue="atual"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <TabsList className="bg-muted/60 w-full sm:w-auto">
            <TabsTrigger value="atual" className="flex-1 sm:flex-initial">
              Caixa Atual
            </TabsTrigger>
            <TabsTrigger value="historico" className="flex-1 sm:flex-initial">
              Histórico
            </TabsTrigger>
            <TabsTrigger value="fluxograma" className="flex-1 sm:flex-initial">
              Como Funciona
            </TabsTrigger>
          </TabsList>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="w-full sm:w-auto"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>

        <TabsContent value="atual" className="space-y-6">
          <CaixaDashboard
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
    </motion.div>
  );
}

'use client';

import { useState } from 'react';
import StatusCaixaBadge from '../caixa/StatusCaixaBadge';
import { IStatus } from '@/types/caixa';
import { GerenciamentoCaixa } from '../caixa/GerenciamentoCaixa';
import { FluxogramaCaixa } from '../caixa/FluxogramaCaixa';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const [status, setStatus] = useState<IStatus | null>(null);

  const getStatus = (value?: any) => {
    setStatus(value);
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Caixa da Loja</h1>
          <StatusCaixaBadge getStatus={getStatus} />
        </div>

        <Tabs defaultValue="gerenciamento" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="gerenciamento">Gerenciamento</TabsTrigger>
            <TabsTrigger value="fluxograma">Como Funciona</TabsTrigger>
          </TabsList>

          <TabsContent value="gerenciamento">
            <GerenciamentoCaixa />
          </TabsContent>

          <TabsContent value="fluxograma">
            <FluxogramaCaixa />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

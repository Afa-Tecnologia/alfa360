'use client';

import { GerenciamentoCaixa } from '@/components/caixa/GerenciamentoCaixa';
import { FluxogramaCaixa } from '@/components/caixa/FluxogramaCaixa';
import { useEffect } from 'react';

export default function CaixaPage() {
  useEffect(() => {
    console.log('[CaixaPage] Página de Caixa montada');

    return () => {
      console.log('[CaixaPage] Página de Caixa desmontada');
    };
  }, []);

  console.log('[CaixaPage] Renderizando GerenciamentoCaixa');
  return (
    <div className="space-y-4 p-4">
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Gerenciamento de Caixa
          </h1>
        </div>
        <p className="text-muted-foreground">
          Gerencie as operações financeiras diárias, controle a abertura e
          fechamento de caixa.
        </p>
      </div>
      
      <GerenciamentoCaixa />
    </div>
  );
}

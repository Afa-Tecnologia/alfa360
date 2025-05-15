'use client';

import { HistoricoCaixaPanel } from '@/components/caixa/HistoricoCaixaPanel';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HistoricoCaixaPage() {
  const router = useRouter();

  const handleVoltar = () => {
    router.push('/caixa');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={handleVoltar}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Histórico de Caixas</h1>
      </div>

      <HistoricoCaixaPanel />
    </div>
  );
}

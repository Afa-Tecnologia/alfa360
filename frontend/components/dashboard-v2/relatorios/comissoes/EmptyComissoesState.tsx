'use client';

import { UserIcon, InfoIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface EmptyComissoesStateProps {
  isAllVendors?: boolean;
}

export function EmptyComissoesState({
  isAllVendors = false,
}: EmptyComissoesStateProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comissões</CardTitle>
        <CardDescription>
          Acompanhe o desempenho e comissões dos vendedores
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
        {isAllVendors ? (
          <>
            <InfoIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nenhuma comissão encontrada
            </h3>
            <p className="text-center text-muted-foreground max-w-md">
              Não há dados de comissões para o período selecionado. Tente
              escolher outro período ou verifique se há vendas com comissões
              registradas.
            </p>
          </>
        ) : (
          <>
            <UserIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Selecione um Vendedor</h3>
            <p className="text-center text-muted-foreground max-w-md">
              Selecione um vendedor no filtro acima para visualizar as
              informações detalhadas de comissões e desempenho de vendas.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

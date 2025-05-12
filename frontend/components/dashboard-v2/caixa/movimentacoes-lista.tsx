'use client';

import { MovimentacaoCaixa } from '@/types/caixa';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  CreditCard,
  User,
  TrendingUp,
} from 'lucide-react';

// Mapeamento de métodos de pagamento para exibição mais amigável
const paymentMethodLabels: Record<string, string> = {
  MONEY: 'Dinheiro',
  CREDIT_CARD: 'Cartão de Crédito',
  DEBIT_CARD: 'Cartão de Débito',
  pix: 'PIX',
  CONDITIONAL: 'Condicional',
};

// Mapear métodos de pagamento para ícones
const paymentMethodIcons: Record<string, React.ReactNode> = {
  MONEY: <Wallet className="h-4 w-4" />,
  CREDIT_CARD: <CreditCard className="h-4 w-4" />,
  DEBIT_CARD: <CreditCard className="h-4 w-4" />,
  pix: <TrendingUp className="h-4 w-4" />,
  CONDITIONAL: <User className="h-4 w-4" />,
};

interface MovimentacoesListaProps {
  movimentacoes: MovimentacaoCaixa[];
}

export function MovimentacoesLista({ movimentacoes }: MovimentacoesListaProps) {
  // Ordenar movimentações por data (mais recentes primeiro)
  const sortedMovimentacoes = [...movimentacoes].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Se não há movimentações, mostrar mensagem
  if (sortedMovimentacoes.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Nenhuma movimentação registrada
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border">
      <Table>
        <TableHeader className="bg-muted/50 sticky top-0">
          <TableRow>
            <TableHead className="w-[100px]">Tipo</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Método</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="text-right">Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMovimentacoes.map((movimentacao) => {
            const isEntrada = movimentacao.type === 'entrada';
            const paymentMethod = movimentacao.payment_method || 'MONEY';

            return (
              <TableRow key={movimentacao.id}>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      'flex items-center gap-1 w-fit',
                      isEntrada
                        ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400'
                    )}
                  >
                    {isEntrada ? (
                      <ArrowUpCircle className="h-3 w-3" />
                    ) : (
                      <ArrowDownCircle className="h-3 w-3" />
                    )}
                    {isEntrada ? 'Entrada' : 'Saída'}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium max-w-[200px] truncate">
                  {movimentacao.description}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {paymentMethodIcons[paymentMethod] || (
                      <CreditCard className="h-4 w-4" />
                    )}
                    <span>
                      {paymentMethodLabels[paymentMethod] || paymentMethod}
                    </span>
                  </div>
                </TableCell>
                <TableCell
                  className={cn(
                    'text-right font-medium',
                    isEntrada ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {formatCurrency(Number(movimentacao.value))}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatarData(movimentacao.created_at)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

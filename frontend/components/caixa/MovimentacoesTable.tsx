'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDownCircle, ArrowUpCircle, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MovimentacaoCaixa } from '@/types/caixa';
import { formatCurrency, formatDateTime } from '@/utils/format';

interface MovimentacoesTableProps {
  movimentacoes: MovimentacaoCaixa[];
  title?: string;
  emptyMessage?: string;
  maxHeight?: string;
}

export function MovimentacoesTable({
  movimentacoes,
  title = 'Movimentações do Caixa',
  emptyMessage = 'Nenhuma movimentação registrada.',
  maxHeight = '400px',
}: MovimentacoesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar movimentações
  const filteredMovimentacoes = movimentacoes.filter((mov) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      mov.description.toLowerCase().includes(searchLower) ||
      (mov.payment_method &&
        mov.payment_method.toLowerCase().includes(searchLower)) ||
      formatCurrency(Number(mov.value)).toLowerCase().includes(searchLower) ||
      formatDateTime(mov.created_at || '')
        .toLowerCase()
        .includes(searchLower)
    );
  });

  // Ordenar movimentações (mais recentes primeiro)
  const sortedMovimentacoes = [...filteredMovimentacoes].sort((a, b) => {
    const dateA = new Date(a.created_at || '').getTime();
    const dateB = new Date(b.created_at || '').getTime();
    return dateB - dateA;
  });

  // Traduzir tipo de movimentação
  const getTipoMovimentacao = (tipo: string) => {
    return tipo === 'entrada' ? (
      <Badge className="bg-green-100 text-green-800 border-green-300">
        <ArrowUpCircle className="h-3 w-3 mr-1" />
        Entrada
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 border-red-300">
        <ArrowDownCircle className="h-3 w-3 mr-1" />
        Saída
      </Badge>
    );
  };

  // Traduzir método de pagamento
  const traduzirMetodoPagamento = (metodo: string | undefined): string => {
    if (!metodo) return 'Não informado';

    const traducoes: Record<string, string> = {
      MONEY: 'Dinheiro',
      CREDIT_CARD: 'Cartão de Crédito',
      DEBIT_CARD: 'Cartão de Débito',
      pix: 'PIX',
      CONDITIONAL: 'Condicional',
    };

    return traducoes[metodo] || metodo;
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Visualize todas as entradas e saídas do caixa
        </CardDescription>
        <div className="mt-2 relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar movimentações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <ScrollArea style={{ maxHeight }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Forma Pagto.</TableHead>
                <TableHead>Data/Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMovimentacoes.length > 0 ? (
                sortedMovimentacoes.map((mov) => (
                  <TableRow key={mov.id}>
                    <TableCell>{getTipoMovimentacao(mov.type)}</TableCell>
                    <TableCell
                      className={
                        mov.type === 'entrada'
                          ? 'text-green-600 font-medium'
                          : 'text-red-600 font-medium'
                      }
                    >
                      {formatCurrency(Number(mov.value))}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {mov.description}
                    </TableCell>
                    <TableCell>
                      {traduzirMetodoPagamento(mov.payment_method || '')}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(mov.created_at || '')}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center h-32 text-muted-foreground"
                  >
                    {searchTerm ? 'Nenhum resultado encontrado.' : emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

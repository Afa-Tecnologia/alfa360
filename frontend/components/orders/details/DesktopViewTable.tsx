import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { AlertDialogDevolution } from './AlertDevolution';
import { OrderDetail } from '@/types/order';
import { useState } from 'react';

interface OrderItemsProps {
  order: OrderDetail;
}
export function DesktopViewTable({ order }: OrderItemsProps) {
  const [openDevolution, setOpenDevolution] = useState(false);
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(order.produtos.length / itemsPerPage);

  const paginatedReturns = order.produtos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Calcular total
  const subtotal = order.produtos.reduce(
    (sum, produto) =>
      sum + produto.pivot.quantidade * produto.pivot.preco_unitario,
    0
  );
  const desconto = order.desconto ?? 0;
  const total = order.total - desconto;
  return (
    <>
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">ID</TableHead>
              <TableHead className="text-left">Produto</TableHead>
              <TableHead className="text-right">Qtd</TableHead>
              <TableHead className="text-right">Valor Unit.</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
              <TableHead className="text-left">Vendedor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedReturns.map((produto) => (
              <TableRow key={produto.id}>
                <TableCell className="font-medium">{produto.id}</TableCell>
                <TableCell className="font-medium">{produto.name}</TableCell>
                <TableCell className="text-right">
                  {produto.pivot.quantidade}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(produto.pivot.preco_unitario)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(
                    produto.pivot.quantidade * produto.pivot.preco_unitario
                  )}
                </TableCell>
                <TableCell>
                  {produto.pivot.vendedor_id
                    ? `Vendedor #${produto.pivot.vendedor_id}`
                    : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setOpenDevolution(true)} className='cursor-pointer border-none'>
                        Devolução
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

            {/* Total */}
            <TableRow>
              <TableCell colSpan={3} className="text-right font-medium">
                Total
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(subtotal)}
              </TableCell>
              <TableCell />
            </TableRow>

            {/* Desconto (se houver) */}
            {desconto > 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Desconto
                </TableCell>
                <TableCell className="text-right font-medium text-red-600">
                  -{formatCurrency(desconto/100 * subtotal)}
                </TableCell>
                <TableCell />
              </TableRow>
            )}

            {/* Total a pagar */}
            <TableRow>
              <TableCell colSpan={3} className="text-start font-bold">
                Total a Pagar
              </TableCell>
              <TableCell className="text-right font-bold">
                {formatCurrency(total)}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>

        <div className="flex items-center justify-between mt-4">
          <span className="text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Próximo
            </Button>
          </div>
        </div>
      </div>
      <AlertDialogDevolution
        open={openDevolution}
        onOpenChange={setOpenDevolution}
        order={order}
      />
    </>
  );
}

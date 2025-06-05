'use client';

import { useState, useRef } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Printer,
  Download,
  X,
  ShoppingBag,
  Check,
  Receipt,
  Clock,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { useReactToPrint } from 'react-to-print';

// Environment variables with fallbacks
const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || 'Alfa Manager';
const STORE_CNPJ = process.env.NEXT_PUBLIC_STORE_CNPJ || '00.000.000/0000-00';
const STORE_ADDRESS =
  process.env.NEXT_PUBLIC_STORE_ADDRESS || 'Endereço da Loja, 123';
const STORE_PHONE = process.env.NEXT_PUBLIC_STORE_PHONE || '(00) 0000-0000';

interface SaleItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  vendedor?: string;
}

interface SaleReceipt {
  id?: string | number;
  items: SaleItem[];
  total: number;
  desconto: number;
  customerName?: string;
  paymentMethod: string;
  status: string;
  isPaid: boolean;
  isPartial?: boolean;
  isCredit?: boolean;
  totalPaid?: number;
  remainingBalance?: number;
  createdAt: Date;
}

interface SalesReceiptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: SaleReceipt;
}

export function SalesReceipt({ open, onOpenChange, sale }: SalesReceiptProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Handle print
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    onBeforePrint: () => {
      setIsPrinting(true);
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Comprovante de Venda
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 bg-background rounded-md border" ref={printRef}>
          {/* Cabeçalho da loja */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold">{STORE_NAME}</h2>
            <p className="text-sm font-bold dark:text-gray-300">CNPJ: {STORE_CNPJ}</p>
            <p className="text-sm font-bold dark:text-gray-300">{STORE_ADDRESS}</p>
            <p className="text-sm font-bold dark:text-gray-300">{STORE_PHONE}</p>
          </div>

          <Separator className="my-4" />

          {/* Informações da venda */}
          <div className="mb-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Data:</span>
              <span className="text-sm">
                {format(sale.createdAt, "dd/MM/yyyy 'às' HH:mm", {
                  locale: ptBR,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Pedido:</span>
              <span className="text-sm">#{sale.id || 'Nova venda'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Cliente:</span>
              <span className="text-sm">
                {sale.customerName || 'Cliente não identificado'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Pagamento:</span>
              <span className="text-sm">{sale.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Status:</span>
              <span
                className={`text-sm font-bold ${
                  sale.isPaid
                    ? 'text-green-600'
                    : sale.isPartial
                      ? 'text-blue-600'
                      : sale.isCredit
                        ? 'text-amber-600'
                        : 'text-amber-600'
                }`}
              >
                {sale.isPaid ? (
                  <span className="flex items-center gap-1">
                    <Check className="h-3 w-3" /> Pago
                  </span>
                ) : sale.isPartial ? (
                  <span className="flex items-center gap-1">
                    <Check className="h-3 w-3" /> Entrada Parcial
                  </span>
                ) : sale.isCredit ? (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> A Prazo
                  </span>
                ) : (
                  sale.status
                )}
              </span>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Itens da venda */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">Itens</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1">Item</th>
                  <th className="text-center py-1">Qtd</th>
                  <th className="text-right py-1">Valor</th>
                  <th className="text-right py-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-1">
                      <div>
                        <p>{item.productName}</p>
                        {item.vendedor && (
                          <p className="text-xs font-bold dark:text-gray-300">
                            Vendedor: {item.vendedor}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="text-center py-1">{item.quantity}</td>
                    <td className="text-right py-1">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="text-right py-1">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totais */}
          <div className="space-y-1 mb-4">
            <div className="flex justify-between">
              <span className="text-sm">Subtotal:</span>
              <span className="text-sm">
                {formatCurrency(sale.total + sale.desconto)}
              </span>
            </div>
            {sale.desconto > 0 && (
              <div className="flex justify-between text-red-600">
                <span className="text-sm">Desconto:</span>
                <span className="text-sm">
                  -{formatCurrency(sale.desconto)}
                </span>
              </div>
            )}
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>{formatCurrency(sale.total)}</span>
            </div>

            {/* Informações de pagamento parcial */}
            {sale.isPartial &&
              sale.totalPaid !== undefined &&
              sale.remainingBalance !== undefined && (
                <>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Valor pago:</span>
                    <span className="text-sm text-green-600">
                      {formatCurrency(sale.totalPaid)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Valor restante:</span>
                    <span className="text-sm text-amber-600">
                      {formatCurrency(sale.remainingBalance)}
                    </span>
                  </div>
                </>
              )}

            {/* Informações de venda fiado */}
            {sale.isCredit && (
              <>
                <Separator className="my-2" />
                <div className="bg-amber-50 p-2 rounded-md border border-amber-200 text-center">
                  <span className="text-sm text-amber-700 font-medium">
                    Venda a prazo - Pagamento pendente
                  </span>
                </div>
              </>
            )}
          </div>

          <Separator className="my-4" />

          {/* Rodapé */}
          <div className="text-center font-bold text-xs dark:text-gray-300">
            <p>Obrigado pela preferência!</p>
            <p>Este documento não possui valor fiscal</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handlePrint} disabled={isPrinting}>
            <Printer className="h-4 w-4 mr-2" />
            {isPrinting ? 'Imprimindo...' : 'Imprimir'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

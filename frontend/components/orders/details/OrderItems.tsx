"use client"

import { OrderDetail } from '@/types/order';
import { formatCurrency } from '@/utils/formatters';
import { DevoltionsTable } from './TableDevolutions';
import { DesktopViewTable } from './DesktopViewTable';
import { AlertDialogDevolution } from './AlertDevolution';
import { useState } from 'react';

interface OrderItemsProps {
  order: OrderDetail;
}

/**
 * Component to display order items
 */
export function OrderItems({ order }: OrderItemsProps) {

    const [openDevolution, setOpenDevolution] = useState(false)
  if (!order.produtos || order.produtos.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        Nenhum item encontrado neste pedido.
      </div>
    );
  }


  
  // Calcular total
  const subtotal = order.produtos.reduce(
    (sum, produto) =>
      sum + produto.pivot.quantidade * produto.pivot.preco_unitario,
    0
  );
  const desconto = order.desconto ?? 0;
  const total = order.total - desconto;

  // Versão para dispositivos móveis (card view)
  const MobileView = () => (
    <div className="space-y-4 sm:hidden">
      {order.produtos.map((produto) => (
        <div key={produto.id} className="rounded-lg border p-3 space-y-2">
          <div className="font-medium">{produto.name}</div>
          <div className="grid grid-cols-2 text-sm">
            <span className="text-muted-foreground">Quantidade:</span>
            <span className="text-right">{produto.pivot.quantidade}</span>
          </div>
          <div className="grid grid-cols-2 text-sm">
            <span className="text-muted-foreground">Valor Unitário:</span>
            <span className="text-right">
              {formatCurrency(produto.pivot.preco_unitario)}
            </span>
          </div>
          <div className="grid grid-cols-2 text-sm font-medium">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="text-right">
              {formatCurrency(
                produto.pivot.quantidade * produto.pivot.preco_unitario
              )}
            </span>
          </div>
          {produto.pivot.vendedor_id && (
            <div className="grid grid-cols-2 text-sm">
              <span className="text-muted-foreground">Vendedor:</span>
              <span className="text-right">#{produto.pivot.vendedor_id}</span>
            </div>
          )}
        </div>
      ))}

      {/* Resumo do pedido */}
      <div className="mt-4 border-t pt-4 space-y-2">
        <div className="grid grid-cols-2 text-sm font-medium">
          <span>Subtotal:</span>
          <span className="text-right">{formatCurrency(subtotal)}</span>
        </div>
        {desconto > 0 && (
          <div className="grid grid-cols-2 text-sm font-medium">
            <span>Desconto:</span>
            <span className="text-right text-red-600">
              -{formatCurrency(desconto)}
            </span>
          </div>
        )}
        <div className="grid grid-cols-2 text-sm font-bold">
          <span>Total a Pagar:</span>
          <span className="text-right">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );

 

  return (
    <div className='flex gap-12 flex-col '>
      <MobileView />
      <DesktopViewTable order={order}  />
    
      <div className='pt-5'>
        <h2 className="text-1xl font-bold mb-4">Devoluções</h2>
      <DevoltionsTable/>
      </div>
    </div>
  );
}

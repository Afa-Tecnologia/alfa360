import { OrderDetail } from '@/types/order';
import { formatCurrency } from '@/utils/formatters';

interface OrderItemsProps {
  order: OrderDetail;
}

/**
 * Component to display order items
 */
export function OrderItems({ order }: OrderItemsProps) {
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

  // Versão para desktop (tabela)
  const DesktopView = () => (
    <div className="overflow-x-auto rounded-md border hidden sm:block">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Produto
            </th>
            <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Qtd
            </th>
            <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Valor Unit.
            </th>
            <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Subtotal
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Vendedor
            </th>
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-gray-200">
          {order.produtos.map((produto) => (
            <tr key={produto.id} className="hover:bg-muted/50">
              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                {produto.name}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                {produto.pivot.quantidade}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                {formatCurrency(produto.pivot.preco_unitario)}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-right">
                {formatCurrency(
                  produto.pivot.quantidade * produto.pivot.preco_unitario
                )}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm">
                {produto.pivot.vendedor_id
                  ? `Vendedor #${produto.pivot.vendedor_id}`
                  : 'N/A'}
              </td>
            </tr>
          ))}
          <tr className="bg-muted/50">
            <td
              colSpan={3}
              className="px-3 py-2 text-right text-sm font-medium"
            >
              Total
            </td>
            <td className="px-3 py-2 text-right text-sm font-medium">
              {formatCurrency(subtotal)}
            </td>
            <td></td>
          </tr>
          {desconto > 0 && (
            <tr className="bg-muted/50">
              <td
                colSpan={3}
                className="px-3 py-2 text-right text-sm font-medium"
              >
                Desconto
              </td>
              <td className="px-3 py-2 text-right text-sm font-medium text-red-600">
                -{formatCurrency(desconto)}
              </td>
              <td></td>
            </tr>
          )}
          <tr className="bg-muted/50">
            <td colSpan={3} className="px-3 py-2 text-right text-sm font-bold">
              Total a Pagar
            </td>
            <td className="px-3 py-2 text-right text-sm font-bold">
              {formatCurrency(total)}
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <MobileView />
      <DesktopView />
    </>
  );
}

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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Produto
            </th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Qtd
            </th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor Unit.
            </th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Subtotal
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vendedor
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {order.produtos.map((produto) => (
            <tr key={produto.id}>
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
          <tr className="bg-gray-50">
            <td
              colSpan={3}
              className="px-3 py-2 text-right text-sm font-medium"
            >
              Total
            </td>
            <td className="px-3 py-2 text-right text-sm font-medium">
              {formatCurrency(order.total)}
            </td>
            <td></td>
          </tr>
          {(order.desconto ?? 0) > 0 && (
            <tr className="bg-gray-50">
              <td
                colSpan={3}
                className="px-3 py-2 text-right text-sm font-medium"
              >
                Desconto
              </td>
              <td className="px-3 py-2 text-right text-sm font-medium text-red-600">
                -{formatCurrency(order.desconto ?? 0)}
              </td>
              <td></td>
            </tr>
          )}
          <tr className="bg-gray-50">
            <td colSpan={3} className="px-3 py-2 text-right text-sm font-bold">
              Total a Pagar
            </td>
            <td className="px-3 py-2 text-right text-sm font-bold">
              {formatCurrency(order.total - (order.desconto ?? 0))}
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

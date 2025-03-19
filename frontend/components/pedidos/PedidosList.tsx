'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCaixaStore } from '@/stores/caixaStore';

interface PedidosListProps {
  onRegistrarPedido: (caixaId: number, pedidoId: number) => Promise<void>;
}

export function PedidosList({ onRegistrarPedido }: PedidosListProps) {
  const { status, pedidosPendentes } = useCaixaStore();

  const handleRegistrarPedido = async (pedidoId: number) => {
    if (status.id) {
      try {
        await onRegistrarPedido(status.id, pedidoId);
      } catch (error) {
        console.error('Erro ao registrar pedido:', error);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos Pendentes</CardTitle>
      </CardHeader>
      <CardContent>
        {pedidosPendentes.length === 0 ? (
          <p>Não há pedidos pendentes.</p>
        ) : (
          <ul className="space-y-2">
            {pedidosPendentes.map((pedido:any) => (
              <li key={pedido.id} className="flex justify-between items-center">
                <span>
                  Pedido #{pedido.id} - R$ {pedido.total.toFixed(2)}
                </span>
                <Button onClick={() => handleRegistrarPedido(pedido.id)}>
                  Registrar no Caixa
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

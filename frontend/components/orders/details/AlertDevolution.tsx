'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { criarDevolucao } from '@/lib/CreateDevoution';
// ajuste o path conforme onde você salvou a função
type AlertDialogDevolutionProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
};
export function AlertDialogDevolution({
  open,
  onOpenChange,
  order,
}: AlertDialogDevolutionProps) {
  const [loading, setLoading] = useState(false);
  const devolucao = order.produtos.map((produto: any) => ({
    produto_id: produto.id,
    variante_id: produto.variante_id,
    quantidade: produto.pivot.quantidade,
    valor_unitario: produto.pivot.preco_unitario,
  }));
console.log("order: ", order);
  const handleDevolucao = async () => {
    setLoading(true);
    try {
  const item = devolucao[0]; // apenas o primeiro item
    const response = await criarDevolucao({
      pedido_id: order.id,
      cliente_id: order.cliente_id,
      motivo: 'arrependimento',
      tipo: 'parcial',
      observacoes: 'Produto com defeito',
      itens: [
        {
          produto_id: item.produto_id,
          variante_id: 1, // use o que vem do produto
          quantidade: item.quantidade,
          valor_unitario: 150.0,
        },
      ],
    });

    console.log('Devolução criada com sucesso:', response);
  } catch (error) {
    console.error('Erro ao criar devolução:', error);
  } finally {
    setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar devolução?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação irá registrar a devolução. Deseja continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDevolucao} disabled={loading}>
            {loading ? 'Processando...' : 'Confirmar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

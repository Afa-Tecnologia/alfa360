'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CartItem, useCartStore } from '@/stores/cart-store';
import { createPedido } from '@/services/pedidos/CreatePedidos';
import { gerarNotificacao } from '@/utils/toast';
import { Sale, useSaleStore } from '@/stores/sale-store';

import useAuthStore from '@/stores/authStore';
import { SearchClients } from './SearchClients';
import { Label } from '@/components/ui/label';
import { SalesNotes } from './SalesNotes';
import { set } from 'date-fns';
import OrdersSales from '@/services/pedidos/SalesOrders';

export type SaleItems = {
  desconto: number;
  total: number;
  produtos: CartItem[];
};

interface FinalizeSaleModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  reqPedidos: SaleItems;
}

const paymentMethods = {
  MONEY: 'Espécie',
  CREDIT_CARD: 'Cartão de Crédito',
  DEBIT_CARD: 'Cartão de Débito',
  pix: 'PIX',
  CONDITIONAL: 'Condicional',
} as const;

export default function FinalizeSaleModal({
  open,
  onOpenChange,
  reqPedidos,
}: FinalizeSaleModalProps) {
  const [paymentMethod, setPaymentMethod] =
    useState<keyof typeof paymentMethods>('MONEY');
  const [loading, setLoading] = useState(false);
  const user = useAuthStore.getState().user;
  const { clearCart,  setDiscount } = useCartStore();
  const [cliente, setCliente] = useState<{ id: number; name: string } | null>(
    null
  );
  const [openNotesModal, setOpenNotesModal] = useState(false);
  const [saleNotesData, setSaleNotesData] = useState<any | null>(null);
  
  const handleSubmitSale = async () => {
    setLoading(true);
    try {

      const pedido = {
        vendedor_id: user?.id,
        cliente_id: cliente?.id,
        type: 'loja',
        payment_method: paymentMethod,
        desconto: reqPedidos.desconto,
        produtos: reqPedidos.produtos.map((item) => ({
          variante_id: item.product.selectedColorId, // Agora acessa corretamente
          produto_id: item.product.id,
          quantidade: item.quantity,
        })),
      };
    //  console.log('MangaPedido: ', pedido);
    await OrdersSales.createPedido(pedido);
      gerarNotificacao('Venda finalizada com sucesso!', 'sucesso');
      onOpenChange(false); // Close the modal after success
      clearCart();
      setDiscount(0);
      // Preparar os dados para o modal de notas
      setSaleNotesData({
        sale: {
          items: reqPedidos.produtos.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            unitPrice: item.product.sellingPrice,
            total: item.quantity * item.product.sellingPrice,
          })),
          total: reqPedidos.total,
          desconto: reqPedidos.desconto,
          customerName: cliente?.name || 'Cliente Desconhecido',
          paymentMethod: paymentMethod,
          createdAt: new Date(),
        },
      });
      setCliente(null)
reqPedidos.desconto = 0
      // Abrir o modal de notas da venda
      setOpenNotesModal(true);
    } catch (error) {
      gerarNotificacao('Erro ao finalizar venda.', 'error');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar Venda</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer" className="text-right">
                Cliente
              </Label>
              <SearchClients
                onSelectCliente={(id:number, name:string) => setCliente({ id, name })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment" className="text-right">
                Pagamento
              </Label>
              <Select
                value={paymentMethod}
                onValueChange={(value) =>
                  setPaymentMethod(value as keyof typeof paymentMethods)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Forma de Pagamento" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(paymentMethods).map(([key, label]) => (
                    <SelectItem key={key} value={key.toUpperCase()}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4 text-right text-lg font-bold">
                Total:{' '}
                {reqPedidos.total.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button className='bg-red-800 hover:bg-red-900'>Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSubmitSale} disabled={loading || !cliente} className="bg-lime-700 hover:bg-lime-800">
              {loading ? 'Finalizando...' : 'Confirmar Venda'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Notas da Venda */}
      {saleNotesData && (
        <SalesNotes
          openDialog={openNotesModal}
          onOpenChangeDialog={setOpenNotesModal}
          notesSales={saleNotesData}
        />
      )}
    </>
  );
}

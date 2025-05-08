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
import { paymentMethodService } from '@/lib/services/PaymentMethodService';
import { PaymentMethod } from '@/stores/paymentMethodStore';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  CheckIcon,
  BanknoteIcon,
  CreditCardIcon,
  SmartphoneIcon,
  CircleDollarSignIcon,
} from 'lucide-react';
import { createPaymentService } from '@/services/pagamentos/CreatePaymentService';

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

type PaymentSplit = {
  method: keyof typeof paymentMethods;
  amount: number;
};

export default function FinalizeSaleModal({
  open,
  onOpenChange,
  reqPedidos,
}: FinalizeSaleModalProps) {
  const [paymentSplits, setPaymentSplits] = useState<PaymentSplit[]>([
    { method: 'MONEY', amount: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const user = useAuthStore.getState().user;
  const { clearCart, setDiscount } = useCartStore();
  const [cliente, setCliente] = useState<{ id: number; name: string } | null>(
    null
  );
  const [openNotesModal, setOpenNotesModal] = useState(false);
  const [saleNotesData, setSaleNotesData] = useState<any | null>(null);
  const [remainingAmount, setRemainingAmount] = useState(reqPedidos.total);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isPaid, setIsPaid] = useState(true);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    const getPaymentMethods = async () => {
      setPaymentMethods(await paymentMethodService.getPaymentMethods());
    };
    getPaymentMethods();
  }, []);

  useEffect(() => {
    if (open) {
      // Reset state when opening modal
      setRemainingAmount(reqPedidos.total);
      setPaymentSplits([{ method: 'MONEY', amount: 0 }]);
      setIsPaid(true);
      setPaymentError('');
    }
  }, [open, reqPedidos.total]);

  useEffect(() => {
    // Atualiza o valor restante baseado nas divisões de pagamento
    const totalPaid = paymentSplits.reduce(
      (sum, split) => sum + split.amount,
      0
    );
    setRemainingAmount(reqPedidos.total - totalPaid);

    // Validação para garantir que o valor não exceda o total
    if (totalPaid > reqPedidos.total) {
      setPaymentError('O valor total dos pagamentos excede o valor da venda');
    } else {
      setPaymentError('');
    }
  }, [paymentSplits, reqPedidos.total]);

  const handleAddPaymentSplit = () => {
    if (remainingAmount <= 0) return;
    setPaymentSplits([...paymentSplits, { method: 'MONEY', amount: 0 }]);
  };

  const handleRemovePaymentSplit = (index: number) => {
    const newSplits = paymentSplits.filter((_, i) => i !== index);
    setPaymentSplits(newSplits);
  };

  const handleUpdatePaymentSplit = (
    index: number,
    field: keyof PaymentSplit,
    value: any
  ) => {
    const newSplits = [...paymentSplits];

    // Se for atualizar o valor, validar para não ultrapassar o valor restante
    if (field === 'amount') {
      const currentTotal = paymentSplits.reduce(
        (sum, split, i) => (i !== index ? sum + split.amount : sum),
        0
      );

      const maxAllowed = reqPedidos.total - currentTotal;

      if (value > maxAllowed) {
        value = maxAllowed;
        gerarNotificacao('Valor ajustado para não exceder o total', 'info');
      }
    }

    newSplits[index] = { ...newSplits[index], [field]: value };
    setPaymentSplits(newSplits);
  };

  const fillRemainingAmount = (index: number) => {
    if (remainingAmount <= 0) return;

    const newSplits = [...paymentSplits];
    newSplits[index] = {
      ...newSplits[index],
      amount: newSplits[index].amount + remainingAmount,
    };
    setPaymentSplits(newSplits);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'MONEY':
        return <BanknoteIcon className="h-4 w-4 text-green-600" />;
      case 'CREDIT_CARD':
      case 'DEBIT_CARD':
        return <CreditCardIcon className="h-4 w-4 text-blue-600" />;
      case 'pix':
        return <SmartphoneIcon className="h-4 w-4 text-purple-600" />;
      default:
        return <CircleDollarSignIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleSubmitSale = async () => {
    setLoading(true);
    try {
      const totalPaid = paymentSplits.reduce(
        (sum, split) => sum + split.amount,
        0
      );

      // Determinar o status da venda baseado no pagamento
      let orderStatus = 'PENDING';

      if (isPaid) {
        // Se marcado como pago e o valor bate, então é confirmado
        if (Math.abs(totalPaid - reqPedidos.total) < 0.01) {
          orderStatus = 'PAYMENT_CONFIRMED';
        } else {
          gerarNotificacao(
            'Para marcar como pago, o valor total dos pagamentos deve ser igual ao valor da venda.',
            'error'
          );
          setLoading(false);
          return;
        }
      } else if (totalPaid > 0 && totalPaid < reqPedidos.total) {
        // Se tem pagamento parcial
        orderStatus = 'PARTIAL_PAYMENT';
      } else if (
        paymentSplits.some((split) => split.method === 'CONDITIONAL')
      ) {
        // Se algum pagamento é condicional
        orderStatus = 'CONDITIONAL';
      }

      const pedido = {
        vendedor_id: user?.id,
        cliente_id: cliente?.id,
        type: 'loja',
        status: orderStatus,
        payment_method:
          paymentSplits.length > 1
            ? 'SPLITED_PAYMENT'
            : paymentSplits[0]?.method || 'MONEY',
        payment_splits: paymentSplits,
        desconto: +reqPedidos.desconto,
        produtos: reqPedidos.produtos.map((item) => ({
          variante_id: item.product.selectedColorId,
          produto_id: item.product.id,
          quantidade: item.quantity,
          vendedor_id: item.product.vendedor_id || user?.id,
        })),
      };

      // Se a venda for paga, criar o pedido e o pagamento
      if (isPaid) {
        console.log('Criando pedido com pagamento');
        const response = await OrdersSales.createPedido(pedido).then(
          (response) => {
            gerarNotificacao('success', 'Pedido criado com sucesso!');
            return response;
          }
        );
        if (!response) {
          gerarNotificacao('error', 'Erro ao criar pedido');
          return false;
        }
        const pedidoId = response.pedido.id;
        const paymentData = {
          payment_method_code:
            paymentSplits.length > 1
              ? 'SPLITED_PAYMENT'
              : paymentSplits[0]?.method || 'MONEY',
          total: +reqPedidos.total,
        };
        await createPaymentService.createPayment(paymentData, pedidoId);
      } else {
        // Criar o pedido
        setIsPaid(false);
        await OrdersSales.createPedido(pedido);
      }
      gerarNotificacao(
        `Venda ${orderStatus === 'PAYMENT_CONFIRMED' ? 'paga e' : ''} finalizada com sucesso!`,
        'sucesso'
      );
      onOpenChange(false);
      clearCart();
      setDiscount(0);
      setSaleNotesData({
        sale: {
          items: reqPedidos.produtos.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            unitPrice: item.product.sellingPrice,
            total: item.quantity * item.product.sellingPrice,
            vendedor: item.product.vendedor_nome || 'Vendedor não especificado',
          })),
          total: +reqPedidos.total,
          desconto: reqPedidos.desconto,
          customerName: cliente?.name || 'Cliente Desconhecido',
          paymentMethod: paymentSplits.map((split) => split.method).join(', '),
          status: orderStatus,
          isPaid: orderStatus === 'PAYMENT_CONFIRMED',
          createdAt: new Date(),
        },
      });
      setCliente(null);
      reqPedidos.desconto = 0;
      setOpenNotesModal(true);
    } catch (error) {
      gerarNotificacao('Erro ao finalizar venda.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isPaymentValid = () => {
    if (isPaid) {
      // Se marcado como pago, o valor deve ser exatamente igual
      return Math.abs(remainingAmount) < 0.01;
    } else {
      // Se não marcado como pago, permite finalizar com valor pendente
      return remainingAmount >= 0;
    }
  };

  const getStatusLabel = () => {
    const totalPaid = paymentSplits.reduce(
      (sum, split) => sum + split.amount,
      0
    );

    if (isPaid && Math.abs(totalPaid - reqPedidos.total) < 0.01) {
      return 'PAYMENT_CONFIRMED';
    } else if (totalPaid > 0 && totalPaid < reqPedidos.total) {
      return 'PARTIAL_PAYMENT';
    } else if (paymentSplits.some((split) => split.method === 'CONDITIONAL')) {
      return 'CONDITIONAL';
    } else {
      return 'PENDING';
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Finalizar Venda</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer" className="text-right">
                Cliente
              </Label>
              <SearchClients
                onSelectCliente={(id: number, name: string) =>
                  setCliente({ id, name })
                }
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Formas de Pagamento</h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={isPaid ? 'default' : 'outline'}
                    className={`h-8 ${
                      getStatusLabel() === 'PAYMENT_CONFIRMED'
                        ? 'bg-green-600'
                        : getStatusLabel() === 'PARTIAL_PAYMENT'
                          ? 'bg-yellow-600'
                          : getStatusLabel() === 'CONDITIONAL'
                            ? 'bg-purple-600'
                            : 'bg-gray-600'
                    }`}
                  >
                    {getStatusLabel() === 'PAYMENT_CONFIRMED' ? (
                      <span className="flex items-center gap-1">
                        <CheckIcon className="h-3 w-3" /> Confirmado
                      </span>
                    ) : getStatusLabel() === 'PARTIAL_PAYMENT' ? (
                      'Pagamento Parcial'
                    ) : getStatusLabel() === 'CONDITIONAL' ? (
                      'Condicional'
                    ) : (
                      'Pendente'
                    )}
                  </Badge>
                  <Button
                    onClick={handleAddPaymentSplit}
                    disabled={remainingAmount <= 0}
                    type="button"
                    variant="outline"
                    size="sm"
                  >
                    Adicionar Pagamento
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPaid"
                  checked={isPaid}
                  onCheckedChange={(checked) => setIsPaid(checked as boolean)}
                />
                <label
                  htmlFor="isPaid"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Marcar venda como paga
                </label>
              </div>

              {paymentSplits.map((split, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 items-center"
                >
                  <div className="col-span-5">
                    <Select
                      value={split.method}
                      onValueChange={(value) =>
                        handleUpdatePaymentSplit(index, 'method', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Forma de Pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((item, idx) => (
                          <SelectItem key={idx} value={item.code}>
                            <div className="flex items-center gap-2">
                              {getPaymentMethodIcon(item.code)}
                              {item.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-5 relative">
                    <input
                      type="number"
                      value={split.amount}
                      onChange={(e) =>
                        handleUpdatePaymentSplit(
                          index,
                          'amount',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full p-2 border rounded"
                      placeholder="Valor"
                      step="0.01"
                      min="0"
                      max={reqPedidos.total}
                    />
                    {remainingAmount > 0 && (
                      <button
                        onClick={() => fillRemainingAmount(index)}
                        className="absolute right-2 top-2 text-xs text-blue-600 hover:text-blue-800"
                        type="button"
                      >
                        Preencher
                      </button>
                    )}
                  </div>
                  <div className="col-span-2 flex justify-end">
                    {index > 0 && (
                      <Button
                        onClick={() => handleRemovePaymentSplit(index)}
                        variant="destructive"
                        size="sm"
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {paymentError && (
                <div className="text-red-600 text-sm">{paymentError}</div>
              )}

              <div className="flex justify-between text-lg font-bold">
                <span>Valor Restante:</span>
                <span
                  className={
                    remainingAmount < 0
                      ? 'text-red-600'
                      : remainingAmount > 0
                        ? 'text-orange-600'
                        : 'text-green-600'
                  }
                >
                  {remainingAmount.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>

              <div className="text-right text-lg font-bold">
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
              <Button className="bg-red-800 hover:bg-red-900">Cancelar</Button>
            </DialogClose>
            <Button
              onClick={handleSubmitSale}
              disabled={
                loading || !cliente || !isPaymentValid() || !!paymentError
              }
              className="bg-lime-700 hover:bg-lime-800"
            >
              {loading
                ? 'Finalizando...'
                : getStatusLabel() === 'PAYMENT_CONFIRMED'
                  ? 'Confirmar Venda (Pago)'
                  : 'Confirmar Venda (Pendente)'}
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

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { OrderDetail, OrderPayment, OrderStatus } from '@/types/order';
import { ordersService } from '@/services/pedidos/OrdersService';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Clock,
  CheckCircle2,
  BanknoteIcon,
  ShoppingCart,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { PaymentMethod } from '@/stores/paymentMethodStore';
import { paymentMethodService } from '@/lib/services/PaymentMethodService';
import { gerarNotificacao } from '@/utils/toast';

interface OrderDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: number;
  onStatusUpdate?: (status: string) => void;
}

export function OrderDetailModal({
  open,
  onOpenChange,
  orderId,
  onStatusUpdate,
}: OrderDetailModalProps) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    number | null
  >(null);
  const [paymentAmount, setPaymentAmount] = useState<number | string>('');
  const [processingPayment, setProcessingPayment] = useState(false);

  // Formatação de valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Buscar detalhes do pedido
  const fetchOrderDetails = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      const data = await ordersService.getOrderDetails(orderId);
      setOrder(data);

      // Se for a primeira vez que o pedido é carregado, definir o valor padrão para o campo de pagamento
      if (data && paymentAmount === '') {
        const totalPaid =
          data.payments?.reduce(
            (sum, payment) =>
              sum + (payment.status === 'CAPTURED' ? payment.amount : 0),
            0
          ) || 0;

        const remaining = Math.max(
          0,
          (data.total || 0) - (data.discount || 0) - totalPaid
        );
        setPaymentAmount(remaining);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar métodos de pagamento
  const fetchPaymentMethods = async () => {
    try {
      const methods = await paymentMethodService.getPaymentMethods();
      setPaymentMethods(methods);
      if (methods.length > 0) {
        setSelectedPaymentMethod(methods[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar métodos de pagamento:', error);
    }
  };

  // Carregar dados quando o modal for aberto
  useEffect(() => {
    if (open && orderId) {
      fetchOrderDetails();
      fetchPaymentMethods();
    }
  }, [open, orderId]);

  // Calcular valor pago e valor restante
  const calculatePaymentStatus = () => {
    if (!order) return { total: 0, paid: 0, remaining: 0, isFullyPaid: false };

    const total = order.total || 0;
    const discount = order.discount || 0;
    const totalAfterDiscount = total - discount;

    const paid =
      order.payments?.reduce(
        (sum, payment) =>
          sum + (payment.status === 'CAPTURED' ? payment.amount : 0),
        0
      ) || 0;

    const remaining = Math.max(0, totalAfterDiscount - paid);
    const isFullyPaid = remaining === 0;

    return {
      total,
      discount,
      totalAfterDiscount,
      paid,
      remaining,
      isFullyPaid,
    };
  };

  // Determinar o próximo status do pedido após o pagamento
  const determineNextStatus = (
    fullPayment: boolean,
    currentStatus: string
  ): OrderStatus => {
    if (fullPayment) return 'PAYMENT_CONFIRMED';

    if (currentStatus === 'PENDING' || currentStatus === 'CONDITIONAL') {
      return 'PARTIAL_PAYMENT';
    }

    return currentStatus as OrderStatus;
  };

  // Registrar um novo pagamento
  const handleRegisterPayment = async () => {
    if (!order || !selectedPaymentMethod || !paymentAmount) {
      gerarNotificacao('Preencha todos os campos de pagamento', 'error');
      return;
    }

    try {
      setProcessingPayment(true);

      const amount =
        typeof paymentAmount === 'string'
          ? parseFloat(paymentAmount.replace(',', '.'))
          : paymentAmount;

      const { remaining } = calculatePaymentStatus();
      const isFullPayment = amount >= remaining;

      if (amount <= 0) {
        gerarNotificacao(
          'O valor do pagamento deve ser maior que zero',
          'error'
        );
        return;
      }

      if (amount > remaining) {
        gerarNotificacao(
          `O valor máximo para pagamento é ${formatCurrency(remaining)}`,
          'error'
        );
        return;
      }

      const nextStatus = determineNextStatus(isFullPayment, order.status);

      // Para pagamentos completos
      if (isFullPayment) {
        await ordersService.confirmFullPayment(
          order.id,
          selectedPaymentMethod,
          amount
        );
      }
      // Para pagamentos parciais
      else {
        await ordersService.recordPartialPayment(
          order.id,
          selectedPaymentMethod,
          amount
        );
      }

      // Atualizar a interface
      if (onStatusUpdate) {
        onStatusUpdate(nextStatus);
      }

      // Recarregar detalhes do pedido
      fetchOrderDetails();

      // Resetar formulário
      setPaymentAmount('');

      gerarNotificacao('Pagamento registrado com sucesso', 'sucesso');
      setActiveTab('details'); // Voltar para a aba de detalhes
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      gerarNotificacao('Erro ao registrar pagamento', 'error');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Gerar detalhes de status com ícone
  const getStatusDetails = (status: string) => {
    const statusConfig = {
      PENDING: {
        label: 'Pendente',
        icon: <Clock className="h-5 w-5 text-orange-500" />,
        description: 'Aguardando pagamento',
      },
      PAYMENT_CONFIRMED: {
        label: 'Pagamento Confirmado',
        icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
        description: 'Pagamento recebido integralmente',
      },
      PARTIAL_PAYMENT: {
        label: 'Pagamento Parcial',
        icon: <BanknoteIcon className="h-5 w-5 text-yellow-600" />,
        description: 'Pagamento parcial recebido',
      },
      CONDITIONAL: {
        label: 'Condicional',
        icon: <AlertCircle className="h-5 w-5 text-purple-600" />,
        description: 'Pedido condicional',
      },
      ORDERED: {
        label: 'Pedido Realizado',
        icon: <ShoppingCart className="h-5 w-5 text-blue-600" />,
        description: 'Pedido em processamento',
      },
      CANCELLED: {
        label: 'Cancelado',
        icon: <XCircle className="h-5 w-5 text-red-600" />,
        description: 'Pedido cancelado',
      },
    };

    return (
      statusConfig[status as keyof typeof statusConfig] || {
        label: status,
        icon: null,
        description: '',
      }
    );
  };

  const paymentStatus = calculatePaymentStatus();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {loading ? (
              <Skeleton className="h-8 w-64" />
            ) : (
              <div className="flex items-center gap-2">
                <span>Pedido #{order?.id}</span>
                {order && (
                  <Badge
                    variant={
                      order.status === 'PAYMENT_CONFIRMED'
                        ? 'default'
                        : 'outline'
                    }
                    className={
                      order.status === 'PAYMENT_CONFIRMED'
                        ? 'bg-green-600'
                        : order.status === 'PARTIAL_PAYMENT'
                          ? 'border-yellow-500 text-yellow-700 bg-yellow-50'
                          : order.status === 'PENDING'
                            ? 'border-orange-500 text-orange-700 bg-orange-50'
                            : order.status === 'CANCELLED'
                              ? 'bg-red-600 text-white'
                              : ''
                    }
                  >
                    {getStatusDetails(order.status).label}
                  </Badge>
                )}
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="details"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="items">Itens</TabsTrigger>
            <TabsTrigger
              value="payment"
              disabled={!order || order.status === 'CANCELLED'}
            >
              Pagamento
            </TabsTrigger>
          </TabsList>

          {/* Aba de Detalhes */}
          <TabsContent value="details" className="mt-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : order ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">
                      Data do Pedido
                    </h3>
                    <p>
                      {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">
                      Cliente
                    </h3>
                    <p>{order.customerName}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">
                      Vendedor
                    </h3>
                    <p>{order.vendorName}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">
                      Forma de Pagamento
                    </h3>
                    <p>{order.paymentMethod}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">Status do Pagamento</h3>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                    <div>
                      <p className="text-sm text-gray-500">Valor Total</p>
                      <p className="font-medium">
                        {formatCurrency(paymentStatus.total)}
                      </p>
                    </div>
                    {order?.discount > 0 && (
                      <div>
                        <p className="text-sm text-gray-500">Desconto</p>
                        <p className="font-medium text-red-600">
                          -{formatCurrency(order?.discount)}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Valor Pago</p>
                      <p className="font-medium text-green-600">
                        {formatCurrency(paymentStatus.paid)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valor Restante</p>
                      <p
                        className={`font-medium ${paymentStatus.remaining > 0 ? 'text-orange-600' : 'text-green-600'}`}
                      >
                        {formatCurrency(paymentStatus.remaining)}
                      </p>
                    </div>
                  </div>
                </div>

                {order.payments && order.payments.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">
                      Histórico de Pagamentos
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Data
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Método
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Valor
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {order.payments.map((payment) => (
                            <tr key={payment.id}>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">
                                {format(
                                  new Date(payment.created_at),
                                  'dd/MM/yyyy HH:mm',
                                  { locale: ptBR }
                                )}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">
                                {payment.payment_method_name ||
                                  payment.payment_method_id}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                                {formatCurrency(payment.amount)}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">
                                <Badge
                                  variant={
                                    payment.status === 'CAPTURED'
                                      ? 'default'
                                      : 'outline'
                                  }
                                >
                                  {payment.status === 'CAPTURED'
                                    ? 'Confirmado'
                                    : payment.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 text-center text-gray-500">
                Não foi possível carregar os detalhes do pedido.
              </div>
            )}
          </TabsContent>

          {/* Aba de Itens */}
          <TabsContent value="items" className="mt-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : order && order.items && order.items.length > 0 ? (
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
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                          {item.productName}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                          {item.quantity}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-right">
                          {formatCurrency(item.total)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                          {item.vendorName || 'N/A'}
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
                    {order.discount > 0 && (
                      <tr className="bg-gray-50">
                        <td
                          colSpan={3}
                          className="px-3 py-2 text-right text-sm font-medium"
                        >
                          Desconto
                        </td>
                        <td className="px-3 py-2 text-right text-sm font-medium text-red-600">
                          -{formatCurrency(order.discount)}
                        </td>
                        <td></td>
                      </tr>
                    )}
                    <tr className="bg-gray-50">
                      <td
                        colSpan={3}
                        className="px-3 py-2 text-right text-sm font-bold"
                      >
                        Total a Pagar
                      </td>
                      <td className="px-3 py-2 text-right text-sm font-bold">
                        {formatCurrency(order.total - (order.discount || 0))}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-4 text-center text-gray-500">
                Nenhum item encontrado neste pedido.
              </div>
            )}
          </TabsContent>

          {/* Aba de Pagamento */}
          <TabsContent value="payment" className="mt-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : order ? (
              <div className="space-y-4">
                <div className="mb-4 p-4 bg-gray-50 rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total a pagar</p>
                      <p className="text-lg font-bold">
                        {formatCurrency(paymentStatus.totalAfterDiscount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valor já pago</p>
                      <p className="text-lg font-medium text-green-600">
                        {formatCurrency(paymentStatus.paid)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Restante</p>
                      <p className="text-lg font-medium text-orange-600">
                        {formatCurrency(paymentStatus.remaining)}
                      </p>
                    </div>
                  </div>
                </div>

                {paymentStatus.isFullyPaid ? (
                  <div className="text-center py-6">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      Pagamento Completo
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Este pedido já foi totalmente pago.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="paymentMethod">
                          Forma de Pagamento
                        </Label>
                        <Select
                          value={selectedPaymentMethod?.toString() || ''}
                          onValueChange={(value) =>
                            setSelectedPaymentMethod(parseInt(value))
                          }
                        >
                          <SelectTrigger id="paymentMethod">
                            <SelectValue placeholder="Selecione a forma de pagamento" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethods.map((method) => (
                              <SelectItem
                                key={method.id}
                                value={method.id.toString()}
                              >
                                {method.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="paymentAmount">
                          Valor do Pagamento
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5">R$</span>
                          <Input
                            id="paymentAmount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            max={paymentStatus.remaining}
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className="pl-10"
                            placeholder="0,00"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1.5 text-xs"
                            onClick={() =>
                              setPaymentAmount(paymentStatus.remaining)
                            }
                          >
                            Valor Total
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Valor máximo:{' '}
                          {formatCurrency(paymentStatus.remaining)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button
                        className="w-full"
                        onClick={handleRegisterPayment}
                        disabled={
                          processingPayment ||
                          !selectedPaymentMethod ||
                          !paymentAmount ||
                          (typeof paymentAmount === 'string'
                            ? parseFloat(paymentAmount.replace(',', '.')) <= 0
                            : paymentAmount <= 0)
                        }
                      >
                        {processingPayment
                          ? 'Processando...'
                          : paymentAmount &&
                              paymentAmount >= paymentStatus.remaining
                            ? 'Registrar Pagamento Total'
                            : 'Registrar Pagamento Parcial'}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="py-4 text-center text-gray-500">
                Não foi possível carregar as informações de pagamento.
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

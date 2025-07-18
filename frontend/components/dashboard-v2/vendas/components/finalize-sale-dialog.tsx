'use client';

import { useState, useEffect } from 'react';
import {
  CreditCard,
  Banknote,
  QrCode,
  Receipt,
  Loader2,
  Check,
  X,
  Plus,
  Trash2,
  User,
  CreditCardIcon,
  BanknoteIcon,
  SmartphoneIcon,
  CircleDollarSignIcon,
  CheckIcon,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import CustomerService from '@/services/clientes/CustomerServices';
import { paymentMethodService } from '@/lib/services/PaymentMethodService';
import { PaymentMethod } from '@/stores/paymentMethodStore';
import { formatCurrency } from '@/utils/format';

/**
 * Props para o diálogo de finalização de venda.
 */
export interface FinalizeSaleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  items: any[]; // Substituir por tipo forte se disponível
  total: number;
  discount: number;
  totalWithDiscount: number;
  onFinalize: (paymentData: any) => void; // Substituir por tipo forte se disponível
  isProcessing: boolean;
}

type PaymentSplit = {
  method: string;
  amount: number;
};

interface Cliente {
  id: number;
  name: string;
  last_name: string;
  cpf: string;
}

const paymentMethodIcons = {
  MONEY: <BanknoteIcon className="h-4 w-4 text-green-600" />,
  CREDIT_CARD: <CreditCardIcon className="h-4 w-4 text-blue-600" />,
  DEBIT_CARD: <CreditCardIcon className="h-4 w-4 text-blue-600" />,
  PIX: <SmartphoneIcon className="h-4 w-4 text-purple-600" />,
  CONDITIONAL: <CircleDollarSignIcon className="h-4 w-4 text-gray-600" />,
};

export function FinalizeSaleDialog({
  isOpen,
  onClose,
  items,
  total,
  discount,
  totalWithDiscount,
  onFinalize,
  isProcessing,
}: FinalizeSaleDialogProps) {
  const [paymentSplits, setPaymentSplits] = useState<PaymentSplit[]>([
    { method: 'MONEY', amount: 0 },
  ]);
  const [remainingAmount, setRemainingAmount] = useState(totalWithDiscount);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentError, setPaymentError] = useState('');
  const [notes, setNotes] = useState('');
  const [customers, setCustomers] = useState<Cliente[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [openCustomerPopover, setOpenCustomerPopover] = useState(false);
  const [paymentType, setPaymentType] = useState<string>('FULL');

  // Carregar métodos de pagamento e clientes quando o componente montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const methods = await paymentMethodService.getPaymentMethods();
        setPaymentMethods(methods);

        // Set default payment method if available
        if (methods && methods.length > 0) {
          const paymentSplitsCopy = [...paymentSplits];
          if (paymentSplitsCopy.length > 0) {
            paymentSplitsCopy[0].method = methods[0].code;
            setPaymentSplits(paymentSplitsCopy);
          }
        }

        const customersData = await CustomerService.getClients();
        setCustomers(customersData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
  }, []);

  // Reset state when opening modal
  useEffect(() => {
    if (isOpen) {
      setRemainingAmount(totalWithDiscount);
      // Use o primeiro método de pagamento disponível, ou 'MONEY' como fallback
      const defaultMethod =
        paymentMethods.length > 0 ? paymentMethods[0].code : 'MONEY';
      setPaymentSplits([{ method: defaultMethod, amount: 0 }]);
      setPaymentType('FULL'); // Por padrão, pagamento completo
      setPaymentError('');
      setNotes('');
      setSelectedCustomer(null);
      setEditingValue(null);
    }
  }, [isOpen, totalWithDiscount, paymentMethods]);

  // Atualiza o valor restante baseado nas divisões de pagamento
  useEffect(() => {
    const totalPaid = paymentSplits.reduce(
      (sum, split) => sum + split.amount,
      0
    );

    // Arredondar para evitar problemas com números decimais
    const valorRestante = parseFloat(
      (totalWithDiscount - totalPaid).toFixed(2)
    );
    setRemainingAmount(valorRestante);

    // Validação para garantir que o valor não exceda o total
    if (totalPaid > totalWithDiscount) {
      setPaymentError('O valor total dos pagamentos excede o valor da venda');
    } else {
      setPaymentError('');
    }
  }, [paymentSplits, totalWithDiscount]);

  // Formatação de preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  // Função para formatar valores monetários
  const formatCurrency = (value: number): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return '0,00';
    }
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Função para converter texto em valor numérico
  const parseCurrency = (value: string): number => {
    if (!value) return 0;
    const sanitized = value.replace(/[^\d,.]/g, '');
    return parseFloat(sanitized.replace(/\./g, '').replace(',', '.')) || 0;
  };

  // Estado para controlar o valor sendo editado
  const [editingValue, setEditingValue] = useState<{
    index: number;
    value: string;
  } | null>(null);

  // Função para iniciar edição de um valor
  const startEditing = (index: number, value: number) => {
    // Inicia a edição com o valor formatado, mas sem R$ e pontos
    const formattedValue = formatCurrency(value)
      .replace('R$', '')
      .trim()
      .replace(/\./g, '');

    setEditingValue({
      index,
      value: formattedValue,
    });
  };

  // Função para lidar com a mudança no campo de edição
  const handleEditingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingValue) return;

    let inputValue = e.target.value;

    // Remove todos os caracteres não numéricos exceto vírgula
    inputValue = inputValue.replace(/[^\d,]/g, '');

    // Se o usuário digitar apenas números, interpreta como valor inteiro
    if (!inputValue.includes(',')) {
      // Permite digitar normalmente sem formatação
      setEditingValue({ ...editingValue, value: inputValue });
      return;
    }

    // Se tiver vírgula, verifica se tem mais de uma
    const parts = inputValue.split(',');
    if (parts.length > 2) {
      // Se tiver mais de uma vírgula, mantém apenas a primeira
      inputValue = parts[0] + ',' + parts.slice(1).join('');
    }

    // Limita a 2 casas decimais
    if (parts.length === 2 && parts[1].length > 2) {
      inputValue = parts[0] + ',' + parts[1].substring(0, 2);
    }

    setEditingValue({ ...editingValue, value: inputValue });
  };

  // Função para finalizar edição de um valor
  const finishEditing = () => {
    if (editingValue) {
      let valueToSave = editingValue.value;

      // Se não tem vírgula, adiciona ",00" no final
      if (!valueToSave.includes(',')) {
        valueToSave = valueToSave + ',00';
      } else {
        // Se tem vírgula mas não tem casas decimais suficientes
        const parts = valueToSave.split(',');
        if (parts.length > 1) {
          if (parts[1].length === 0) {
            valueToSave = valueToSave + '00';
          } else if (parts[1].length === 1) {
            valueToSave = valueToSave + '0';
          }
        }
      }

      const value = parseCurrency(valueToSave);
      handleUpdatePaymentSplit(editingValue.index, 'amount', value);
      setEditingValue(null);
    }
  };

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

    // Se for atualizar o valor, não aplicar validações restritivas
    // para permitir a edição livre do valor
    newSplits[index] = { ...newSplits[index], [field]: value };
    setPaymentSplits(newSplits);
  };

  const fillRemainingAmount = (index: number) => {
    if (remainingAmount <= 0) return;

    // Cancelar qualquer edição em andamento
    if (editingValue) {
      setEditingValue(null);
    }

    const newSplits = [...paymentSplits];
    newSplits[index] = {
      ...newSplits[index],
      amount: parseFloat(
        (newSplits[index].amount + remainingAmount).toFixed(2)
      ),
    };
    setPaymentSplits(newSplits);
  };

  const getPaymentMethodIcon = (method: string) => {
    return (
      paymentMethodIcons[method as keyof typeof paymentMethodIcons] || (
        <CircleDollarSignIcon className="h-4 w-4 text-gray-600" />
      )
    );
  };

  // Manipulador para finalizar a venda
  const handleFinalize = () => {
    // Validar cliente para vendas a prazo (fiado) e condicionais
    if (
      (paymentType === 'CREDIT' || paymentType === 'CONDITIONAL') &&
      !selectedCustomer
    ) {
      setPaymentError(
        'É necessário selecionar um cliente para este tipo de venda.'
      );
      return;
    }

    const totalPaid = paymentSplits.reduce(
      (sum, split) => sum + split.amount,
      0
    );

    // Verificar se o valor total está correto quando é pagamento completo
    if (
      paymentType === 'FULL' &&
      Math.abs(totalPaid - totalWithDiscount) > 0.05
    ) {
      setPaymentError(
        'Para pagamento completo, o valor total dos pagamentos deve ser igual ao valor da venda.'
      );
      return;
    }

    // Determinar o status da venda baseado no tipo de pagamento
    let orderStatus = 'PENDING';

    if (paymentType === 'FULL') {
      // Pagamento completo
      orderStatus = 'PAYMENT_CONFIRMED';
    } else if (paymentType === 'PARTIAL') {
      // Pagamento parcial (entrada)
      orderStatus = 'PARTIAL_PAYMENT';
    } else if (paymentType === 'CREDIT') {
      // Venda fiado (promissória)
      orderStatus = 'PENDING';
    } else if (paymentType === 'CONDITIONAL') {
      // Venda condicional
      orderStatus = 'CONDITIONAL';
    }

    // Preparar dados do pagamento
    const paymentData = {
      status: orderStatus,
      cliente_id: selectedCustomer?.id,
      cliente_nome: selectedCustomer?.name,
      payment_type: paymentType,
      payment_splits: paymentSplits,
      payment_method:
        paymentSplits.length > 1 ? 'SPLITED_PAYMENT' : paymentSplits[0]?.method,
      payment_method_code:
        paymentSplits.length > 1 ? 'SPLITED_PAYMENT' : paymentSplits[0]?.method,
      notes,
      items,
      total: totalWithDiscount,
      discount,
      total_paid: totalPaid,
      remaining_balance: totalWithDiscount - totalPaid,
    };

    onFinalize(paymentData);
  };

  // Validar se a venda pode ser finalizada
  const canFinalizeSale = () => {
    // Para vendas fiado ou condicionais, é obrigatório selecionar um cliente
    if (
      (paymentType === 'CREDIT' || paymentType === 'CONDITIONAL') &&
      !selectedCustomer
    ) {
      return false;
    }

    // Para pagamento completo, o valor deve ser igual ao total
    if (paymentType === 'FULL') {
      const totalPaid = paymentSplits.reduce(
        (sum, split) => sum + split.amount,
        0
      );
      if (Math.abs(totalPaid - totalWithDiscount) > 0.05) {
        return false;
      }
    }

    // Para pagamento parcial, deve haver algum valor pago
    if (paymentType === 'PARTIAL') {
      const totalPaid = paymentSplits.reduce(
        (sum, split) => sum + split.amount,
        0
      );
      if (totalPaid <= 0) {
        return false;
      }
    }

    return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Finalizar Venda</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-220px)] overflow-y-auto">
          <div className="space-y-6 pr-4">
            {/* Resumo da compra */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Resumo da Venda</CardTitle>
                <CardDescription>
                  {items.length} {items.length === 1 ? 'item' : 'itens'} no
                  carrinho
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-destructive">
                    <span>Desconto</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(totalWithDiscount)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Cliente */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">
                  Cliente
                  {paymentType === 'CREDIT' && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </h3>
                {paymentType === 'CREDIT' && !selectedCustomer && (
                  <span className="text-xs text-destructive">
                    Obrigatório para vendas a prazo
                  </span>
                )}
              </div>
              <Popover
                open={openCustomerPopover}
                onOpenChange={setOpenCustomerPopover}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant={
                      paymentType === 'CREDIT' && !selectedCustomer
                        ? 'destructive'
                        : 'outline'
                    }
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedCustomer
                      ? selectedCustomer.name
                      : 'Selecione um cliente...'}
                    <User className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar cliente por nome ou CPF..." />
                    <CommandList>
                      <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                      <CommandGroup>
                        {customers.map((customer) => (
                          <CommandItem
                            key={customer.id}
                            value={`${customer.name} ${customer.last_name} ${customer.cpf}`}
                            onSelect={() => {
                              setSelectedCustomer({
                                id: customer.id,
                                name: `${customer.name} ${customer.last_name}`,
                              });
                              setOpenCustomerPopover(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedCustomer?.id === customer.id
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {customer.name} {customer.last_name} /{' '}
                            {customer.cpf}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Método de pagamento */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Formas de Pagamento</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddPaymentSplit}
                    disabled={remainingAmount <= 0 || paymentType === 'CREDIT'}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
              </div>

              {/* Tipo de pagamento */}
              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant={paymentType === 'FULL' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setPaymentType('FULL');

                    // Resetar os valores para pagamento completo
                    if (paymentSplits.length > 0) {
                      const newSplits = [...paymentSplits];
                      newSplits[0] = { ...newSplits[0], amount: 0 };
                      setPaymentSplits(newSplits.slice(0, 1));
                    }
                  }}
                >
                  Completo
                </Button>
                <Button
                  variant={paymentType === 'PARTIAL' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setPaymentType('PARTIAL');

                    // Resetar os valores para pagamento parcial
                    if (paymentSplits.length > 0) {
                      const newSplits = [...paymentSplits];
                      newSplits[0] = { ...newSplits[0], amount: 0 };
                      setPaymentSplits(newSplits.slice(0, 1));
                    }
                  }}
                >
                  Com entrada
                </Button>
                <Button
                  variant={paymentType === 'CREDIT' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setPaymentType('CREDIT');

                    // Para vendas fiado, definir método como CREDIT e valor como 0
                    const creditMethod =
                      paymentMethods.find((m) => m.code === 'CONDITIONAL')
                        ?.code || 'CONDITIONAL';
                    setPaymentSplits([{ method: creditMethod, amount: 0 }]);
                  }}
                >
                  Promissória
                </Button>
                <Button
                  variant={
                    paymentType === 'CONDITIONAL' ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => {
                    setPaymentType('CONDITIONAL');

                    // Para vendas condicionais, definir método como CONDITIONAL e valor como 0
                    const conditionalMethod =
                      paymentMethods.find((m) => m.code === 'CONDITIONAL')
                        ?.code || 'CONDITIONAL';
                    setPaymentSplits([
                      { method: conditionalMethod, amount: 0 },
                    ]);
                  }}
                >
                  Condicional
                </Button>
              </div>

              {paymentType !== 'CREDIT' && paymentType !== 'CONDITIONAL' && (
                <div className="space-y-3">
                  {paymentSplits.map((split, index) => (
                    <div
                      key={index}
                      className="flex gap-3 items-end border rounded-md p-3"
                    >
                      <div className="flex-grow space-y-2">
                        <Label>Forma de Pagamento</Label>
                        <Select
                          value={split.method}
                          onValueChange={(value) =>
                            handleUpdatePaymentSplit(index, 'method', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o método de pagamento" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethods.map((method) => (
                              <SelectItem key={method.id} value={method.code}>
                                <div className="flex items-center">
                                  {getPaymentMethodIcon(method.code)}
                                  <span className="ml-2">{method.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-grow space-y-2">
                        <Label>Valor</Label>
                        <div className="flex gap-2">
                          <div className="relative flex-grow">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                              R$
                            </span>
                            {editingValue && editingValue.index === index ? (
                              <Input
                                className="pl-8 border-primary"
                                value={editingValue.value}
                                onChange={handleEditingChange}
                                onBlur={finishEditing}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    finishEditing();
                                  }
                                }}
                                autoFocus
                                placeholder="0,00"
                              />
                            ) : (
                              <Input
                                className="pl-8 cursor-text hover:border-primary"
                                value={formatCurrency(split.amount)}
                                onFocus={() =>
                                  startEditing(index, split.amount)
                                }
                                onClick={() =>
                                  startEditing(index, split.amount)
                                }
                                placeholder="0,00"
                                readOnly
                              />
                            )}
                          </div>
                          {remainingAmount > 0 && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => fillRemainingAmount(index)}
                              title="Preencher valor restante"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      {paymentSplits.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePaymentSplit(index)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  {/* Valor restante */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Valor restante:</span>
                    <span
                      className={`font-medium text-lg ${
                        remainingAmount > 0
                          ? 'text-red-500'
                          : remainingAmount < 0
                            ? 'text-orange-500'
                            : 'text-green-500'
                      }`}
                    >
                      {formatCurrency(remainingAmount)}
                    </span>
                  </div>
                </div>
              )}

              {paymentType === 'CREDIT' && (
                <div className="border rounded-md p-4 bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <CircleDollarSignIcon className="h-5 w-5 text-muted-foreground" />
                    <h4 className="font-medium">Venda a Prazo (Promissória)</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Esta venda será registrada como "promissória" e o cliente
                    deverá pagar posteriormente.
                  </p>

                  <div className="flex items-center p-2 bg-amber-50 border border-amber-200 rounded-md">
                    <div className="text-amber-600 text-sm">
                      <strong>Importante:</strong> É necessário selecionar um
                      cliente para vendas a prazo.
                    </div>
                  </div>
                </div>
              )}

              {paymentType === 'CONDITIONAL' && (
                <div className="border rounded-md p-4 bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <CircleDollarSignIcon className="h-5 w-5 text-muted-foreground" />
                    <h4 className="font-medium">Venda Condicional</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Esta venda será registrada como "condicional", indicando que
                    depende de uma condição futura — aceitação total ou parcial
                    dos produtos.
                  </p>

                  <div className="flex items-center p-2 bg-amber-50 border border-amber-200 rounded-md">
                    <div className="text-amber-600 text-sm">
                      <strong>Importante:</strong> É necessário selecionar um
                      cliente para vendas condicionais.
                    </div>
                  </div>
                </div>
              )}

              {paymentError && (
                <div className="text-destructive text-sm">{paymentError}</div>
              )}
            </div>

            {/* Observações */}
            <div className="space-y-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Input
                id="notes"
                placeholder="Adicione observações sobre a venda..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={handleFinalize}
            disabled={isProcessing || !canFinalizeSale()}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <CheckIcon className="mr-2 h-4 w-4" />
                Finalizar Venda
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

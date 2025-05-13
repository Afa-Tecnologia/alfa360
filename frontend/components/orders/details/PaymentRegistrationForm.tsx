import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/utils/formatters';
import { PaymentMethod } from '@/stores/paymentMethodStore';
import { CheckCircle2, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PaymentRegistrationFormProps {
  remaining: number;
  isFullyPaid: boolean;
  paymentMethods: PaymentMethod[];
  onSetPaymentAmount: (amount: number | string) => void;
  onSetSelectedMethod: (methodId: number, methodCode: string) => void;
  onRegisterPayment: () => void;
  paymentAmount: number | string;
  selectedMethodId: number | null;
  isProcessing: boolean;
}

/**
 * Component for payment registration form
 */
export function PaymentRegistrationForm({
  remaining,
  isFullyPaid,
  paymentMethods,
  onSetPaymentAmount,
  onSetSelectedMethod,
  onRegisterPayment,
  paymentAmount,
  selectedMethodId,
  isProcessing,
}: PaymentRegistrationFormProps) {
  // Handle already paid orders
  if (isFullyPaid) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="rounded-full bg-green-100 p-3 mb-3">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-medium">Pagamento Completo</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          Este pedido já foi totalmente pago. Não é necessário registrar novos
          pagamentos.
        </p>
      </div>
    );
  }

  // Calculate payment type based on amount
  const isFullPayment =
    typeof paymentAmount === 'string'
      ? parseFloat(paymentAmount.replace(',', '.')) >= remaining
      : paymentAmount >= remaining;

  // Check if form is valid
  const isFormValid =
    selectedMethodId &&
    paymentAmount &&
    (typeof paymentAmount === 'string'
      ? parseFloat(paymentAmount.replace(',', '.')) > 0
      : paymentAmount > 0);

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden">
        <CardContent className="p-4 bg-muted/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Total a pagar</p>
              <p className="text-xl font-bold">{formatCurrency(remaining)}</p>
            </div>
            <div className="flex items-center text-muted-foreground text-sm">
              <CreditCard className="h-4 w-4 mr-1.5" />
              <span>Registre o pagamento abaixo</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div>
          <Label htmlFor="paymentMethod" className="text-sm font-medium">
            Forma de Pagamento
          </Label>
          <Select
            value={selectedMethodId?.toString() || ''}
            onValueChange={(value) => {
              const id = parseInt(value);
              const method = paymentMethods.find((m) => m.id === id);
              if (method) {
                onSetSelectedMethod(id, method.code);
              }
            }}
          >
            <SelectTrigger id="paymentMethod" className="mt-1.5">
              <SelectValue placeholder="Selecione a forma de pagamento" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((method) => (
                <SelectItem key={method.id} value={method.id.toString()}>
                  {method.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="paymentAmount" className="text-sm font-medium">
            Valor do Pagamento
          </Label>
          <div className="relative mt-1.5">
            <span className="absolute left-3 top-2.5 text-muted-foreground">
              R$
            </span>
            <Input
              id="paymentAmount"
              type="number"
              step="0.01"
              min="0.01"
              max={remaining}
              value={paymentAmount}
              onChange={(e) => onSetPaymentAmount(e.target.value)}
              className="pl-9"
              placeholder="0,00"
            />
            <div className="absolute right-1 top-1 h-8">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs h-6 px-2"
                onClick={() => onSetPaymentAmount(remaining)}
              >
                Total
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 flex justify-between">
            <span>Valor máximo: {formatCurrency(remaining)}</span>
            {isFullPayment && (
              <span className="text-green-600">Pagamento total</span>
            )}
          </p>
        </div>
      </div>

      <div className="pt-2">
        <Button
          className="w-full"
          onClick={onRegisterPayment}
          disabled={isProcessing || !isFormValid}
        >
          {isProcessing
            ? 'Processando...'
            : isFullPayment
              ? 'Registrar Pagamento Total'
              : 'Registrar Pagamento Parcial'}
        </Button>
      </div>
    </div>
  );
}

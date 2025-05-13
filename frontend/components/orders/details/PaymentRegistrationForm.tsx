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
import { CheckCircle2 } from 'lucide-react';

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
      <div className="text-center py-6">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          Pagamento Completo
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Este pedido já foi totalmente pago.
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
    <div className="space-y-4">
      <div className="mb-4 p-4 bg-gray-50 rounded-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total a pagar</p>
            <p className="text-lg font-bold">{formatCurrency(remaining)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
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
            <SelectTrigger id="paymentMethod">
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
          <Label htmlFor="paymentAmount">Valor do Pagamento</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5">R$</span>
            <Input
              id="paymentAmount"
              type="number"
              step="0.01"
              min="0.01"
              max={remaining}
              value={paymentAmount}
              onChange={(e) => onSetPaymentAmount(e.target.value)}
              className="pl-10"
              placeholder="0,00"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1.5 text-xs"
              onClick={() => onSetPaymentAmount(remaining)}
            >
              Valor Total
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Valor máximo: {formatCurrency(remaining)}
          </p>
        </div>
      </div>

      <div className="mt-6">
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

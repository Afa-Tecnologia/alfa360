'use client';

import { useEffect, useState } from 'react';
import {
  usePaymentMethodStore,
  PaymentMethod,
} from '@/stores/paymentMethodStore';
import { PaymentMethodHeader } from '@/components/metodos-pagamentos/metodos-header';
import { Button } from '../ui/button';
import { Separator } from '@/components/ui/separator';
import { PaymentMethodList } from '@/components/metodos-pagamentos/metodos-list';
import { useToast } from '@/components/ui/use-toast';
import {
  PaymentMethodDialog,
  PaymentMethodDialogTrigger,
} from '@/components/metodos-pagamentos/metodos-dialog';

export default function MetodosPagamento() {
  const { fetchPaymentMethods } = usePaymentMethodStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [paymentMethodToEdit, setPaymentMethodToEdit] =
    useState<PaymentMethod | null>(null);

  const openEditDialog = (paymentMethod: PaymentMethod) => {
    setPaymentMethodToEdit(paymentMethod);
    setIsEditDialogOpen(true);
  };

  useEffect(() => {
    async function loadPaymentMethods() {
      try {
        setIsLoading(true);
        await fetchPaymentMethods();
      } catch (error) {
        console.error('Erro ao carregar métodos de pagamento:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os métodos de pagamento.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadPaymentMethods();
  }, [fetchPaymentMethods, toast]);

  const handleOperationSuccess = async () => {
    await fetchPaymentMethods();
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between">
        <PaymentMethodHeader />
        <PaymentMethodDialogTrigger
          onClick={() => setIsCreateDialogOpen(true)}
        />
      </div>

      <Separator className="my-4" />

      <div className="flex-1 overflow-auto">
        <PaymentMethodList onEdit={openEditDialog} />
      </div>

      <PaymentMethodDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleOperationSuccess}
      />

      {paymentMethodToEdit && (
        <PaymentMethodDialog
          paymentMethod={paymentMethodToEdit}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={handleOperationSuccess}
        />
      )}
    </div>
  );
}

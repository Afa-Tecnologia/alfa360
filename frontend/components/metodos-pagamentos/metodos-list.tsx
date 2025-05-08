'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  usePaymentMethodStore,
  PaymentMethod,
} from '@/stores/paymentMethodStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Search, CreditCard, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { PaymentMethodDialogTrigger } from './metodos-dialog';
import { paymentMethodService } from '@/lib/services/PaymentMethodService';

interface PaymentMethodListProps {
  onEdit?: (paymentMethod: PaymentMethod) => void;
}

export function PaymentMethodList({ onEdit }: PaymentMethodListProps) {
  const { paymentMethods, isLoading, fetchPaymentMethods } =
    usePaymentMethodStore();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [paymentMethodToDelete, setPaymentMethodToDelete] =
    useState<PaymentMethod | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (paymentMethodToDelete) {
      try {
        setIsDeleting(true);
        await paymentMethodService.deletePaymentMethod(
          paymentMethodToDelete.id
        );
        await fetchPaymentMethods();
        setShowDeleteDialog(false);
        setPaymentMethodToDelete(null);
        toast({
          title: 'Método de pagamento excluído',
          description: 'O método de pagamento foi excluído com sucesso.',
        });
      } catch (error) {
        console.error('Erro ao excluir método de pagamento:', error);
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao excluir o método de pagamento.',
          variant: 'destructive',
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = (paymentMethod: PaymentMethod) => {
    if (onEdit) {
      onEdit(paymentMethod);
    }
  };

  const filteredPaymentMethods = paymentMethods.filter(
    (method) =>
      method.name.toLowerCase().includes(search.toLowerCase()) ||
      method.code.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 w-full max-w-sm">
          <Skeleton className="h-10 w-full" />
        </div>
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 w-full max-w-sm relative">
        <Search className="h-4 w-4 absolute left-3 text-muted-foreground" />
        <Input
          placeholder="Buscar métodos de pagamento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Código</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPaymentMethods.map((method) => (
              <TableRow key={method.id}>
                <TableCell className="font-medium">{method.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{method.code}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(method)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setPaymentMethodToDelete(method);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Método de Pagamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o método de pagamento{' '}
              {paymentMethodToDelete?.name}? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

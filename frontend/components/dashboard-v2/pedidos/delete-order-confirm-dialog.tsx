'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteOrderConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  orderNumber?: string;
  isDeleting?: boolean;
}

export function DeleteOrderConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  orderNumber,
  isDeleting = false,
}: DeleteOrderConfirmDialogProps) {
  const [confirmText, setConfirmText] = useState('');
  const isConfirmValid = confirmText === 'DELETAR';

  const handleConfirm = () => {
    if (isConfirmValid) {
      onConfirm();
    }
  };

  const handleClose = () => {
    setConfirmText('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />⚠ Atenção!
          </DialogTitle>
          <DialogDescription className="text-left space-y-3 pt-2">
            <p className="font-medium text-gray-900 dark:text-gray-100">
              A exclusão deste pedido é irreversível.
            </p>

            <p className="text-gray-700 dark:text-gray-300">
              Ao confirmar, serão aplicadas as seguintes ações:
            </p>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">
                  •
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Os produtos deste pedido retornarão ao estoque.
                </span>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">
                  •
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Pagamentos relacionados a este pedido serão excluídos.
                </span>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">
                  •
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  O caixa exibirá a movimentação de saída referente aos
                  pagamentos já realizados para este pedido.
                </span>
              </div>
            </div>

            <p className="text-red-600 dark:text-red-400 font-medium">
              Essa ação não poderá ser desfeita.
            </p>

            <div className="pt-2">
              <Label htmlFor="confirm-text" className="text-sm font-medium">
                Para confirmar, digite a palavra{' '}
                <span className="font-bold text-red-600">DELETAR</span> no campo
                abaixo:
              </Label>
              <Input
                id="confirm-text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Digite DELETAR para confirmar"
                className="mt-2"
                disabled={isDeleting}
              />
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 pt-4">
          <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isConfirmValid || isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Excluir Pedido'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

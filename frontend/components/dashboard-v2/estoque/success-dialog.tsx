'use client';

import { Product } from '@/stores/productStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BarcodeLabel } from '@/components/estoquenovo/BarcodeLabel';
import { ProductEstoque } from '@/types/product';

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
  product: ProductEstoque | null;
}

export function SuccessDialog({ open, onClose, product }: SuccessDialogProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Produto criado com sucesso!</DialogTitle>
          <DialogDescription>
            O produto foi cadastrado e está pronto para uso. Você pode imprimir
            a etiqueta abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="flex flex-col items-center">
            <BarcodeLabel
              product={product}
            />

            <p className="text-sm text-muted-foreground mt-4 text-center">
              Clique no botão de impressão para imprimir a etiqueta do produto.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Concluir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

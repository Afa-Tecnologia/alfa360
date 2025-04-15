'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BarcodeLabel } from './BarcodeLabel';
import { CheckCircle } from 'lucide-react';

interface SuccessProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    code: string;
    selling_price: number;
    variants?: Array<{
      id: number;
      color: string;
      size: string;
    }>;
  };
}

export function SuccessProductDialog({
  isOpen,
  onClose,
  product,
}: SuccessProductDialogProps) {
  // Verificação segura para TypeScript
  const variants = product?.variants || [];
  const hasVariants = variants.length > 0;
  const firstVariant = hasVariants ? variants[0] : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <span>Produto Cadastrado com Sucesso!</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          <p className="text-center mb-4">
            O produto foi cadastrado com sucesso e agora você pode imprimir a
            etiqueta com o código de barras.
          </p>

          <BarcodeLabel
            productName={product.name}
            productCode={product.code}
            productPrice={Number(product.selling_price)}
            productColor={firstVariant?.color}
            productSize={firstVariant?.size}
          />
        </div>

        <DialogFooter className="sm:justify-center">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

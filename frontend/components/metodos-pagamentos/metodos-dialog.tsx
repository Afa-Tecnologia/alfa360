'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Category } from '@/stores/categoryStore';
import { PlusCircle, Pencil } from 'lucide-react';
import { PaymentMethodForm } from './metodos-form';
import { PaymentMethod } from '@/stores/paymentMethodStore';

interface CategoryDialogProps {
  category?: Category;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CategoryDialog({
  category,
  isOpen,
  onOpenChange,
  onSuccess,
}: CategoryDialogProps) {
  const isEditing = !!category;

  const handleSuccess = () => {
    onOpenChange(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Atualize os detalhes da categoria ${category.name}`
              : 'Preencha os campos abaixo para criar uma nova categoria'}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export function CategoryDialogTrigger({
  variant = 'default',
  isEditing = false,
  onClick,
}: {
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost';
  isEditing?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      className={isEditing ? 'h-8 w-8 p-0' : 'flex items-center gap-2'}
      size={isEditing ? 'icon' : 'default'}
    >
      {isEditing ? (
        <Pencil className="h-4 w-4" />
      ) : (
        <>
          <PlusCircle className="h-4 w-4" />
          Nova Categoria
        </>
      )}
    </Button>
  );
}

interface PaymentMethodDialogProps {
  paymentMethod?: PaymentMethod;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function PaymentMethodDialog({
  paymentMethod,
  isOpen,
  onOpenChange,
  onSuccess,
}: PaymentMethodDialogProps) {
  const isEditing = !!paymentMethod;

  const handleSuccess = () => {
    onOpenChange(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? 'Editar Método de Pagamento'
              : 'Novo Método de Pagamento'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Atualize os detalhes do método de pagamento ${paymentMethod.name}`
              : 'Preencha os campos abaixo para criar um novo método de pagamento'}
          </DialogDescription>
        </DialogHeader>

        <PaymentMethodForm
          paymentMethod={paymentMethod}
          isEditing={isEditing}
          onSuccess={handleSuccess}
          inDialog
        />
      </DialogContent>
    </Dialog>
  );
}

export function PaymentMethodDialogTrigger({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <Button onClick={onClick}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Novo Método de Pagamento
    </Button>
  );
}

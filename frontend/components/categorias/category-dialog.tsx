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
import { CategoryForm } from './category-form';
import { Button } from '@/components/ui/button';
import { Category } from '@/stores/categoryStore';
import { PlusCircle, Pencil } from 'lucide-react';

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

        <CategoryForm
          category={category}
          isEditing={isEditing}
          onSuccess={handleSuccess}
          inDialog
        />
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

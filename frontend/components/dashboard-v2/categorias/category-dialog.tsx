'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Category } from '@/stores/categoryStore';
import { Loader2 } from 'lucide-react';
import { categoryService } from '@/lib/services/CategoryService';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';

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
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formState, setFormState] = useState({
    name: category?.name || '',
    description: category?.description || '',
    active: category?.active ?? true,
  });

  // Reset form when dialog opens/closes or category changes
  useEffect(() => {
    if (isOpen) {
      setFormState({
        name: category?.name || '',
        description: category?.description || '',
        active: category?.active ?? true,
      });
    }
  }, [isOpen, category]);

  // Handle text field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle switch changes
  const handleSwitchChange = (checked: boolean) => {
    setFormState((prev) => ({
      ...prev,
      active: checked,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing && category) {
        await categoryService.updateCategory(category.id, formState);
        toast({
          title: 'Categoria atualizada',
          description: 'A categoria foi atualizada com sucesso.',
        });
      } else {
        await categoryService.createCategory(formState);
        toast({
          title: 'Categoria criada',
          description: 'A categoria foi criada com sucesso.',
        });
      }

      if (onSuccess) {
        onSuccess();
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar a categoria.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]   overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Atualize os detalhes da categoria "${category?.name}"`
              : 'Preencha os campos abaixo para criar uma nova categoria'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                placeholder="Nome da categoria"
                className="w-full"
                required
                autoFocus
              />
              <p className="text-[0.8rem] text-muted-foreground">
                Nome da categoria exibido para os usuários.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formState.description}
                onChange={handleChange}
                placeholder="Descrição detalhada da categoria"
                className="min-h-[100px] resize-none"
              />
              <p className="text-[0.8rem] text-muted-foreground">
                Descreva a finalidade desta categoria.
              </p>
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="active">Status</Label>
                <p className="text-[0.8rem] text-muted-foreground">
                  Ative ou desative esta categoria.
                </p>
              </div>
              <Switch
                id="active"
                checked={formState.active}
                onCheckedChange={handleSwitchChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Atualizando...' : 'Criando...'}
                </>
              ) : isEditing ? (
                'Atualizar'
              ) : (
                'Criar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

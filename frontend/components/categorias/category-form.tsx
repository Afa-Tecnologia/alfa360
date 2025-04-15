'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/stores/categoryStore';
import { Loader2 } from 'lucide-react';
import { categoryService } from '@/lib/services/CategoryService';
import { useToast } from '@/components/ui/use-toast';

interface CategoryFormProps {
  category?: Category;
  isEditing?: boolean;
  onSuccess?: () => void;
  inDialog?: boolean;
}

export function CategoryForm({
  category,
  isEditing = false,
  onSuccess,
  inDialog = false,
}: CategoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formState, setFormState] = useState({
    name: category?.name || '',
    description: category?.description || '',
    active: category?.active ?? true,
  });

  // Atualiza o estado quando a categoria muda
  useEffect(() => {
    if (category) {
      setFormState({
        name: category.name,
        description: category.description,
        active: category.active,
      });
    }
  }, [category]);

  // Handlers para atualização do formulário
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormState((prev) => ({
      ...prev,
      active: checked,
    }));
  };

  // Handler de submissão
  const handleSubmit = async (e: FormEvent) => {
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
      } else if (!inDialog) {
        router.push('/dashboard/categorias');
      }
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Nome
        </label>
        <Input
          id="name"
          name="name"
          value={formState.name}
          onChange={handleChange}
          placeholder="Nome da categoria"
        />
        <p className="text-[0.8rem] text-muted-foreground">
          Nome da categoria exibido para os usuários.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Descrição
        </label>
        <Textarea
          id="description"
          name="description"
          value={formState.description}
          onChange={handleChange}
          placeholder="Descrição da categoria"
          className="min-h-[120px]"
        />
        <p className="text-[0.8rem] text-muted-foreground">
          Descreva a finalidade desta categoria.
        </p>
      </div>

      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <label htmlFor="active" className="text-base font-medium">
            Status
          </label>
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

      <div className="flex gap-3 justify-end">
        {!inDialog && (
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/categorias')}
          >
            Cancelar
          </Button>
        )}
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
      </div>
    </form>
  );
}

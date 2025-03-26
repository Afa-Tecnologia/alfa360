'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/stores/categoryStore';
import { Loader2 } from 'lucide-react';
import { categoryService } from '@/lib/services/CategoryService';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter no mínimo 2 caracteres')
    .max(45, 'O nome deve ter no máximo 45 caracteres'),
  description: z
    .string()
    .min(5, 'A descrição deve ter no mínimo 5 caracteres')
    .max(255, 'A descrição deve ter no máximo 255 caracteres'),
  active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

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

  const defaultValues: FormValues = {
    name: category?.name || '',
    description: category?.description || '',
    active: category?.active ?? true,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Atualiza o formulário quando a categoria muda
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description,
        active: category.active,
      });
    }
  }, [category, form]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      if (isEditing && category) {
        await categoryService.updateCategory(category.id, values);
        toast({
          title: 'Categoria atualizada',
          description: 'A categoria foi atualizada com sucesso.',
        });
      } else {
        await categoryService.createCategory(values);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome da categoria" {...field} />
              </FormControl>
              <FormDescription>
                Nome da categoria exibido para os usuários.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrição da categoria"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Descreva a finalidade desta categoria.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Status</FormLabel>
                <FormDescription>
                  Ative ou desative esta categoria.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

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
    </Form>
  );
}

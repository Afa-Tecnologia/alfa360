'use client';

import { useEffect, useState } from 'react';
import { useCategoryStore, Category } from '@/stores/categoryStore';
import { CategoryHeader } from '@/components/categorias/category-header';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { CategoryList } from '@/components/categorias/category-list';
import { useToast } from '@/components/ui/use-toast';
import {
  CategoryDialog,
  CategoryDialogTrigger,
} from '@/components/categorias/category-dialog';

export default function Categorias() {
  const { fetchCategories } = useCategoryStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Estado para controlar os diálogos
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  // Função para abrir o diálogo de edição
  const openEditDialog = (category: Category) => {
    setCategoryToEdit(category);
    setIsEditDialogOpen(true);
  };

  // Carrega as categorias quando a página é montada
  useEffect(() => {
    async function loadCategories() {
      try {
        setIsLoading(true);
        await fetchCategories();
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as categorias.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, [fetchCategories, toast]);

  // Função para atualizar a lista após criar/editar
  const handleOperationSuccess = async () => {
    await fetchCategories();
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between">
        <CategoryHeader />
        <CategoryDialogTrigger onClick={() => setIsCreateDialogOpen(true)} />
      </div>

      <Separator className="my-4" />

      <div className="flex-1 overflow-auto">
        <CategoryList onEdit={openEditDialog} />
      </div>

      {/* Diálogo para criar nova categoria */}
      <CategoryDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleOperationSuccess}
      />

      {/* Diálogo para editar categoria */}
      {categoryToEdit && (
        <CategoryDialog
          category={categoryToEdit}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={handleOperationSuccess}
        />
      )}
    </div>
  );
}

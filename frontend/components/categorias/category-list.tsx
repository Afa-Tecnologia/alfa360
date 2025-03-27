'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCategoryStore, Category } from '@/stores/categoryStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Search, Layers, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
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
import { categoryService } from '@/lib/services/CategoryService';
import { useToast } from '@/components/ui/use-toast';
import { CategoryDialogTrigger } from './category-dialog';

interface CategoryListProps {
  onEdit?: (category: Category) => void;
}

export function CategoryList({ onEdit }: CategoryListProps) {
  const { categories, isLoading, fetchCategories } = useCategoryStore();
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Função para confirmar exclusão
  const handleDelete = async () => {
    if (categoryToDelete) {
      try {
        setIsDeleting(true);
        await categoryService.deleteCategory(categoryToDelete.id);

        // Atualizar o estado depois de excluir
        await fetchCategories();

        setShowDeleteDialog(false);
        setCategoryToDelete(null);

        toast({
          title: 'Categoria excluída',
          description: 'A categoria foi excluída com sucesso.',
        });
      } catch (error) {
        console.error('Erro ao excluir categoria:', error);
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao excluir a categoria.',
          variant: 'destructive',
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Função para editar categoria
  const handleEdit = (category: Category) => {
    if (onEdit) {
      onEdit(category);
    } else {
      router.push(`/dashboard/categorias/${category.id}`);
    }
  };

  // Filtrar categorias com base na pesquisa
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(search.toLowerCase()) ||
      category.description.toLowerCase().includes(search.toLowerCase())
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
          placeholder="Buscar categorias..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Layers className="h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium">Nenhuma categoria encontrada</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {search
              ? 'Tente usar termos diferentes para a busca.'
              : 'Comece criando uma nova categoria.'}
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-300px)] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    {category.active ? (
                      <Badge className="bg-green-500">Ativo</Badge>
                    ) : (
                      <Badge variant="destructive">Inativo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <CategoryDialogTrigger
                        variant="outline"
                        isEditing
                        onClick={() => handleEdit(category)}
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setCategoryToDelete(category);
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
      )}

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir categoria</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a categoria{' '}
              <strong>{categoryToDelete?.name}</strong>?
              <br />
              Esta ação não pode ser desfeita.
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

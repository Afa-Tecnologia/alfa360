'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Category } from '@/stores/categoryStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Filter,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  ArrowUpDown,
  Layers,
  CheckCircle2,
  XCircle,
  Loader2,
  ListFilter,
  LayoutGrid,
} from 'lucide-react';
import { categoryService } from '@/lib/services/CategoryService';
import { useToast } from '@/components/ui/use-toast';
import { CategoryStatsCard } from './category-stats-card';

interface CategoriasDashboardProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onRefresh: () => void;
}

export function CategoriasDashboard({
  categories,
  onEdit,
  onRefresh,
}: CategoriasDashboardProps) {
  const [search, setSearch] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'created_at' | 'active'>(
    'name'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const { toast } = useToast();

  // Filtrar categorias com base na pesquisa
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(search.toLowerCase()) ||
      category.description.toLowerCase().includes(search.toLowerCase())
  );

  // Ordenar categorias
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'created_at') {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      // Sort by active status
      return sortOrder === 'asc'
        ? (a.active ? 1 : 0) - (b.active ? 1 : 0)
        : (b.active ? 1 : 0) - (a.active ? 1 : 0);
    }
  });

  // Contadores para estatísticas
  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.active).length;
  const inactiveCategories = categories.filter((c) => !c.active).length;

  // Função para alternar a ordenação
  const toggleSort = (field: 'name' | 'created_at' | 'active') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Função para confirmar exclusão
  const handleDelete = async () => {
    if (categoryToDelete) {
      try {
        setIsDeleting(true);
        await categoryService.deleteCategory(categoryToDelete.id);

        setShowDeleteDialog(false);
        setCategoryToDelete(null);
        onRefresh();

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

  // Renderizar visualização de grid
  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedCategories.map((category) => (
        <Card key={category.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{category.name}</CardTitle>
              {category.active ? (
                <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/20">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Ativo
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-orange-600 border-orange-600"
                >
                  <XCircle className="mr-1 h-3 w-3" />
                  Inativo
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {category.description || 'Sem descrição'}
            </p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onEdit(category)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-600 hover:bg-red-50"
              onClick={() => {
                setCategoryToDelete(category);
                setShowDeleteDialog(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  // Renderizar visualização de tabela
  const renderTableView = () => (
    <div className="rounded-md border">
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="[&_th]:px-4 [&_th]:py-3 [&_th]:font-medium [&_th]:text-left">
              <th>Nome</th>
              <th className="hidden sm:table-cell">Descrição</th>
              <th>Status</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sortedCategories.map((category) => (
              <tr
                key={category.id}
                className="[&_td]:px-4 [&_td]:py-3 hover:bg-muted/30"
              >
                <td className="font-medium">{category.name}</td>
                <td className="hidden sm:table-cell max-w-[400px] truncate">
                  {category.description}
                </td>
                <td>
                  {category.active ? (
                    <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/20">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Ativo
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-orange-600 border-orange-600"
                    >
                      <XCircle className="mr-1 h-3 w-3" />
                      Inativo
                    </Badge>
                  )}
                </td>
                <td className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(category)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          setCategoryToDelete(category);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Excluir</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <CategoryStatsCard
          title="Total de Categorias"
          value={totalCategories}
          icon={<Layers className="h-5 w-5" />}
          description="Total de categorias cadastradas"
        />
        <CategoryStatsCard
          title="Categorias Ativas"
          value={activeCategories}
          icon={<CheckCircle2 className="h-5 w-5" />}
          description="Categorias em uso na loja"
          variant="success"
        />
        <CategoryStatsCard
          title="Categorias Inativas"
          value={inactiveCategories}
          icon={<XCircle className="h-5 w-5" />}
          description="Categorias desativadas"
          variant="warning"
        />
      </div>

      {/* Listagem de categorias */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorias</CardTitle>
          <CardDescription>
            Gerencie todas as categorias de produtos da sua loja
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Barra de busca e filtros */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar categorias..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">Ordenar</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => toggleSort('name')}>
                      <span>Nome</span>
                      {sortBy === 'name' && (
                        <ArrowUpDown className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleSort('created_at')}>
                      <span>Data de Criação</span>
                      {sortBy === 'created_at' && (
                        <ArrowUpDown className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleSort('active')}>
                      <span>Status</span>
                      {sortBy === 'active' && (
                        <ArrowUpDown className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Botões para alternar visualização */}
                <div className="flex rounded-md border overflow-hidden">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="icon"
                    className="rounded-none h-9 w-9 border-0"
                    onClick={() => setViewMode('table')}
                  >
                    <ListFilter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    className="rounded-none h-9 w-9 border-0"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Lista de categorias - vazia ou com dados */}
            {sortedCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Layers className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">
                  Nenhuma categoria encontrada
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {search
                    ? 'Tente usar termos diferentes para a busca.'
                    : 'Comece criando uma nova categoria.'}
                </p>
              </div>
            ) : viewMode === 'table' ? (
              renderTableView()
            ) : (
              renderGridView()
            )}
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria{' '}
              <strong>{categoryToDelete?.name}</strong>?
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

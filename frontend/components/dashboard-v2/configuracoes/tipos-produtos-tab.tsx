'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useConfiguracaoStore } from '@/stores/configuracaoStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  Package,
  Edit,
  Loader2,
  MoreVertical,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { TipoDeProduto } from '@/types/configuracoes';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

export function TiposDeProdutosTab() {
  const { toast } = useToast();
  const {
    tiposDeProdutos,
    loadingTiposDeProdutos,
    errorTiposDeProdutos,
    fetchTiposDeProdutos,
    createTipoDeProduto,
    updateTipoDeProduto,
    deleteTipoDeProduto,
  } = useConfiguracaoStore();

  const [search, setSearch] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [currentTipoDeProduto, setCurrentTipoDeProduto] =
    useState<TipoDeProduto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formState, setFormState] = useState({
    nome: '',
    descricao: '',
    ativo: true,
  });

  // Buscar dados ao carregar o componente
  useEffect(() => {
    fetchTiposDeProdutos();
  }, [fetchTiposDeProdutos]);

  // Filtrar tipos de produtos com base na pesquisa
  const tiposDeProdutosFiltrados = tiposDeProdutos.filter(
    (tipo) =>
      tipo.nome.toLowerCase().includes(search.toLowerCase()) ||
      tipo.descricao.toLowerCase().includes(search.toLowerCase())
  );

  // Abrir diálogo para criar novo tipo de produto
  const handleOpenCreateDialog = () => {
    setCurrentTipoDeProduto(null);
    setFormState({
      nome: '',
      descricao: '',
      ativo: true,
    });
    setIsFormDialogOpen(true);
  };

  // Abrir diálogo para editar tipo de produto
  const handleOpenEditDialog = (tipo: TipoDeProduto) => {
    setCurrentTipoDeProduto(tipo);
    setFormState({
      nome: tipo.nome,
      descricao: tipo.descricao,
      ativo: tipo.ativo,
    });
    setIsFormDialogOpen(true);
  };

  // Abrir diálogo para confirmar exclusão
  const handleConfirmDelete = (tipo: TipoDeProduto) => {
    setCurrentTipoDeProduto(tipo);
    setIsDeleteDialogOpen(true);
  };

  // Atualizar o form state
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Atualizar o switch de ativo
  const handleAtivoChange = (checked: boolean) => {
    setFormState((prev) => ({
      ...prev,
      ativo: checked,
    }));
  };

  // Salvar tipo de produto (criar ou atualizar)
  const handleSaveTipoDeProduto = async () => {
    if (!formState.nome.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'O nome do tipo de produto é obrigatório.',
        variant: 'destructive',
      });
      return;
    }

    if (!formState.descricao.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'A descrição do tipo de produto é obrigatória.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (currentTipoDeProduto) {
        // Editar existente
        await updateTipoDeProduto(currentTipoDeProduto.id, formState);
        toast({
          title: 'Tipo de produto atualizado',
          description: 'O tipo de produto foi atualizado com sucesso.',
        });
      } else {
        // Criar novo
        await createTipoDeProduto(formState);
        toast({
          title: 'Tipo de produto criado',
          description: 'O tipo de produto foi criado com sucesso.',
        });
      }

      setIsFormDialogOpen(false);
      setCurrentTipoDeProduto(null);
    } catch (error) {
      console.error('Erro ao salvar tipo de produto:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o tipo de produto.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Excluir tipo de produto
  const handleDeleteTipoDeProduto = async () => {
    if (!currentTipoDeProduto) return;

    setIsSubmitting(true);

    try {
      await deleteTipoDeProduto(currentTipoDeProduto.id);
      toast({
        title: 'Tipo de produto excluído',
        description: 'O tipo de produto foi excluído com sucesso.',
      });
      setIsDeleteDialogOpen(false);
      setCurrentTipoDeProduto(null);
    } catch (error) {
      console.error('Erro ao excluir tipo de produto:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao excluir o tipo de produto.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar loading state
  if (loadingTiposDeProdutos && tiposDeProdutos.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  // Renderizar error state
  if (errorTiposDeProdutos) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription className="flex justify-between items-center">
          <span>{errorTiposDeProdutos}</span>
          <Button variant="outline" size="sm" onClick={fetchTiposDeProdutos}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho com botão de pesquisa e adicionar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar tipo de produto..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={handleOpenCreateDialog} className="flex-shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Novo Tipo de Produto
        </Button>
      </div>

      {/* Tabela de tipos de produtos */}
      {tiposDeProdutosFiltrados.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">
                  Descrição
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">
                  Criado em
                </TableHead>
                <TableHead className="w-[80px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiposDeProdutosFiltrados.map((tipo) => (
                <TableRow key={tipo.id}>
                  <TableCell className="font-medium">{tipo.nome}</TableCell>
                  <TableCell className="hidden md:table-cell truncate max-w-[300px]">
                    {tipo.descricao}
                  </TableCell>
                  <TableCell>
                    {tipo.ativo ? (
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
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {tipo.created_at ? formatDate(tipo.created_at) : '-'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleOpenEditDialog(tipo)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleConfirmDelete(tipo)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 border rounded-md bg-muted/10">
          <Package className="h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium">
            Nenhum tipo de produto encontrado
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {search
              ? 'Tente ajustar sua pesquisa para encontrar o que você está procurando.'
              : 'Crie seu primeiro tipo de produto para começar.'}
          </p>
          {search && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearch('')}
            >
              Limpar pesquisa
            </Button>
          )}
          {!search && (
            <Button className="mt-4" onClick={handleOpenCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Tipo de Produto
            </Button>
          )}
        </div>
      )}

      {/* Diálogo de criação/edição */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentTipoDeProduto
                ? 'Editar Tipo de Produto'
                : 'Novo Tipo de Produto'}
            </DialogTitle>
            <DialogDescription>
              {currentTipoDeProduto
                ? 'Altere as informações do tipo de produto existente.'
                : 'Adicione um novo tipo de produto ao sistema.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                name="nome"
                value={formState.nome}
                onChange={handleFormChange}
                placeholder="Digite o nome do tipo de produto"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                name="descricao"
                value={formState.descricao}
                onChange={handleFormChange}
                placeholder="Digite a descrição do tipo de produto"
                className="min-h-24 resize-none"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="ativo"
                checked={formState.ativo}
                onCheckedChange={handleAtivoChange}
              />
              <Label htmlFor="ativo">Ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFormDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveTipoDeProduto} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {currentTipoDeProduto ? 'Atualizando...' : 'Criando...'}
                </>
              ) : currentTipoDeProduto ? (
                'Salvar Alterações'
              ) : (
                'Criar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o tipo de produto &quot;
              {currentTipoDeProduto?.nome}&quot;? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteTipoDeProduto();
              }}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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

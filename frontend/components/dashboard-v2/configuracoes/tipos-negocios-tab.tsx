'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useConfiguracaoStore } from '@/stores/configuracaoStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import {
  AlertCircle,
  Building2,
  Edit,
  Loader2,
  MoreVertical,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
} from 'lucide-react';
import { TipoDeNegocio } from '@/types/configuracoes';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

export function TiposDeNegociosTab() {
  const { toast } = useToast();
  const {
    tiposDeNegocios,
    loadingTiposDeNegocios,
    errorTiposDeNegocios,
    fetchTiposDeNegocios,
    createTipoDeNegocio,
    updateTipoDeNegocio,
    deleteTipoDeNegocio,
  } = useConfiguracaoStore();

  const [search, setSearch] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [currentTipoDeNegocio, setCurrentTipoDeNegocio] =
    useState<TipoDeNegocio | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nomeTipo, setNomeTipo] = useState('');

  // Buscar dados ao carregar o componente
  useEffect(() => {
    fetchTiposDeNegocios();
  }, [fetchTiposDeNegocios]);

  // Filtrar tipos de negócios com base na pesquisa
  const tiposDeNegociosFiltrados = tiposDeNegocios.filter((tipo) =>
    tipo.nome.toLowerCase().includes(search.toLowerCase())
  );

  // Abrir diálogo para criar novo tipo de negócio
  const handleOpenCreateDialog = () => {
    setCurrentTipoDeNegocio(null);
    setNomeTipo('');
    setIsFormDialogOpen(true);
  };

  // Abrir diálogo para editar tipo de negócio
  const handleOpenEditDialog = (tipo: TipoDeNegocio) => {
    setCurrentTipoDeNegocio(tipo);
    setNomeTipo(tipo.nome);
    setIsFormDialogOpen(true);
  };

  // Abrir diálogo para confirmar exclusão
  const handleConfirmDelete = (tipo: TipoDeNegocio) => {
    setCurrentTipoDeNegocio(tipo);
    setIsDeleteDialogOpen(true);
  };

  // Salvar tipo de negócio (criar ou atualizar)
  const handleSaveTipoDeNegocio = async () => {
    if (!nomeTipo.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'O nome do tipo de negócio é obrigatório.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (currentTipoDeNegocio) {
        // Editar existente
        await updateTipoDeNegocio(currentTipoDeNegocio.id, { nome: nomeTipo });
        toast({
          title: 'Tipo de negócio atualizado',
          description: 'O tipo de negócio foi atualizado com sucesso.',
        });
      } else {
        // Criar novo
        await createTipoDeNegocio({ nome: nomeTipo });
        toast({
          title: 'Tipo de negócio criado',
          description: 'O tipo de negócio foi criado com sucesso.',
        });
      }

      setIsFormDialogOpen(false);
      setNomeTipo('');
      setCurrentTipoDeNegocio(null);
    } catch (error) {
      console.error('Erro ao salvar tipo de negócio:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o tipo de negócio.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Excluir tipo de negócio
  const handleDeleteTipoDeNegocio = async () => {
    if (!currentTipoDeNegocio) return;

    setIsSubmitting(true);

    try {
      await deleteTipoDeNegocio(currentTipoDeNegocio.id);
      toast({
        title: 'Tipo de negócio excluído',
        description: 'O tipo de negócio foi excluído com sucesso.',
      });
      setIsDeleteDialogOpen(false);
      setCurrentTipoDeNegocio(null);
    } catch (error) {
      console.error('Erro ao excluir tipo de negócio:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao excluir o tipo de negócio.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar loading state
  if (loadingTiposDeNegocios && tiposDeNegocios.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  // Renderizar error state
  if (errorTiposDeNegocios) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription className="flex justify-between items-center">
          <span>{errorTiposDeNegocios}</span>
          <Button variant="outline" size="sm" onClick={fetchTiposDeNegocios}>
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
            placeholder="Buscar tipo de negócio..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={handleOpenCreateDialog} className="flex-shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Novo Tipo de Negócio
        </Button>
      </div>

      {/* Tabela de tipos de negócios */}
      {tiposDeNegociosFiltrados.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">
                  Criado em
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Atualizado em
                </TableHead>
                <TableHead className="w-[80px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiposDeNegociosFiltrados.map((tipo) => (
                <TableRow key={tipo.id}>
                  <TableCell className="font-medium">{tipo.nome}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {tipo.created_at ? formatDate(tipo.created_at) : '-'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {tipo.updated_at ? formatDate(tipo.updated_at) : '-'}
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
          <Building2 className="h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium">
            Nenhum tipo de negócio encontrado
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {search
              ? 'Tente ajustar sua pesquisa para encontrar o que você está procurando.'
              : 'Crie seu primeiro tipo de negócio para começar.'}
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
              Criar Tipo de Negócio
            </Button>
          )}
        </div>
      )}

      {/* Diálogo de criação/edição */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentTipoDeNegocio
                ? 'Editar Tipo de Negócio'
                : 'Novo Tipo de Negócio'}
            </DialogTitle>
            <DialogDescription>
              {currentTipoDeNegocio
                ? 'Altere as informações do tipo de negócio existente.'
                : 'Adicione um novo tipo de negócio ao sistema.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={nomeTipo}
                onChange={(e) => setNomeTipo(e.target.value)}
                placeholder="Digite o nome do tipo de negócio"
              />
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
            <Button onClick={handleSaveTipoDeNegocio} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {currentTipoDeNegocio ? 'Atualizando...' : 'Criando...'}
                </>
              ) : currentTipoDeNegocio ? (
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
              Tem certeza que deseja excluir o tipo de negócio &quot;
              {currentTipoDeNegocio?.nome}&quot;? Esta ação não pode ser
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
                handleDeleteTipoDeNegocio();
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

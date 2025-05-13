'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  Edit,
  Loader2,
  MoreVertical,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  CreditCard,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import {
  PaymentMethod,
  usePaymentMethodStore,
} from '@/stores/paymentMethodStore';

export function MetodosPagamentoTab() {
  const { toast } = useToast();
  const {
    paymentMethods,
    isLoading,
    fetchPaymentMethods,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
  } = usePaymentMethodStore();

  const [search, setSearch] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [currentPaymentMethod, setCurrentPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formState, setFormState] = useState({
    name: '',
    code: '',
  });

  // Buscar dados ao carregar o componente
  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  // Filtrar métodos de pagamento com base na pesquisa
  const filteredPaymentMethods = paymentMethods.filter(
    (method) =>
      method.name.toLowerCase().includes(search.toLowerCase()) ||
      method.code.toLowerCase().includes(search.toLowerCase())
  );

  // Abrir diálogo para criar novo método de pagamento
  const handleOpenCreateDialog = () => {
    setCurrentPaymentMethod(null);
    setFormState({
      name: '',
      code: '',
    });
    setIsFormDialogOpen(true);
  };

  // Abrir diálogo para editar método de pagamento
  const handleOpenEditDialog = (method: PaymentMethod) => {
    setCurrentPaymentMethod(method);
    setFormState({
      name: method.name,
      code: method.code,
    });
    setIsFormDialogOpen(true);
  };

  // Abrir diálogo para confirmar exclusão
  const handleConfirmDelete = (method: PaymentMethod) => {
    setCurrentPaymentMethod(method);
    setIsDeleteDialogOpen(true);
  };

  // Atualizar o form state
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Salvar método de pagamento (criar ou atualizar)
  const handleSavePaymentMethod = async () => {
    if (!formState.name.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'O nome do método de pagamento é obrigatório.',
        variant: 'destructive',
      });
      return;
    }

    if (!formState.code.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'O código do método de pagamento é obrigatório.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (currentPaymentMethod) {
        // Editar existente
        await updatePaymentMethod(currentPaymentMethod.id, formState);
        toast({
          title: 'Método de pagamento atualizado',
          description: 'O método de pagamento foi atualizado com sucesso.',
        });
      } else {
        // Criar novo
        await addPaymentMethod(formState);
        toast({
          title: 'Método de pagamento criado',
          description: 'O método de pagamento foi criado com sucesso.',
        });
      }

      setIsFormDialogOpen(false);
      setCurrentPaymentMethod(null);
      fetchPaymentMethods();
    } catch (error) {
      console.error('Erro ao salvar método de pagamento:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o método de pagamento.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Excluir método de pagamento
  const handleDeletePaymentMethod = async () => {
    if (!currentPaymentMethod) return;

    setIsSubmitting(true);

    try {
      await deletePaymentMethod(currentPaymentMethod.id);
      toast({
        title: 'Método de pagamento excluído',
        description: 'O método de pagamento foi excluído com sucesso.',
      });
      setIsDeleteDialogOpen(false);
      setCurrentPaymentMethod(null);
    } catch (error) {
      console.error('Erro ao excluir método de pagamento:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao excluir o método de pagamento.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar loading state
  if (isLoading && paymentMethods.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-[300px] w-full" />
      </div>
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
            placeholder="Buscar método de pagamento..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={handleOpenCreateDialog} className="flex-shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Novo Método de Pagamento
        </Button>
      </div>

      {/* Tabela de métodos de pagamento */}
      {filteredPaymentMethods.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Código</TableHead>
                <TableHead className="hidden md:table-cell">
                  Criado em
                </TableHead>
                <TableHead className="w-[80px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPaymentMethods.map((method) => (
                <TableRow key={method.id}>
                  <TableCell className="font-medium">{method.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{method.code}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {method.created_at ? formatDate(method.created_at) : '-'}
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
                          onClick={() => handleOpenEditDialog(method)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleConfirmDelete(method)}
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
          <CreditCard className="h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium">
            Nenhum método de pagamento encontrado
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {search
              ? 'Tente ajustar sua pesquisa para encontrar o que você está procurando.'
              : 'Crie seu primeiro método de pagamento para começar.'}
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
              Criar Método de Pagamento
            </Button>
          )}
        </div>
      )}

      {/* Diálogo de criação/edição */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentPaymentMethod
                ? 'Editar Método de Pagamento'
                : 'Novo Método de Pagamento'}
            </DialogTitle>
            <DialogDescription>
              {currentPaymentMethod
                ? 'Altere as informações do método de pagamento existente.'
                : 'Adicione um novo método de pagamento ao sistema.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={formState.name}
                onChange={handleFormChange}
                placeholder="Digite o nome do método de pagamento"
              />
              <p className="text-xs text-muted-foreground">
                Ex: Dinheiro, Cartão de Crédito, PIX
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                name="code"
                value={formState.code}
                onChange={handleFormChange}
                placeholder="Digite o código do método de pagamento"
              />
              <p className="text-xs text-muted-foreground">
                Um código único para identificar o método (ex: MONEY,
                CREDIT_CARD, PIX)
              </p>
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
            <Button onClick={handleSavePaymentMethod} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {currentPaymentMethod ? 'Atualizando...' : 'Criando...'}
                </>
              ) : currentPaymentMethod ? (
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
              Tem certeza que deseja excluir o método de pagamento &quot;
              {currentPaymentMethod?.name}&quot;? Esta ação não pode ser
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
                handleDeletePaymentMethod();
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

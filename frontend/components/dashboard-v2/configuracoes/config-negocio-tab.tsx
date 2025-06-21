'use client';

import { useState, useEffect } from 'react';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertCircle,
  Store,
  Edit,
  Loader2,
  MoreVertical,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import { ConfigDoNegocio } from '@/types/configuracoes';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

export function ConfigDoNegocioTab() {
  const { toast } = useToast();
  const {
    configuracoesDoNegocio,
    loadingConfiguracoesDoNegocio,
    errorConfiguracoesDoNegocio,
    fetchConfiguracoesDoNegocio,
    createConfiguracaoDoNegocio,
    updateConfiguracaoDoNegocio,
    deleteConfiguracaoDoNegocio,
    tiposDeNegocios,
    fetchTiposDeNegocios,
  } = useConfiguracaoStore();

  const [search, setSearch] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [currentConfigDoNegocio, setCurrentConfigDoNegocio] =
    useState<ConfigDoNegocio | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formState, setFormState] = useState({
    nome: '',
    logo_url: '',
    tipos_de_negocios_id: '',
  });

  // Buscar dados ao carregar o componente
  useEffect(() => {
    fetchConfiguracoesDoNegocio();
    fetchTiposDeNegocios();
  }, [fetchConfiguracoesDoNegocio, fetchTiposDeNegocios]);

  // Filtrar configurações de negócio com base na pesquisa
  const configuracoesDoNegocioFiltradas = configuracoesDoNegocio.filter(
    (config) => config.nome.toLowerCase().includes(search.toLowerCase())
  );

  // Abrir diálogo para criar nova configuração
  const handleOpenCreateDialog = () => {
    setCurrentConfigDoNegocio(null);
    setFormState({
      nome: '',
      logo_url: '',
      tipos_de_negocios_id: '',
    });
    setIsFormDialogOpen(true);
  };

  // Abrir diálogo para editar configuração
  const handleOpenEditDialog = (config: ConfigDoNegocio) => {
    setCurrentConfigDoNegocio(config);
    setFormState({
      nome: config.nome,
      logo_url: config.logo_url || '',
      tipos_de_negocios_id: config.tipos_de_negocios_id.toString(),
    });
    setIsFormDialogOpen(true);
  };

  // Abrir diálogo para confirmar exclusão
  const handleConfirmDelete = (config: ConfigDoNegocio) => {
    setCurrentConfigDoNegocio(config);
    setIsDeleteDialogOpen(true);
  };

  // Atualizar o form state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Atualizar o tipo de negócio selecionado
  const handleTipoNegocioChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      tipos_de_negocios_id: value,
    }));
  };

  // Salvar configuração do negócio (criar ou atualizar)
  const handleSaveConfigDoNegocio = async () => {
    if (!formState.nome.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'O nome da configuração do negócio é obrigatório.',
        variant: 'destructive',
      });
      return;
    }

    if (!formState.tipos_de_negocios_id) {
      toast({
        title: 'Campo obrigatório',
        description: 'O tipo de negócio é obrigatório.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const dataToSend = {
      ...formState,
      tipos_de_negocios_id: parseInt(formState.tipos_de_negocios_id),
    };

    try {
      if (currentConfigDoNegocio) {
        // Editar existente
        await updateConfiguracaoDoNegocio(
          currentConfigDoNegocio.id,
          dataToSend
        );
        toast({
          title: 'Configuração atualizada',
          description: 'A configuração do negócio foi atualizada com sucesso.',
        });
      } else {
        // Criar novo
        await createConfiguracaoDoNegocio(dataToSend);
        toast({
          title: 'Configuração criada',
          description: 'A configuração do negócio foi criada com sucesso.',
        });
      }

      setIsFormDialogOpen(false);
      setCurrentConfigDoNegocio(null);
    } catch (error) {
      console.error('Erro ao salvar configuração do negócio:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar a configuração do negócio.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Excluir configuração do negócio
  const handleDeleteConfigDoNegocio = async () => {
    if (!currentConfigDoNegocio) return;

    setIsSubmitting(true);

    try {
      await deleteConfiguracaoDoNegocio(currentConfigDoNegocio.id);
      toast({
        title: 'Configuração excluída',
        description: 'A configuração do negócio foi excluída com sucesso.',
      });
      setIsDeleteDialogOpen(false);
      setCurrentConfigDoNegocio(null);
    } catch (error) {
      console.error('Erro ao excluir configuração do negócio:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao excluir a configuração do negócio.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Encontrar o nome do tipo de negócio pelo ID
  const getTipoDeNegocioNome = (id: number) => {
    const tipo = tiposDeNegocios.find((tipo) => tipo.id === id);
    return tipo ? tipo.nome : 'Não especificado';
  };

  // Renderizar loading state
  if (loadingConfiguracoesDoNegocio && configuracoesDoNegocio.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  // Renderizar error state
  if (errorConfiguracoesDoNegocio) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription className="flex justify-between items-center">
          <span>{errorConfiguracoesDoNegocio}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchConfiguracoesDoNegocio}
          >
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
            placeholder="Buscar configuração..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={handleOpenCreateDialog} className="flex-shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Nova Configuração
        </Button>
      </div>

      {/* Tabela de configurações do negócio */}
      {configuracoesDoNegocioFiltradas.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo de Negócio</TableHead>
                <TableHead className="hidden md:table-cell">Logo</TableHead>
                <TableHead className="hidden md:table-cell">
                  Criado em
                </TableHead>
                <TableHead className="w-[80px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configuracoesDoNegocioFiltradas.map((config) => (
                <TableRow key={config.id}>
                  <TableCell className="font-medium">{config.nome}</TableCell>
                  <TableCell>
                    {getTipoDeNegocioNome(config.tipos_de_negocios_id)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {config.logo_url ? (
                      <div className="w-8 h-8 bg-muted rounded-md overflow-hidden">
                        <img
                          src={config.logo_url}
                          alt={`Logo ${config.nome}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        Sem logo
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {config.created_at ? formatDate(config.created_at) : '-'}
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
                          onClick={() => handleOpenEditDialog(config)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleConfirmDelete(config)}
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
          <Store className="h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium">
            Nenhuma configuração de negócio encontrada
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {search
              ? 'Tente ajustar sua pesquisa para encontrar o que você está procurando.'
              : 'Crie sua primeira configuração de negócio para começar.'}
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
              Criar Configuração
            </Button>
          )}
        </div>
      )}

      {/* Diálogo de criação/edição */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentConfigDoNegocio
                ? 'Editar Configuração'
                : 'Nova Configuração de Negócio'}
            </DialogTitle>
            <DialogDescription>
              {currentConfigDoNegocio
                ? 'Altere as informações da configuração de negócio existente.'
                : 'Adicione uma nova configuração de negócio ao sistema.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                name="nome"
                value={formState.nome}
                onChange={handleInputChange}
                placeholder="Digite o nome da configuração"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipos_de_negocios_id">Tipo de Negócio</Label>
              <Select
                value={formState.tipos_de_negocios_id}
                onValueChange={handleTipoNegocioChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tipo de negócio" />
                </SelectTrigger>
                <SelectContent>
                  {tiposDeNegocios.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                      {tipo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo_url">URL do Logo</Label>
              <div className="flex gap-2">
                <Input
                  id="logo_url"
                  name="logo_url"
                  value={formState.logo_url}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/logo.png"
                />
                <Button variant="outline" size="icon" disabled type="button">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Insira a URL da imagem de logo do seu negócio
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
            <Button onClick={handleSaveConfigDoNegocio} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {currentConfigDoNegocio ? 'Atualizando...' : 'Criando...'}
                </>
              ) : currentConfigDoNegocio ? (
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
              Tem certeza que deseja excluir a configuração &quot;
              {currentConfigDoNegocio?.nome}&quot;? Esta ação não pode ser
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
                handleDeleteConfigDoNegocio();
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

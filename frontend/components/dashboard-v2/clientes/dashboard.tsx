'use client';

import { useState } from 'react';
import { Customer } from '@/stores/customer-store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Users,
  User as UserIcon,
  Calendar,
  Mail,
  Phone,
  Eye,
  Loader2,
  ListFilter,
  LayoutGrid,
  ShoppingBag,
  CreditCard,
} from 'lucide-react';
import CustomerService from '@/services/clientes/CustomerServices';
import { useToast } from '@/components/ui/use-toast';
import { ClientStatsCard } from './client-stats-card';
import { ClientDetailsDialog } from './client-details-dialog';
import { formatDate } from '@/components/pages/clientes/format-date';
import { formatCurrency } from '@/components/pages/clientes/format-currency';

interface ClientesDashboardProps {
  clients: Customer[];
  onEdit: (client: Customer) => void;
  onRefresh: () => void;
}

export function ClientesDashboard({
  clients,
  onEdit,
  onRefresh,
}: ClientesDashboardProps) {
  const [search, setSearch] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Customer | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [clientToView, setClientToView] = useState<Customer | null>(null);
  const [sortBy, setSortBy] = useState<
    'name' | 'created_at' | 'orders_count' | 'total_spent'
  >('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [cpfFilter, setCpfFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const { toast } = useToast();

  // Filtrar clientes com base na pesquisa e nos filtros de CPF e email
  const filteredClients = clients.filter((client) => {
    const searchMatch =
      `${client.name} ${client.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase());

    const cpfMatch = cpfFilter ? client.cpf.includes(cpfFilter) : true;
    const emailMatch = emailFilter
      ? client.email.toLowerCase().includes(emailFilter.toLowerCase())
      : true;

    return searchMatch && cpfMatch && emailMatch;
  });

  // Ordenar clientes
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortBy === 'name') {
      const nameA = `${a.name} ${a.last_name}`;
      const nameB = `${b.name} ${b.last_name}`;
      return sortOrder === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    } else if (sortBy === 'created_at') {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortBy === 'orders_count') {
      const countA = a.orders_count || 0;
      const countB = b.orders_count || 0;
      return sortOrder === 'asc' ? countA - countB : countB - countA;
    } else {
      // total_spent
      const spentA = a.total_spent || 0;
      const spentB = b.total_spent || 0;
      return sortOrder === 'asc' ? spentA - spentB : spentB - spentA;
    }
  });

  // Estatísticas para os cards
  const totalClients = clients.length;
  const activeClients = clients.filter(
    (c) => c.orders_count && c.orders_count > 0
  ).length;
  const totalOrders = clients.reduce(
    (sum, client) => sum + (client.orders_count || 0),
    0
  );
  const totalRevenue = clients.reduce(
    (sum, client) => sum + (client.total_spent || 0),
    0
  );

  // Função para alternar a ordenação
  const toggleSort = (
    field: 'name' | 'created_at' | 'orders_count' | 'total_spent'
  ) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Função para confirmar exclusão
  const handleDelete = async () => {
    if (clientToDelete) {
      try {
        setIsDeleting(true);
        await CustomerService.deleteClient(clientToDelete.id);

        setShowDeleteDialog(false);
        setClientToDelete(null);
        onRefresh();

        toast({
          title: 'Cliente excluído',
          description: 'O cliente foi excluído com sucesso.',
        });
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao excluir o cliente.',
          variant: 'destructive',
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Função para visualizar detalhes do cliente
  const handleViewDetails = (client: Customer) => {
    setClientToView(client);
    setShowDetailsDialog(true);
  };

  // Atualizar filtros
  const handleApplyFilters = (cpf: string, email: string) => {
    setCpfFilter(cpf);
    setEmailFilter(email);
  };

  // Renderizar visualização de grid
  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedClients.map((client) => (
        <Card key={client.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">
                {client.name} {client.last_name}
              </CardTitle>
              {(client.orders_count || 0) > 0 ? (
                <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/20">
                  <ShoppingBag className="mr-1 h-3 w-3" />
                  Cliente Ativo
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  Sem Compras
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground truncate">
                  {client.email}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{client.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {formatDate(client.date_of_birth)}
                </span>
              </div>

              {(client.orders_count !== undefined ||
                client.total_spent !== undefined) && (
                <div className="grid grid-cols-2 gap-3 pt-2 mt-2 border-t">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Pedidos</div>
                    <div className="font-medium">
                      {client.orders_count || 0}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Total</div>
                    <div className="font-medium">
                      {formatCurrency(client.total_spent || 0)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <div className="flex justify-end gap-2 p-4 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleViewDetails(client)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onEdit(client)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-600 hover:bg-red-50"
              onClick={() => {
                setClientToDelete(client);
                setShowDeleteDialog(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
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
              <th className="hidden sm:table-cell">CPF</th>
              <th className="hidden md:table-cell">Contato</th>
              <th className="hidden md:table-cell">Data de Nascimento</th>
              <th className="text-center">Pedidos</th>
              <th className="text-right">Valor Gasto</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sortedClients.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Nenhum cliente encontrado
                </td>
              </tr>
            ) : (
              sortedClients.map((client) => (
                <tr
                  key={client.id}
                  className="[&_td]:px-4 [&_td]:py-3 hover:bg-muted/30"
                >
                  <td className="font-medium">
                    <div>
                      {client.name} {client.last_name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      #{client.id}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell">{client.cpf}</td>
                  <td className="hidden md:table-cell">
                    <div>{client.email}</div>
                    <div className="text-xs text-muted-foreground">
                      {client.phone}
                    </div>
                  </td>
                  <td className="hidden md:table-cell">
                    {formatDate(client.date_of_birth)}
                  </td>
                  <td className="text-center">{client.orders_count || 0}</td>
                  <td className="text-right">
                    {formatCurrency(client.total_spent || 0)}
                  </td>
                  <td className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(client)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Ver detalhes</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(client)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setClientToDelete(client);
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        <ClientStatsCard
          title="Total de Clientes"
          value={totalClients}
          icon={<Users className="h-5 w-5" />}
          description="Total de clientes cadastrados"
        />
        <ClientStatsCard
          title="Clientes Ativos"
          value={activeClients}
          icon={<UserIcon className="h-5 w-5" />}
          description="Clientes com compras realizadas"
          variant="success"
        />
        <ClientStatsCard
          title="Total de Pedidos"
          value={totalOrders}
          icon={<ShoppingBag className="h-5 w-5" />}
          description="Pedidos de todos os clientes"
          variant="blue"
        />
        <ClientStatsCard
          title="Receita Total"
          value={totalRevenue}
          icon={<CreditCard className="h-5 w-5" />}
          description="Valor em R$ de todas as compras"
          variant="purple"
        />
      </div>

      {/* Listagem de clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Gerencie os clientes cadastrados em sua loja
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Barra de busca e filtros */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar clientes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex gap-2">
                {/* Filtros */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">Filtrar</span>
                      {(cpfFilter || emailFilter) && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {cpfFilter && emailFilter ? '2' : '1'}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Filtros</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <div className="p-2">
                      <div className="space-y-2">
                        <label
                          className="text-xs font-medium"
                          htmlFor="cpf-filter"
                        >
                          CPF contém
                        </label>
                        <Input
                          id="cpf-filter"
                          value={cpfFilter}
                          onChange={(e) => setCpfFilter(e.target.value)}
                          placeholder="Filtrar por CPF"
                          className="h-8"
                        />
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    <div className="p-2">
                      <div className="space-y-2">
                        <label
                          className="text-xs font-medium"
                          htmlFor="email-filter"
                        >
                          Email contém
                        </label>
                        <Input
                          id="email-filter"
                          value={emailFilter}
                          onChange={(e) => setEmailFilter(e.target.value)}
                          placeholder="Filtrar por email"
                          className="h-8"
                        />
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    <div className="p-2 flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCpfFilter('');
                          setEmailFilter('');
                        }}
                        className="text-xs h-8"
                      >
                        Limpar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleApplyFilters(cpfFilter, emailFilter)
                        }
                        className="text-xs h-8"
                      >
                        Aplicar Filtros
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Ordenação */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <ArrowUpDown className="h-4 w-4" />
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
                      <span>Data de Cadastro</span>
                      {sortBy === 'created_at' && (
                        <ArrowUpDown className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => toggleSort('orders_count')}
                    >
                      <span>Número de Pedidos</span>
                      {sortBy === 'orders_count' && (
                        <ArrowUpDown className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleSort('total_spent')}>
                      <span>Valor Gasto</span>
                      {sortBy === 'total_spent' && (
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

            {/* Lista de clientes - tabela ou grid */}
            {viewMode === 'table' ? renderTableView() : renderGridView()}
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cliente</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cliente{' '}
              <strong>
                {clientToDelete?.name} {clientToDelete?.last_name}
              </strong>
              ?
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

      {/* Diálogo de detalhes do cliente */}
      {clientToView && (
        <ClientDetailsDialog
          client={clientToView}
          isOpen={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
        />
      )}
    </div>
  );
}

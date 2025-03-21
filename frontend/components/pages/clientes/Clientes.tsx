'use client';

import { useState } from 'react';
import { useCustomerStore, type Customer } from '@/stores/customer-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Mail,
  ShoppingBag,
  Edit,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CreateClient } from './modals/Create-Clients';
import { UpdateClient } from './modals/Update-Clients';

export default function ClientesPage() {
  const { customers, deleteCustomer, setCustomerStatus } = useCustomerStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  // Adicionar estados para o diálogo de filtro e opções de filtro
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    cpf: '',
    email: '',
  });

  // Modificar a função de filtro para buscar apenas por nome
  const filteredCustomers = customers.filter((customer) => {
    // Aplicar filtro de busca por nome
    const nameMatches = searchTerm
      ? `${customer.name} ${customer.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true;

    // Aplicar filtros adicionais se estiverem ativos
    const cpfMatches = filterOptions.cpf
      ? customer.cpf.includes(filterOptions.cpf)
      : true;
    const emailMatches = filterOptions.email
      ? customer.email.toLowerCase().includes(filterOptions.email.toLowerCase())
      : true;

    return nameMatches && cpfMatches && emailMatches;
  });

  const openEditDialog = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsViewDialogOpen(true);
  };

  const handleDeleteCustomer = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      deleteCustomer(id);
    }
  };

  const toggleCustomerStatus = (
    id: number,
    currentStatus: 'ativo' | 'inativo'
  ) => {
    setCustomerStatus(id, currentStatus === 'ativo' ? 'inativo' : 'ativo');
  };

  const formatCurrency = (value = 0) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  // Adicionar função para aplicar filtros
  const applyFilters = () => {
    setIsFilterDialogOpen(false);
  };

  // Adicionar função para limpar filtros
  const clearFilters = () => {
    setFilterOptions({
      cpf: '',
      email: '',
    });
    setIsFilterDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <p className="text-muted-foreground">
          Gerencie os clientes da sua loja.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFilterDialogOpen(true)}
            className={
              filterOptions.cpf || filterOptions.email ? 'bg-primary/10' : ''
            }
          >
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filtros</span>
          </Button>
          <CreateClient />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead className="text-center">Pedidos</TableHead>
              <TableHead className="text-right">Valor Gasto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    <div>
                      {customer.name} {customer.last_name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      #{customer.id}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{customer.email}</div>
                    <div className="text-xs text-muted-foreground">
                      {customer.phone}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(customer.created_at)}</TableCell>
                  <TableCell className="text-center">
                    {customer.orders_count || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(customer.total_spent)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`capitalize ${customer.status === 'ativo' ? 'bg-green-700' : 'bg-red-500'}`}
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Ações</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openViewDialog(customer)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Enviar e-mail
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Ver pedidos
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openEditDialog(customer)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            toggleCustomerStatus(customer.id, customer.status)
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {customer.status === 'ativo' ? 'Desativar' : 'Ativar'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog para editar o registro cliente */}
      <UpdateClient
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        customer={currentCustomer}
      />
      
      {/* Dialog para visualizar detalhes do cliente */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
            <DialogDescription>
              Informações completas do cliente.
            </DialogDescription>
          </DialogHeader>
          {currentCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Nome Completo
                  </h3>
                  <p>
                    {currentCustomer.name} {currentCustomer.last_name}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    CPF
                  </h3>
                  <p>{currentCustomer.cpf}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Email
                  </h3>
                  <p>{currentCustomer.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Telefone
                  </h3>
                  <p>{currentCustomer.phone}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Endereço
                </h3>
                <p>{currentCustomer.adress}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Cidade
                  </h3>
                  <p>{currentCustomer.city}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Estado
                  </h3>
                  <p>{currentCustomer.state}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    CEP
                  </h3>
                  <p>{currentCustomer.cep}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Data de Nascimento
                  </h3>
                  <p>{currentCustomer.date_of_birth}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Status
                  </h3>
                  <Badge
                    className={`capitalize ${currentCustomer.status === 'ativo' ? 'bg-green-700' : 'bg-red-500'}`}
                  >
                    {currentCustomer.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Data de Cadastro
                  </h3>
                  <p>{formatDate(currentCustomer.created_at)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Última Atualização
                  </h3>
                  <p>{formatDate(currentCustomer.updated_at)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Total de Pedidos
                  </h3>
                  <p>{currentCustomer.orders_count || 0}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Valor Total Gasto
                  </h3>
                  <p>{formatCurrency(currentCustomer.total_spent)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para filtros */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filtros</DialogTitle>
            <DialogDescription>
              Filtre os clientes por critérios específicos.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="filter-cpf">CPF</Label>
              <Input
                id="filter-cpf"
                placeholder="Filtrar por CPF"
                value={filterOptions.cpf}
                onChange={(e) =>
                  setFilterOptions({ ...filterOptions, cpf: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-email">Email</Label>
              <Input
                id="filter-email"
                placeholder="Filtrar por email"
                value={filterOptions.email}
                onChange={(e) =>
                  setFilterOptions({ ...filterOptions, email: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
            <Button onClick={applyFilters}>Aplicar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

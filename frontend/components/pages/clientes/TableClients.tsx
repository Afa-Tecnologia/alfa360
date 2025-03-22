import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Customer, useCustomerStore } from '@/stores/customer-store';
import { Edit, Eye, MoreVertical, ShoppingBag, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatDate } from './format-date';
import { formatCurrency } from './format-currency';
import { UpdateClient } from './modals/Update-Clients';
import { ViewDetails } from './modals/View-Details-Clients';
import { DeleteClient } from './modals/Delete-Client';
import { deleteClient } from '@/services/clientes/DeleteClient';

interface CustomersList {
  customers: Customer[];
}

export function TableViewClient({ customers }: CustomersList) {
  const [currentCustomers, setCurrentCustomers] = useState<Customer[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { deleteCustomer } = useCustomerStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    setCurrentCustomers(customers);
  }, [customers]);

  const openEditDialog = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsEditDialogOpen(true);
  };
  const handleDeleteCustomer = async (clientId: number) => {
    try {
      await deleteClient({ id: clientId });
      deleteCustomer(clientId);
    
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
    }
  };

  const openViewDialog = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Data de Nascimento</TableHead>
            <TableHead className="text-center">Pedidos</TableHead>
            <TableHead className="text-right">Valor Gasto</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentCustomers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Nenhum cliente encontrado
              </TableCell>
            </TableRow>
          ) : (
            currentCustomers.map((customer: Customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  <div>
                    {customer.name} {customer.last_name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    #{customer.id}
                  </div>
                </TableCell>
                <TableCell>{customer.cpf}</TableCell>
                <TableCell>
                  <div>{customer.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {customer.phone}
                  </div>
                </TableCell>
                <TableCell>{formatDate(customer.date_of_birth)}</TableCell>
                <TableCell className="text-center">
                  {customer.orders_count || 0}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(customer.total_spent)}
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
                        onClick={() => {
                          setCurrentCustomer(customer); // Define o cliente atual
                          setIsDeleteDialogOpen(true); // Abre o modal de confirmação
                        }}
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

      {/* Dialog para editar o cliente */}
      <UpdateClient
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        customer={currentCustomer}
      />

      {/* Dialog para visualizar detalhes do cliente */}
      <ViewDetails
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        customer={currentCustomer}
      />

      {/*  Dialog para Deletar o cliente */}
      <DeleteClient
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        clientId={currentCustomer?.id || 0}
        handleDelete={handleDeleteCustomer}
      />
    </div>
  );
}

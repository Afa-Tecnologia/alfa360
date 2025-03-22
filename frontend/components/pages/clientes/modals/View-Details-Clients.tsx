'use client'
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Customer } from '@/stores/customer-store';
import { useEffect, useState } from 'react';
import { formatDateTime } from '../format-data-time';
import { formatDate } from '../format-date';
import { formatCurrency } from '../format-currency';

interface ViewModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  customer: Customer | null;
}

export function ViewDetails({ open, onOpenChange , customer }: ViewModalProps) {
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(customer);

    useEffect(() => {
      setCurrentCustomer(customer);
    }, [customer]);


  return (
    <>
      {/* Dialog para visualizar detalhes do cliente */}
      <Dialog open={open} onOpenChange={onOpenChange}>
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
                  <p>{formatDate(currentCustomer.date_of_birth)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Data de Cadastro
                  </h3>
                  <p>{formatDateTime(currentCustomer?.created_at)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Última Atualização
                  </h3>
                  <p>{formatDateTime(currentCustomer?.updated_at)}</p>
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
            <DialogClose asChild>
              <Button>Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

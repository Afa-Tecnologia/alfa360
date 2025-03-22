'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Customer, useCustomerStore } from '@/stores/customer-store';
import { useEffect, useState } from 'react';

interface EditModalProps {
    open: boolean;
    onOpenChange: (isOpen: boolean) => void;
    customer: Customer | null;
  }
  
  
  export function UpdateClient({ open, onOpenChange, customer }: EditModalProps) {
  const {  updateCustomer } = useCustomerStore();
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(customer);
  
  useEffect(() => {
    setCurrentCustomer(customer);
  }, [customer]);

  const handleEditCustomer = () => {
    if (currentCustomer) {
      updateCustomer(currentCustomer.id, {
        name: currentCustomer.name,
        last_name: currentCustomer.last_name,
        email: currentCustomer.email,
        phone: currentCustomer.phone,
        cpf: currentCustomer.cpf,
        adress: currentCustomer.adress,
        city: currentCustomer.city,
        state: currentCustomer.state,
        cep: currentCustomer.cep,
        date_of_birth: currentCustomer.date_of_birth,
      });
      onOpenChange(false);
      setCurrentCustomer(null);
    }
  };
  return (
    <>
      {/* Dialog para editar cliente */}
      <Dialog open={open} onOpenChange={onOpenChange}>
      
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Atualize os dados do cliente abaixo.
            </DialogDescription>
          </DialogHeader>
          {currentCustomer && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome</Label>
                  <Input
                    id="edit-name"
                    value={currentCustomer.name}
                    onChange={(e) =>
                      setCurrentCustomer({
                        ...currentCustomer,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-last_name">Sobrenome</Label>
                  <Input
                    id="edit-last_name"
                    value={currentCustomer.last_name}
                    onChange={(e) =>
                      setCurrentCustomer({
                        ...currentCustomer,
                        last_name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={currentCustomer.email}
                    onChange={(e) =>
                      setCurrentCustomer({
                        ...currentCustomer,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Telefone</Label>
                  <Input
                    id="edit-phone"
                    value={currentCustomer.phone}
                    onChange={(e) =>
                      setCurrentCustomer({
                        ...currentCustomer,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-cpf">CPF</Label>
                  <Input
                    id="edit-cpf"
                    value={currentCustomer.cpf}
                    onChange={(e) =>
                      setCurrentCustomer({
                        ...currentCustomer,
                        cpf: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-date_of_birth">Data de Nascimento</Label>
                  <Input
                    id="edit-date_of_birth"
                    type="date"
                    value={currentCustomer.date_of_birth}
                    onChange={(e) =>
                      setCurrentCustomer({
                        ...currentCustomer,
                        date_of_birth: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-adress">Endereço</Label>
                <Input
                  id="edit-adress"
                  value={currentCustomer.adress}
                  onChange={(e) =>
                    setCurrentCustomer({
                      ...currentCustomer,
                      adress: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-city">Cidade</Label>
                  <Input
                    id="edit-city"
                    value={currentCustomer.city}
                    onChange={(e) =>
                      setCurrentCustomer({
                        ...currentCustomer,
                        city: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-state">Estado</Label>
                  <Input
                    id="edit-state"
                    value={currentCustomer.state}
                    onChange={(e) =>
                      setCurrentCustomer({
                        ...currentCustomer,
                        state: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cep">CEP</Label>
                  <Input
                    id="edit-cep"
                    value={currentCustomer.cep}
                    onChange={(e) =>
                      setCurrentCustomer({
                        ...currentCustomer,
                        cep: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button>
              Cancelar
              </Button>
              </DialogClose>
            <Button onClick={handleEditCustomer}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

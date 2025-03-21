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
import { useCustomerStore } from '@/stores/customer-store';
import { useState } from 'react';

export function CreateClient() {
  const { addCustomer } = useCustomerStore();
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    last_name: '',
    email: '',
    phone: '',
    cpf: '',
    adress: '',
    city: '',
    state: '',
    cep: '',
    date_of_birth: '',
  });

  const handleAddCustomer = () => {
    addCustomer(newCustomer);
    setNewCustomer({
      name: '',
      last_name: '',
      email: '',
      phone: '',
      cpf: '',
      adress: '',
      city: '',
      state: '',
      cep: '',
      date_of_birth: '',
    });
  };

  return (
    <>
      {/* Dialog para adicionar cliente */}
      <Dialog>
        <DialogTrigger asChild>
          <Button>Novo Cliente</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            <DialogDescription>
              Preencha os dados do cliente abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Sobrenome</Label>
                <Input
                  id="last_name"
                  value={newCustomer.last_name}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      last_name: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={newCustomer.cpf}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, cpf: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Data de Nascimento</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={newCustomer.date_of_birth}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      date_of_birth: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adress">Endereço</Label>
              <Input
                id="adress"
                value={newCustomer.adress}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, adress: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={newCustomer.city}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, city: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={newCustomer.state}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, state: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={newCustomer.cep}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, cep: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            <Button onClick={handleAddCustomer}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

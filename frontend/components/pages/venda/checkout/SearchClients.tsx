'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import GetClients from '@/services/clientes/GetClients';
import { useEffect, useState } from 'react';

interface Cliente {
  id: number;
  name: string;
  last_name: string;
  cpf: string;
}

interface SearchClientsProps {
  onSelectCliente: (id: number, name: string) => void;
}

export function SearchClients({ onSelectCliente }: SearchClientsProps) {
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string } | null>(null);
  const [customers, setCustomers] = useState<Cliente[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const customersData = await GetClients();
        setCustomers(customersData);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };
    fetchClients();
  }, []);

  const clientOptions = customers.map((client) => ({
    id: client.id,
    name: `${client.name} ${client.last_name}`,
    cpf: client.cpf,
  }));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="col-span-3 justify-between"
        >
          {selectedClient ? selectedClient.name : 'Selecione um cliente...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar cliente..." />
          <CommandList>
            <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
            <CommandGroup>
              {clientOptions.map((client) => (
                <CommandItem
                  key={client.id}
                  value={client.name}
                  onSelect={() => {
                    setSelectedClient({ id: client.id, name: client.name });
                    onSelectCliente(client.id, client.name);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  {client.name} / {client.cpf}
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      selectedClient?.id === client.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

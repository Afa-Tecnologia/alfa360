'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Customer, useCustomerStore } from '@/stores/customer-store';
import CustomerService from '@/services/clientes/CustomerServices';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Definição do schema de validação
const clientFormSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter no mínimo 2 caracteres' }),
  last_name: z.string().min(2, { message: 'O sobrenome deve ter no mínimo 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(10, { message: 'Telefone inválido' }),
  cpf: z.string().min(11, { message: 'CPF inválido' }),
  adress: z.string().min(3, { message: 'Endereço inválido' }),
  city: z.string().min(2, { message: 'Cidade inválida' }),
  state: z.string().min(2, { message: 'Estado inválido' }),
  cep: z.string().min(8, { message: 'CEP inválido' }),
  date_of_birth: z.string().refine((date) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
  }, { message: 'Data inválida (use o formato YYYY-MM-DD)' }),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Customer;
  onSuccess?: () => void;
}

export function ClientDialog({
  open,
  onOpenChange,
  client,
  onSuccess,
}: ClientDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addCustomer, updateCustomer } = useCustomerStore();
  const { toast } = useToast();
  const isEditing = !!client;

  // Inicializar form com hook
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
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
    },
  });

  // Atualizar valores do formulário quando receber um cliente para edição
  useEffect(() => {
    if (client && open) {
      form.reset({
        name: client.name,
        last_name: client.last_name,
        email: client.email,
        phone: client.phone,
        cpf: client.cpf,
        adress: client.adress,
        city: client.city,
        state: client.state,
        cep: client.cep,
        date_of_birth: client.date_of_birth,
      });
    } else if (!client && open) {
      form.reset({
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
    }
  }, [client, open, form]);

  // Função que manipula o envio do formulário
  const onSubmit = async (data: ClientFormValues) => {
    try {
      setIsSubmitting(true);

      if (isEditing && client) {
        // Atualizar cliente existente
        const updatedClient = await CustomerService.updateClient({
          ...data,
          id: client.id,
        });
        updateCustomer(client.id, data);
        toast({
          title: 'Cliente atualizado',
          description: 'As informações do cliente foram atualizadas com sucesso.',
        });
      } else {
        // Criar novo cliente
        const newClient = await CustomerService.createClient(data);
        addCustomer(data);
        toast({
          title: 'Cliente criado',
          description: 'O cliente foi cadastrado com sucesso.',
        });
      }

      // Fechar diálogo e executar callback de sucesso se existir
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Erro ao salvar cliente:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao salvar o cliente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize as informações do cliente.'
              : 'Preencha os dados para cadastrar um novo cliente.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações Pessoais */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Informações Pessoais</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sobrenome</FormLabel>
                      <FormControl>
                        <Input placeholder="Sobrenome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input placeholder="000.000.000-00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          placeholder="YYYY-MM-DD" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Endereço</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="adress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input placeholder="Rua, número, bairro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="Estado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="00000-000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Salvando...' : 'Criando...'}
                  </>
                ) : (
                  <>{isEditing ? 'Salvar Alterações' : 'Criar Cliente'}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
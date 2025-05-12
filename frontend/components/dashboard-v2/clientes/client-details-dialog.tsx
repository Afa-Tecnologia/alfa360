'use client';

import { Customer } from '@/stores/customer-store';
import { formatDate } from '@/components/pages/clientes/format-date';
import { formatCurrency } from '@/components/pages/clientes/format-currency';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Calendar,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  User,
  CreditCard,
} from 'lucide-react';

interface ClientDetailsDialogProps {
  client: Customer | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientDetailsDialog({
  client,
  isOpen,
  onOpenChange,
}: ClientDetailsDialogProps) {
  if (!client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do Cliente</DialogTitle>
          <DialogDescription>
            Informações completas do cliente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-lg font-semibold">
              {client.name} {client.last_name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Cliente #{client.id}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Informações Pessoais</h4>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">CPF:</span>
                  <span>{client.cpf}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Data de Nascimento:
                  </span>
                  <span>{formatDate(client.date_of_birth)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span>{client.email}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Telefone:</span>
                  <span>{client.phone}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Endereço</h4>

              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div>{client.adress}</div>
                    <div>
                      {client.city}, {client.state}
                    </div>
                    <div>CEP: {client.cep}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {(client.orders_count !== undefined ||
            client.total_spent !== undefined) && (
            <div className="space-y-3 pt-2 border-t">
              <h4 className="text-sm font-medium">Histórico de Compras</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Pedidos</div>
                    <ShoppingBag className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-xl font-semibold mt-1">
                    {client.orders_count || 0}
                  </div>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Total Gasto
                    </div>
                    <CreditCard className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-xl font-semibold mt-1">
                    {formatCurrency(client.total_spent || 0)}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground pt-2">
            <div>
              Cadastrado em:{' '}
              {new Date(client.created_at).toLocaleDateString('pt-BR')}
            </div>
            <div>
              Última atualização:{' '}
              {new Date(client.updated_at).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCustomerStore, Customer } from '@/stores/customer-store';
import CustomerService from '@/services/clientes/CustomerServices';
import { ClientesDashboard } from '@/components/dashboard-v2/clientes/dashboard';
import { ClientDialog } from '@/components/dashboard-v2/clientes/client-dialog';
import { Button } from '@/components/ui/button';
import { RefreshCcw, UserPlus, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ClientesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Customer | undefined>(
    undefined
  );
  const { customers, setCustomers } = useCustomerStore();

  // Carregar clientes ao montar o componente
  useEffect(() => {
    loadClients();
  }, []);

  // Função para carregar os clientes do servidor
  const loadClients = async () => {
    setIsLoading(true);
    try {
      const data = await CustomerService.getClients();
      setCustomers(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para abrir o diálogo de edição de cliente
  const handleEditClient = (client: Customer) => {
    setSelectedClient(client);
    setShowClientDialog(true);
  };

  // Função para abrir o diálogo de criação de cliente
  const handleCreateClient = () => {
    setSelectedClient(undefined);
    setShowClientDialog(true);
  };

  if (isLoading && customers.length === 0) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-[250px]" />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Clientes</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie os clientes cadastrados em sua loja
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleCreateClient} className="w-full sm:w-auto">
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={loadClients}
            className="hidden sm:flex"
            disabled={isLoading}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="sm:hidden flex justify-end mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={loadClients}
          disabled={isLoading}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <ClientesDashboard
        clients={customers}
        onEdit={handleEditClient}
        onRefresh={loadClients}
      />

      {/* Diálogo para criar/editar cliente */}
      <ClientDialog
        open={showClientDialog}
        onOpenChange={setShowClientDialog}
        client={selectedClient}
        onSuccess={loadClients}
      />
    </motion.div>
  );
}

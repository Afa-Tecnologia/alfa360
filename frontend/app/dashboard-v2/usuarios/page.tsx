'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/stores/user-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCcw, Users } from 'lucide-react';
import { UsuariosDashboard } from '@/components/dashboard-v2/usuarios/dashboard';
import { UserDialog } from '@/components/dashboard-v2/usuarios/user-dialog';
import { userService } from '@/services/userService';

export default function UsuariosPage() {
  const { users, setUsers } = useUserStore();
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState('lista');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para controlar os diálogos
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<any>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const usersData = await userService.getAll();
        setUsers(usersData);
      } catch (err) {
        setError('Ocorreu um erro ao carregar os usuários');
        console.error('Erro ao carregar usuários:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [setUsers, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Função para abrir o diálogo de edição
  const handleEdit = (user: any) => {
    setUserToEdit(user);
    setIsEditDialogOpen(true);
  };

  // Função para atualizar após criar/editar
  const handleOperationSuccess = async () => {
    handleRefresh();
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-[250px]" />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Alert variant="destructive" className="my-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      </motion.div>
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
            <h1 className="text-2xl font-bold">Usuários</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie os usuários do sistema
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            Novo Usuário
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            className="hidden sm:flex"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="lista"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <TabsList className="bg-muted/60 w-full sm:w-auto">
            <TabsTrigger value="lista" className="flex-1 sm:flex-initial">
              Lista
            </TabsTrigger>
            <TabsTrigger value="permissoes" className="flex-1 sm:flex-initial">
              Permissões
            </TabsTrigger>
          </TabsList>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="w-full sm:hidden"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>

        <TabsContent value="lista" className="space-y-6">
          <UsuariosDashboard
            users={users}
            onEdit={handleEdit}
            onRefresh={handleRefresh}
          />
        </TabsContent>

        <TabsContent value="permissoes">
          <div className="flex items-center justify-center h-[400px] border rounded-lg bg-muted/20">
            <div className="text-center p-6">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">
                Gerenciamento de Permissões
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Esta funcionalidade estará disponível em breve. Aqui você poderá
                gerenciar as permissões de acesso para cada perfil de usuário.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Diálogo para criar novo usuário */}
      <UserDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleOperationSuccess}
      />

      {/* Diálogo para editar usuário */}
      {userToEdit && (
        <UserDialog
          user={userToEdit}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={handleOperationSuccess}
        />
      )}
    </motion.div>
  );
}

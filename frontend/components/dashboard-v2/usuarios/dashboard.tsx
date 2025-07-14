'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '@/stores/user-store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Filter,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  ArrowUpDown,
  Users,
  User as UserIcon,
  ShieldCheck,
  Shield,
  Eye,
  Loader2,
  ListFilter,
  LayoutGrid,
} from 'lucide-react';
import { userService } from '@/services/userService';
import { useToast } from '@/components/ui/use-toast';
import { UserStatsCard } from './user-stats-card';
import { UserDetailsDialog } from './user-details-dialog';

interface UsuariosDashboardProps {
  users: User[];
  onEdit: (user: User) => void;
  onRefresh: () => void;
}

export function UsuariosDashboard({
  users,
  onEdit,
  onRefresh,
}: UsuariosDashboardProps) {
  const [search, setSearch] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [userToView, setUserToView] = useState<User | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'role' | 'created_at'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const { toast } = useToast();

  // Filtrar usuários com base na pesquisa e no filtro de role
  const filteredUsers = users.filter((user) => {
    const searchMatch =
      user.name.toLowerCase().includes(search ? search.toLowerCase() : '') ||
      user.email.toLowerCase().includes(search ? search.toLowerCase() : '');

    const roleMatch = roleFilter ? user.roles[0].name === roleFilter : true;

    return searchMatch && roleMatch;
  });

  // Ordenar usuários
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'created_at') {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      // role
      return sortOrder === 'asc'
        ? a.perfil.localeCompare(b.roles[0].name)
        : b.roles[0].name.localeCompare(a.roles[0].name);
    }
  });

  // Contadores para estatísticas
  const totalUsers = users.length;
  const admins = users.filter((u) => u.roles[0].name === 'admin').length;
  const gerentes = users.filter((u) => u.roles[0].name === 'gerente').length;
  const vendedores = users.filter((u) => u.roles[0].name === 'vendedor').length;

  // Função para alternar a ordenação
  const toggleSort = (field: 'name' | 'role' | 'created_at') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Função para confirmar exclusão
  const handleDelete = async () => {
    if (userToDelete) {
      try {
        setIsDeleting(true);
        await userService.delete(userToDelete.id);

        setShowDeleteDialog(false);
        setUserToDelete(null);
        onRefresh();

        toast({
          title: 'Usuário excluído',
          description: 'O usuário foi excluído com sucesso.',
        });
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao excluir o usuário.',
          variant: 'destructive',
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Função para visualizar detalhes do usuário
  const handleViewDetails = (user: User) => {
    setUserToView(user);
    setShowDetailsDialog(true);
  };

  // Função para filtrar por role
  const handleRoleFilter = (role: string) => {
    setRoleFilter(role === roleFilter ? '' : role);
  };

  // Função para obter o badge de acordo com o role
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge className="bg-purple-500/20 text-purple-700 hover:bg-purple-500/20">
            <ShieldCheck className="mr-1 h-3 w-3" />
            Administrador
          </Badge>
        );
      case 'gerente':
        return (
          <Badge className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/20">
            <Shield className="mr-1 h-3 w-3" />
            Gerente
          </Badge>
        );
      case 'vendedor':
        return (
          <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/20">
            <UserIcon className="mr-1 h-3 w-3" />
            Vendedor
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <UserIcon className="mr-1 h-3 w-3" />
            Usuário
          </Badge>
        );
    }
  };

  // Renderizar visualização de grid
  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedUsers.map((user) => (
        <Card key={user.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{user.name}</CardTitle>
              {getRoleBadge(user.roles[0].name)}
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Cadastrado em:{' '}
              {new Date(user.created_at).toLocaleDateString('pt-BR')}
            </p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleViewDetails(user)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onEdit(user)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            {user.roles[0].name !== 'admin' && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-600 hover:bg-red-50"
                onClick={() => {
                  setUserToDelete(user);
                  setShowDeleteDialog(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  // Renderizar visualização de tabela
  const renderTableView = () => (
    <div className="rounded-md border">
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="[&_th]:px-4 [&_th]:py-3 [&_th]:font-medium [&_th]:text-left">
              <th>Nome</th>
              <th className="hidden sm:table-cell">Email</th>
              <th>Função</th>
              <th className="hidden sm:table-cell">Data de Cadastro</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sortedUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Nenhum usuário encontrado
                </td>
              </tr>
            ) : (
              sortedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="[&_td]:px-4 [&_td]:py-3 hover:bg-muted/30"
                >
                  <td className="font-medium">
                    <div>{user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      #{user.id}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell max-w-[250px] truncate">
                    {user.email}
                  </td>
                  <td>{getRoleBadge(user.roles[0].name)}</td>
                  <td className="hidden sm:table-cell">
                    {user.created_at instanceof Date
                      ? user.created_at.toLocaleDateString('pt-BR')
                      : user.created_at}
                  </td>
                  <td className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(user)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Ver detalhes</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        {user.roles[0].name !== 'admin' && (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setUserToDelete(user);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Excluir</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        <UserStatsCard
          title="Total de Usuários"
          value={totalUsers}
          icon={<Users className="h-5 w-5" />}
          description="Usuários cadastrados no sistema"
        />
        <UserStatsCard
          title="Administradores"
          value={admins}
          icon={<ShieldCheck className="h-5 w-5" />}
          description="Usuários com acesso total"
          variant="purple"
        />
        <UserStatsCard
          title="Gerentes"
          value={gerentes}
          icon={<Shield className="h-5 w-5" />}
          description="Usuários com acesso gerencial"
          variant="blue"
        />
        <UserStatsCard
          title="Vendedores"
          value={vendedores}
          icon={<UserIcon className="h-5 w-5" />}
          description="Usuários operacionais"
          variant="success"
        />
      </div>

      {/* Listagem de usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            Gerencie os usuários do sistema e suas permissões
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Barra de busca e filtros */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuários..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex gap-2">
                {/* Filtros de role */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">Filtrar</span>
                      {roleFilter && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {roleFilter}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Filtrar por role</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleRoleFilter('admin')}>
                      <ShieldCheck className="mr-2 h-4 w-4 text-purple-600" />
                      <span>Administrador</span>
                      {roleFilter === 'admin' && (
                        <Badge variant="secondary" className="ml-auto">
                          Ativo
                        </Badge>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRoleFilter('gerente')}
                    >
                      <Shield className="mr-2 h-4 w-4 text-blue-600" />
                      <span>Gerente</span>
                      {roleFilter === 'gerente' && (
                        <Badge variant="secondary" className="ml-auto">
                          Ativo
                        </Badge>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRoleFilter('vendedor')}
                    >
                      <UserIcon className="mr-2 h-4 w-4 text-green-600" />
                      <span>Vendedor</span>
                      {roleFilter === 'vendedor' && (
                        <Badge variant="secondary" className="ml-auto">
                          Ativo
                        </Badge>
                      )}
                    </DropdownMenuItem>
                    {roleFilter && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setRoleFilter('')}>
                          <span className="text-primary">Limpar filtro</span>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Ordenação */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <ArrowUpDown className="h-4 w-4" />
                      <span className="hidden sm:inline">Ordenar</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => toggleSort('name')}>
                      <span>Nome</span>
                      {sortBy === 'name' && (
                        <ArrowUpDown className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleSort('role')}>
                      <span>Função</span>
                      {sortBy === 'role' && (
                        <ArrowUpDown className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleSort('created_at')}>
                      <span>Data de Cadastro</span>
                      {sortBy === 'created_at' && (
                        <ArrowUpDown className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Botões para alternar visualização */}
                <div className="flex rounded-md border overflow-hidden">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="icon"
                    className="rounded-none h-9 w-9 border-0"
                    onClick={() => setViewMode('table')}
                  >
                    <ListFilter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    className="rounded-none h-9 w-9 border-0"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Lista de usuários - tabela ou grid */}
            {viewMode === 'table' ? renderTableView() : renderGridView()}
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário{' '}
              <strong>{userToDelete?.name}</strong>?
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de detalhes do usuário */}
      {userToView && (
        <UserDetailsDialog
          user={userToView}
          isOpen={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
        />
      )}
    </div>
  );
}

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
import { User, useUserStore } from '@/stores/user-store';
import { Edit, Eye, MoreVertical, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { UpdateUser } from './modals/Update-User';
import { ViewDetails } from './modals/View-Details-User';
import { DeleteUser } from './modals/Delete-User';
import { userService } from '@/services/userService';
import { Badge } from '@/components/ui/badge';

interface UsersList {
  users: User[];
}

export function TableViewUser({ users }: UsersList) {
  const [currentUsers, setCurrentUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { deleteUser } = useUserStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    setCurrentUsers(users);
  }, [users]);

  const openEditDialog = (user: User) => {
    setCurrentUser(user);
    setIsEditDialogOpen(true);
  };
  const handleDeleteUser = async (userId: number) => {
    try {
      await userService.delete(userId);
      deleteUser(userId);
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  const openViewDialog = (user: User) => {
    setCurrentUser(user);
    setIsViewDialogOpen(true);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge
            variant="default"
            className="bg-purple-500 hover:bg-purple-600"
          >
            Administrador
          </Badge>
        );
      case 'gerente':
        return (
          <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
            Gerente
          </Badge>
        );
      case 'vendedor':
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            Vendedor
          </Badge>
        );
      default:
        return <Badge variant="outline">Usuário</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Data de Cadastro</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Nenhum usuário encontrado
              </TableCell>
            </TableRow>
          ) : (
            currentUsers.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div>{user.name}</div>
                  <div className="text-xs text-muted-foreground">
                    #{user.id}
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
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
                      <DropdownMenuItem onClick={() => openViewDialog(user)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      {/* Não permitir excluir administradores */}
                      {user.role !== 'admin' && (
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentUser(user);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Dialog para editar o usuário */}
      <UpdateUser
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={currentUser}
      />

      {/* Dialog para visualizar detalhes do usuário */}
      <ViewDetails
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        user={currentUser}
      />

      {/*  Dialog para Deletar o usuário */}
      <DeleteUser
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        userId={currentUser?.id || 0}
        handleDelete={handleDeleteUser}
      />
    </div>
  );
}

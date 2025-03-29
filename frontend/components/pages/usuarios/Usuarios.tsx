'use client';

import { useEffect, useState } from 'react';
import { useUserStore, type User } from '@/stores/user-store';
import { Button } from '@/components/ui/button';
import { CreateUser } from './modals/Create-User';
import { TableViewUser } from './TableUsuarios';
import { SearchInput } from './SearchInputUsuarios';
import { RefreshCcw } from 'lucide-react';
import { userService } from '@/services/userService';
import UsuariosLoading from './UsuarioLoading';

export default function UsuariosPage() {
  const { users, setUsers } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await userService.getAll();
      setUsers(usersData);
      setFilteredUsers(usersData);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) => {
      const nameMatches = searchTerm
        ? user.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const roleMatches = roleFilter ? user.role === roleFilter : true;

      return nameMatches && roleMatches;
    });

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role === roleFilter ? '' : role);
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários do sistema.
          </p>
        </div>
        <div className="flex justify-between items-center">
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                userService.refreshUsers(
                  setUsers,
                  setFilteredUsers,
                  setIsLoading
                )
              }
            >
              <RefreshCcw className="h-4 w-4" />
              <span className="sr-only">Atualizar Lista</span>
            </Button>
            <Button
              variant={roleFilter === 'vendedor' ? 'secondary' : 'outline'}
              onClick={() => handleRoleFilter('vendedor')}
              className="text-xs"
            >
              Vendedores
            </Button>
            <Button
              variant={roleFilter === 'gerente' ? 'secondary' : 'outline'}
              onClick={() => handleRoleFilter('gerente')}
              className="text-xs"
            >
              Gerentes
            </Button>
            {/* Dialog Create new user */}
            <CreateUser />
          </div>
        </div>

        {/* Section Table Users */}
        {isLoading ? (
          <UsuariosLoading />
        ) : (
          <TableViewUser users={filteredUsers} />
        )}
      </div>
    </>
  );
}

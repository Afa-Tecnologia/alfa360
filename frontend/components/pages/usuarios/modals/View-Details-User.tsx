'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from '@/stores/user-store';
import { Badge } from '@/components/ui/badge';

interface ViewDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function ViewDetails({ open, onOpenChange, user }: ViewDetailsProps) {
  if (!user) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Usuário</DialogTitle>
          <DialogDescription>
            Informações do usuário selecionado.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID</p>
              <p className="text-lg">{user.id}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome</p>
              <p className="text-lg">{user.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg">{user.email}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Função
              </p>
              <div className="pt-1">{getRoleBadge(user.roles[0].name)}</div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Data de Cadastro
              </p>
              <p className="text-lg">
                {new Date(user.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Última Atualização
              </p>
              <p className="text-lg">
                {new Date(user.updated_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

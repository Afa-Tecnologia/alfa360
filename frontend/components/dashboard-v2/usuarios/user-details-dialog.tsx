'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { User } from '@/stores/user-store';
import {
  User as UserIcon,
  Mail,
  Calendar,
  ShieldCheck,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface UserDetailsDialogProps {
  user: User;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsDialog({
  user,
  isOpen,
  onOpenChange,
}: UserDetailsDialogProps) {
  // Formatador de data
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Função para obter o badge de acordo com o perfil
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes do Usuário</DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre o usuário
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-5">
          <div className="flex flex-col space-y-3">
            {/* Cabeçalho com nome e perfil */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">{user.name}</h3>
              {getRoleBadge(user.perfil)}
            </div>

            <Separator />

            {/* Informações gerais */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">ID:</span>
                <span className="text-sm font-medium">{user.id}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Email:</span>
                <span className="text-sm font-medium">{user.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Data de Criação:
                </span>
                <span className="text-sm font-medium">
                  {formatDate(user.created_at)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Última Atualização:
                </span>
                <span className="text-sm font-medium">
                  {formatDate(user.updated_at)}
                </span>
              </div>
            </div>

            <Separator />

            {/* Status e informações adicionais */}
            <div className="bg-muted/20 p-3 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-700"
                  >
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Ativo
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Acesso:</span>
                  {user.perfil === 'admin' ? (
                    <Badge className="bg-purple-500/10 text-purple-700">
                      Completo
                    </Badge>
                  ) : user.perfil === 'gerente' ? (
                    <Badge className="bg-blue-500/10 text-blue-700">
                      Gerencial
                    </Badge>
                  ) : (
                    <Badge className="bg-green-500/10 text-green-700">
                      Operacional
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

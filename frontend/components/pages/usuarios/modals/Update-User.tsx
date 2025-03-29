'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userService } from '@/services/userService';
import { User, useUserStore } from '@/stores/user-store';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UpdateUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function UpdateUser({ open, onOpenChange, user }: UpdateUserProps) {
  const { updateUser } = useUserStore();
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    role: string;
    password: string;
    password_confirmation: string;
  }>({
    name: '',
    email: '',
    role: '',
    password: '',
    password_confirmation: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  // Atualizar o estado quando o usuário mudar
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
        password_confirmation: '',
      });
    }
  }, [user]);

  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    };

    if (!userData.name.trim()) {
      errors.name = 'Nome é obrigatório';
      isValid = false;
    }

    if (!userData.email.trim()) {
      errors.email = 'Email é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = 'Email inválido';
      isValid = false;
    }

    // Validação de senha apenas se estiver preenchida
    if (userData.password) {
      if (userData.password.length < 6) {
        errors.password = 'Senha deve ter pelo menos 6 caracteres';
        isValid = false;
      }

      if (userData.password !== userData.password_confirmation) {
        errors.password_confirmation = 'As senhas não conferem';
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleUpdateUser = async () => {
    if (!user || !validateForm()) {
      return;
    }

    try {
      // Se a senha não for alterada, não a enviamos
      const dataToUpdate: any = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
      };

      // Incluir senha apenas se foi preenchida
      if (userData.password) {
        dataToUpdate.password = userData.password;
      }

      const updatedUser = await userService.update(user.id, dataToUpdate);
      updateUser(user.id, updatedUser);

      onOpenChange(false);

      // Limpar senha após atualização
      setUserData({
        ...userData,
        password: '',
        password_confirmation: '',
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize as informações do usuário.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="update-name">Nome</Label>
            <Input
              id="update-name"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />
            {formErrors.name && (
              <p className="text-sm text-red-500">{formErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-email">Email</Label>
            <Input
              id="update-email"
              type="email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />
            {formErrors.email && (
              <p className="text-sm text-red-500">{formErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-role">Função</Label>
            <Select
              value={userData.role}
              onValueChange={(value) =>
                setUserData({ ...userData, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vendedor">Vendedor</SelectItem>
                <SelectItem value="gerente">Gerente</SelectItem>
                {/* Admin só pode ser criado via seed */}
                {userData.role === 'admin' && (
                  <SelectItem value="admin">Administrador</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-password">Nova Senha (opcional)</Label>
            <Input
              id="update-password"
              type="password"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              placeholder="Deixe em branco para manter a senha atual"
            />
            {formErrors.password && (
              <p className="text-sm text-red-500">{formErrors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-password-confirmation">
              Confirmar Nova Senha
            </Label>
            <Input
              id="update-password-confirmation"
              type="password"
              value={userData.password_confirmation}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  password_confirmation: e.target.value,
                })
              }
              placeholder="Deixe em branco para manter a senha atual"
            />
            {formErrors.password_confirmation && (
              <p className="text-sm text-red-500">
                {formErrors.password_confirmation}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={handleUpdateUser}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, useUserStore } from '@/stores/user-store';
import { userService } from '@/services/userService';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserDialogProps {
  user?: User;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UserDialog({
  user,
  isOpen,
  onOpenChange,
  onSuccess,
}: UserDialogProps) {
  const isEditing = !!user;
  const { toast } = useToast();
  const { addUser, updateUser } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    role: 'vendedor',
    password: '',
    password_confirmation: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  // Resetar o formulário quando o diálogo é aberto/fechado ou o usuário muda
  useEffect(() => {
    if (isOpen) {
      if (isEditing && user) {
        setFormState({
          name: user.name || '',
          email: user.email || '',
          role: user.perfil || 'vendedor',
          password: '',
          password_confirmation: '',
        });
      } else {
        setFormState({
          name: '',
          email: '',
          role: 'vendedor',
          password: '',
          password_confirmation: '',
        });
      }
      setFormErrors({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      });
    }
  }, [isOpen, isEditing, user]);

  // Validar o formulário
  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    };

    if (!formState.name.trim()) {
      errors.name = 'Nome é obrigatório';
      isValid = false;
    }

    if (!formState.email.trim()) {
      errors.email = 'Email é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errors.email = 'Email inválido';
      isValid = false;
    }

    // Validação de senha (obrigatória apenas para novos usuários)
    if (!isEditing) {
      if (!formState.password) {
        errors.password = 'Senha é obrigatória';
        isValid = false;
      } else if (formState.password.length < 6) {
        errors.password = 'Senha deve ter pelo menos 6 caracteres';
        isValid = false;
      }

      if (formState.password !== formState.password_confirmation) {
        errors.password_confirmation = 'As senhas não conferem';
        isValid = false;
      }
    } else if (formState.password) {
      // Validação apenas se a senha foi fornecida durante a edição
      if (formState.password.length < 6) {
        errors.password = 'Senha deve ter pelo menos 6 caracteres';
        isValid = false;
      }

      if (formState.password !== formState.password_confirmation) {
        errors.password_confirmation = 'As senhas não conferem';
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      role: value,
    }));
  };

  // Submeter o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Remover confirmação de senha e tratar dados para envio
      const { password_confirmation, ...dataToSubmitBase } = formState;

      // Define type for data with optional password
      type UserSubmitData = {
        name: string;
        email: string;
        role: string;
        password?: string;
      };

      // Criar uma versão modificável dos dados
      let dataToSubmit: UserSubmitData = { ...dataToSubmitBase };

      // Remover senha se estiver em branco e estiver editando
      if (isEditing && !dataToSubmit.password) {
        const { password, ...dataWithoutPassword } = dataToSubmit;
        dataToSubmit = dataWithoutPassword;
      }

      if (isEditing && user) {
        const updatedUser = await userService.update(user.id, dataToSubmit);
        updateUser(user.id, updatedUser);

        toast({
          title: 'Usuário atualizado',
          description: 'O usuário foi atualizado com sucesso.',
        });
      } else {
        const newUser = await userService.create(dataToSubmit);
        addUser(newUser);

        toast({
          title: 'Usuário criado',
          description: 'O usuário foi criado com sucesso.',
        });
      }

      if (onSuccess) {
        onSuccess();
      }

      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao salvar usuário:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao salvar o usuário.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Atualize as informações do usuário "${user?.name}"`
              : 'Preencha os campos abaixo para criar um novo usuário'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                placeholder="Nome do usuário"
                className="w-full"
                required
                autoFocus
              />
              {formErrors.name && (
                <p className="text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                placeholder="email@exemplo.com"
                className="w-full"
                required
              />
              {formErrors.email && (
                <p className="text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Função</Label>
              <Select value={formState.role} onValueChange={handleRoleChange}>
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendedor">Vendedor</SelectItem>
                  <SelectItem value="gerente">Gerente</SelectItem>
                  {formState.role === 'admin' && (
                    <SelectItem value="admin">Administrador</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                A função determina os níveis de acesso do usuário.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {isEditing ? 'Nova Senha (opcional)' : 'Senha'}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formState.password}
                onChange={handleChange}
                placeholder={
                  isEditing
                    ? 'Deixe em branco para manter a senha atual'
                    : 'Digite a senha'
                }
                className="w-full"
                required={!isEditing}
              />
              {formErrors.password && (
                <p className="text-sm text-red-500">{formErrors.password}</p>
              )}
              {isEditing && (
                <p className="text-xs text-muted-foreground">
                  Deixe em branco para manter a senha atual.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirmar Senha</Label>
              <Input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                value={formState.password_confirmation}
                onChange={handleChange}
                placeholder="Confirme a senha"
                className="w-full"
                required={!isEditing || !!formState.password}
              />
              {formErrors.password_confirmation && (
                <p className="text-sm text-red-500">
                  {formErrors.password_confirmation}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
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
                  {isEditing ? 'Atualizando...' : 'Criando...'}
                </>
              ) : isEditing ? (
                'Atualizar'
              ) : (
                'Criar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

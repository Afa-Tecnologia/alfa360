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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userService } from '@/services/userService';
import { useUserStore } from '@/stores/user-store';
import { gerarNotificacao } from '@/utils/toast';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function CreateUser() {
  const { addUser } = useUserStore();
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'vendedor',
    password: '',
    perfil:'',
    password_confirmation: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    perfil: '',
    password_confirmation: '',
  });

  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: '',
      email: '',
      password: '',
      perfil: '',
      password_confirmation: '',
    };

    if (!newUser.name.trim()) {
      errors.name = 'Nome é obrigatório';
      isValid = false;
    }

    if (!newUser.email.trim()) {
      errors.email = 'Email é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      errors.email = 'Email inválido';
      isValid = false;
    }

    if (!newUser.password) {
      errors.password = 'Senha é obrigatória';
      isValid = false;
    } else if (newUser.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
      isValid = false;
    }

    if (newUser.password !== newUser.password_confirmation) {
      errors.password_confirmation = 'As senhas não conferem';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleAddUser = async (e: React.MouseEvent, onClose: () => void) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Remover a confirmação de senha antes de enviar para a API
      const { password_confirmation, ...userToCreate } = newUser;

      const response = await userService.create(userToCreate);
      addUser(response);

      // Resetar o formulário
      setNewUser({
        name: '',
        email: '',
        role: 'vendedor',
        perfil: '', // Definindo perfil padrão
        password: '',
        password_confirmation: '',
      });

      setFormErrors({
        name: '',
        email: '',
        password: '',
        perfil: '',
        password_confirmation: '',
      });

      onClose();
      gerarNotificacao('success', 'Usuário criado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      gerarNotificacao('error', error.message || 'Erro ao criar usuário');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Novo Usuário</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo usuário do sistema.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            {formErrors.name && (
              <p className="text-sm text-red-500">{formErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            {formErrors.email && (
              <p className="text-sm text-red-500">{formErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Função</Label>
            <Select
              value={newUser.perfil}
              onValueChange={(value) => setNewUser({ ...newUser, perfil: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vendedor">Vendedor</SelectItem>
                <SelectItem value="gerente">Gerente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
            {formErrors.password && (
              <p className="text-sm text-red-500">{formErrors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Confirmar Senha</Label>
            <Input
              id="password_confirmation"
              type="password"
              value={newUser.password_confirmation}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  password_confirmation: e.target.value,
                })
              }
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
          <Button
            onClick={(e) => {
              handleAddUser(e, () => {
                const closeButton = document.querySelector(
                  '[data-state="open"] button[aria-label="Close"]'
                );
                if (closeButton instanceof HTMLElement) {
                  closeButton.click();
                }
              });
            }}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

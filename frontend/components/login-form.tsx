'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { api } from '@/app/api/api';
import { LoginResponse } from '@/types/auth';
import { loginAction } from '@/app/api/actions';
import { gerarNotificacao } from '@/utils/toast';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStore';
import { revalidatePath } from 'next/cache';
import { ButtonLoading } from './ui/button-spinner';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'form'>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isActive, setIsActive] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();
  const onSubmit = async (data: any) => {
    try {
      setIsActive(true);
      const response = await api.post('/login', data);
      const { access_token, user, message } = response.data;

      if (access_token && user) {
        setIsActive(false);
        loginAction(access_token);
        setUser(user);
        setToken(access_token);
        gerarNotificacao('success', message);
        revalidatePath('/login');
      }
    } catch (error: any) {
      const { response } = error;
      console.log(response?.data?.message);
      gerarNotificacao('error', response?.data?.message);
      setIsActive(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Bem vindo de Volta! :)</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Faça login com suas credenciais
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seuemail@gmail.com"
            required
            {...register('email')}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
          </div>
          <Input
            id="password"
            type="password"
            required
            {...register('password')}
          />
        </div>
        {isActive ? (
          <ButtonLoading />
        ) : (
          <Button type="submit" className="w-full">
            Login
          </Button>
        )}

        <p className="text-balance text-sm text-muted-foreground">
          Desenvolvido por Alfa Tecnologia - Junior Teixeira &copy; Todos os
          Direitos Reservados
        </p>
      </div>
    </form>
  );
}

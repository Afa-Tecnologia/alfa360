'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { AtSign, KeyRound, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/app/api/api';
import { gerarNotificacao } from '@/utils/toast';
import { redirect, useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStore';
import { useUserDataStore } from '@/stores/use-data-store';
import { getFirstAccessiblePath } from '@/lib/auth/route-access';

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginFormV3({
  className,
  redirectTo = '/dashboard',
}: React.ComponentPropsWithoutRef<'div'> & { redirectTo?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    setValue,
  } = useForm<LoginFormData>();

   const setUser = useUserDataStore((state) => state.setUser);

  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const handleEmailNext = async () => {
    const isValid = await trigger('email');
    if (isValid) {
      setEmail(getValues('email'));
      setCurrentView('password');
    }
  };

  const handleBack = () => {
    setCurrentView('email');
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const response = await api.post('/login', data);
      const { user, message } = response.data;

      setUser(user);
      gerarNotificacao('success', message);
       if (user?.role) {
              const firstPath = getFirstAccessiblePath(user.role) || '/';
              router.push(firstPath);
            } else {
              router.push('/dashboard');
            }
    } catch (error: any) {
      const { response } = error;
      if (error.code === 'ERR_NETWORK') {
        gerarNotificacao(
          'error',
          'Ops!! Parece que você está offline ou o servidor está fora do ar'
        );
      } else {
        gerarNotificacao(
          'error',
          response?.data?.message || 'Erro ao fazer login'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full "
    >
      <div className="rounded-2xl border border-border/50 bg-card p-6 backdrop-blur shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold tracking-tight">
                {currentView === 'email' ? 'Login' : 'Digite sua senha'}
              </h1>
              {currentView === 'password' && (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-sm text-muted-foreground hover:text-primary"
                  onClick={handleBack}
                >
                  Voltar
                </Button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {currentView === 'email' ? (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <AtSign className="h-5 w-5" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seuemail@gmail.com"
                      className={cn(
                        'pl-10 h-12 text-base bg-muted/50 ',
                        errors.email &&
                          'border-red-500 focus-visible:ring-red-500'
                      )}
                      {...register('email', {
                        required: 'Digite seu email',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email inválido',
                        },
                      })}
                    />
                  </div>

                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-destructive font-medium"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}

                  <Button
                    type="button"
                    onClick={handleEmailNext}
                    className="w-full h-12 text-base font-medium rounded-lg"
                  >
                    Continuar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex  items-center p-3 gap-3 rounded-lg bg-muted/50">
                    <div className="h-11 w-11 rounded-full  bg-primary/10 flex items-center justify-center text-primary">
                      {email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div
                        className=" text-sm font-medium  max-w-[200px] truncate sm:max-w-none sm:truncate-0">
                        {email}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <KeyRound className="h-5 w-5" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Sua senha"
                      className={cn(
                        'pl-10 h-12 text-base bg-muted/50 ',
                        errors.password &&
                          'border-red-500 focus-visible:ring-red-500'
                      )}
                      {...register('password', {
                        required: 'Digite sua senha',
                      })}
                    />
                  </div>

                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-destructive font-medium"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium rounded-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-border/30">
          <p className="text-center text-sm text-muted-foreground">
            Desenvolvido por Alfa Tecnologia &copy;
          </p>
        </div>
      </div>
    </motion.div>
  );
}

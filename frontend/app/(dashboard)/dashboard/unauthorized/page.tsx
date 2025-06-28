'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth/logout-server';
import { useUserDataStore } from '@/stores/use-data-store';
import { getFirstAccessiblePath } from '@/lib/auth/route-access';

export default function UnauthorizedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const user = useUserDataStore((state) => state.user);

  useEffect(() => {
    // Se não veio de uma rota negada, redirecione automaticamente
    if (!from) {
      // redireciona para a primeira rota válida ou dashboard
      if (user?.role) {
        const firstPath = getFirstAccessiblePath(user.role) || '/dashboard';
        router.push(firstPath);
      } else {
        router.replace('/login');
      }
    }
  }, [user]);

  const handleBackToLogin = async () => {
    await logout();
    router.push('/login');
  };

  const handleBackToDashboard = () => {
    if (user?.role) {
      const firstPath = getFirstAccessiblePath(user.role);
      if (firstPath) {
        router.push(firstPath);
      } else {
        router.push('/dashboard');
      }
    }
  };

  
  return (
    <div className="flex h-screen items-center justify-center bg-[#f8fafc] dark:bg-[#101010] px-4 overflow-hidden">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-4xl font-bold text-red-600">Acesso Negado</h1>
        <p className="text-gray-700 dark:text-gray-300">
          Você não tem permissão para acessar esta página.
        </p>

        {user ? (
          <Button onClick={handleBackToDashboard} className="mt-4">
            Voltar para o meu Inicial
          </Button>
        ) : (
          <Button onClick={handleBackToLogin} className="mt-4">
            Voltar para o Login
          </Button>
        )}
      </div>
    </div>
  );
}

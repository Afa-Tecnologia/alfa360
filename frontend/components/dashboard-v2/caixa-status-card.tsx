'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CaixaService } from '@/services/caixaService';
import { CaixaStatus } from '@/types/caixa';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, User, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

export function CaixaStatusCard() {
  const [statusCaixa, setStatusCaixa] = useState<CaixaStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setIsLoading(true);
        const data = await CaixaService.checkStatus();
        setStatusCaixa(data);
        setError(null);
      } catch (error) {
        console.error('Erro ao buscar status do caixa:', error);
        setError('Não foi possível verificar o status do caixa.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const handleNavigateToCaixa = () => {
    router.push('/dashboard/caixa');
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-[180px]" />
          <Skeleton className="h-4 w-[250px] mt-2" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-300">
        <CardHeader>
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <CardTitle>Erro ao carregar status do caixa</CardTitle>
          </div>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const isCaixaOpen = statusCaixa?.status === 'aberto';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        className={cn(
          'overflow-hidden border-2',
          isCaixaOpen
            ? 'border-green-300 dark:border-green-700'
            : 'border-orange-300 dark:border-orange-700'
        )}
      >
        <CardHeader className="pb-3 relative">
          <div className="absolute top-0 right-0 w-20 h-20">
            <div
              className={cn(
                'absolute -right-10 -top-10 w-20 h-20 rotate-45',
                isCaixaOpen ? 'bg-green-500' : 'bg-orange-500'
              )}
            ></div>
          </div>

          <div className="flex items-center">
            <Badge
              variant="outline"
              className={cn(
                'mr-2 text-sm px-3 py-1 font-medium',
                isCaixaOpen
                  ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400'
              )}
            >
              {isCaixaOpen ? 'ABERTO' : 'FECHADO'}
            </Badge>
            <CardTitle>Status do PDV</CardTitle>
          </div>

          <CardDescription>
            {isCaixaOpen
              ? 'O caixa está aberto e pronto para operação'
              : 'O caixa está fechado. Abra-o para iniciar as operações'}
          </CardDescription>
        </CardHeader>

        {isCaixaOpen ? (
          <>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg flex items-center">
                <div className="mr-4 bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Atual</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(Number(statusCaixa?.saldoAtual || 0))}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg flex items-center">
                <div className="mr-4 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Operador</p>
                  <p className="text-lg font-bold truncate">
                    {statusCaixa?.user?.name || 'Não identificado'}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg flex items-center">
                <div className="mr-4 bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                  <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Aberto desde</p>
                  <p className="text-lg font-bold">
                    {statusCaixa?.open_date
                      ? formatarData(statusCaixa.open_date)
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-2">
              <Button
                variant="default"
                className="w-full"
                onClick={handleNavigateToCaixa}
              >
                Gerenciar Caixa
              </Button>
            </CardFooter>
          </>
        ) : (
          <CardFooter className="pt-0">
            <Button
              variant="default"
              className="w-full"
              onClick={handleNavigateToCaixa}
            >
              Abrir Caixa
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}

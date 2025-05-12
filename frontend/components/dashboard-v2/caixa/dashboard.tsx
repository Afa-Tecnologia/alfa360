'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CaixaStatus, MovimentacaoCaixa } from '@/types/caixa';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/format';
import { EstadoCaixa } from './estado-caixa';
import { MetricsCards } from './metrics-cards';
import { MovimentacoesLista } from './movimentacoes-lista';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AbrirCaixaForm } from './forms/abrir-caixa-form';
import { FecharCaixaForm } from './forms/fechar-caixa-form';
import { MovimentacaoForm } from './forms/movimentacao-form';
import { ArrowDownCircle, ArrowUpCircle, Lock, Wallet } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CaixaDashboardProps {
  statusCaixa: CaixaStatus | null;
  movimentacoes: MovimentacaoCaixa[];
  onUpdate: () => void;
}

export function CaixaDashboard({
  statusCaixa,
  movimentacoes,
  onUpdate,
}: CaixaDashboardProps) {
  const [modalAbrir, setModalAbrir] = useState(false);
  const [modalFechar, setModalFechar] = useState(false);
  const [modalMovimentacao, setModalMovimentacao] = useState(false);
  const [tipoMovimentacao, setTipoMovimentacao] = useState<'entrada' | 'saida'>(
    'entrada'
  );

  // Calcular estatísticas
  const totalEntradas = movimentacoes
    .filter((m) => m.type === 'entrada')
    .reduce((sum, m) => sum + Number(m.value), 0);

  const totalSaidas = movimentacoes
    .filter((m) => m.type === 'saida')
    .reduce((sum, m) => sum + Number(m.value), 0);

  // Use type assertion to access data that exists in runtime but isn't in the type definition
  const saldoInicial = statusCaixa
    ? Number((statusCaixa as any).saldo_inicial || 0)
    : 0;
  const saldoAtual = statusCaixa?.saldoAtual
    ? Number(statusCaixa.saldoAtual)
    : saldoInicial + totalEntradas - totalSaidas;

  // Calcular entradas por método de pagamento
  const entradasPorMetodo = movimentacoes
    .filter((m) => m.type === 'entrada')
    .reduce(
      (acc, m) => {
        const metodo = m.payment_method || 'Não informado';
        if (!acc[metodo]) {
          acc[metodo] = 0;
        }
        acc[metodo] += Number(m.value);
        return acc;
      },
      {} as Record<string, number>
    );

  // Manipulador para abrir o modal de movimentação
  const handleAbrirModalMovimentacao = (tipo: 'entrada' | 'saida') => {
    setTipoMovimentacao(tipo);
    setModalMovimentacao(true);
  };

  // Estado do caixa
  const isCaixaOpen = statusCaixa?.status === 'aberto';
  const caixaId = statusCaixa?.id ? Number(statusCaixa.id) : undefined;

  console.log('DEBUG - statusCaixa:', JSON.stringify(statusCaixa, null, 2));
  console.log('DEBUG - caixa objeto:', statusCaixa);
  console.log('DEBUG - caixaId:', caixaId, 'tipo:', typeof caixaId);

  // Se não tem dados do status do caixa ainda
  if (!statusCaixa) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estado do Caixa */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <EstadoCaixa
          statusCaixa={statusCaixa}
          saldoAtual={saldoAtual}
          onOpenMovimentacao={handleAbrirModalMovimentacao}
          onOpenCaixa={() => setModalAbrir(true)}
          onCloseCaixa={() => setModalFechar(true)}
        />
      </motion.div>

      {/* Métricas do Caixa */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <MetricsCards
          saldoInicial={saldoInicial}
          saldoAtual={saldoAtual}
          totalEntradas={totalEntradas}
          totalSaidas={totalSaidas}
          entradasPorMetodo={entradasPorMetodo}
        />
      </motion.div>

      {/* Lista de Movimentações */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Movimentações</CardTitle>
            <CardDescription>
              Histórico de entradas e saídas do caixa atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MovimentacoesLista movimentacoes={movimentacoes} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Modais */}
      {/* Modal para Abrir Caixa */}
      <Dialog open={modalAbrir} onOpenChange={setModalAbrir}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Abrir Caixa</DialogTitle>
          </DialogHeader>
          <AbrirCaixaForm
            onSuccess={() => {
              setModalAbrir(false);
              onUpdate();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Modal para Movimentação */}
      <Dialog open={modalMovimentacao} onOpenChange={setModalMovimentacao}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {tipoMovimentacao === 'entrada' ? 'Nova Entrada' : 'Nova Saída'}
            </DialogTitle>
          </DialogHeader>
          <MovimentacaoForm
            tipo={tipoMovimentacao}
            caixaId={caixaId || 0}
            onSuccess={() => {
              setModalMovimentacao(false);
              onUpdate();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Modal para Fechar Caixa */}
      {statusCaixa && (
        <Dialog open={modalFechar} onOpenChange={setModalFechar}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Fechar Caixa</DialogTitle>
            </DialogHeader>
            <FecharCaixaForm
              caixaId={caixaId || 0}
              saldoAtual={saldoAtual}
              onSuccess={() => {
                setModalFechar(false);
                onUpdate();
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

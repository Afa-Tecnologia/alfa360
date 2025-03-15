'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowDownUp,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { caixaService } from '@/utils/caixaService';
import { CloseCaixaForm } from '../caixa/CloseCaixaForm';
import StatusCaixaBadge from '../caixa/StatusCaixaBadge';
import { IMovimentacoes, IReports, IStatus } from '@/types/caixa';
import MovimentacoesTable from '../caixa/MovimentacoesTable';
import { MovimentacaoForm } from '../caixa/MovimentacaoForm';
import CaixaBalance from '../caixa/CaixaBalance';
import { OpenCaixaForm } from '../caixa/OpenCaixaForm';

interface ICaixa {
  children?: React.ReactElement;
  movimentacoes?: IMovimentacoes[];
}

export default function Home(props: ICaixa) {
  const [currentBalance, setCurrentBalance] = useState(1000);
  const [totalIncome, setTotalIncome] = useState(500);
  const [totalExpenses, setTotalExpenses] = useState(500);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [status, setStatus] = useState<IStatus | any>({}); // Inicializa com um objeto vazio
  const [report, setReport] = useState<IReports[]>();
  const [movimentacoes, setMovimentacoes] = useState<IMovimentacoes[]>([]);
  const handleTransaction = () => {
    if (!amount || !description || !paymentMethod) {
      toast.error('Please fill in all fields');
      return;
    }

    toast.success('Transaction recorded successfully!');
    setAmount('');
    setDescription('');
    setPaymentMethod('');
  };

  const getStatus = (value?: any) => {
    setStatus(value);
  };

  useEffect(() => {
    const fetchStatus = async () => {
      const statusValue = await getStatus();
      setStatus(statusValue);
    };
    fetchStatus();
  }, []); // Executar uma vez quando o componente for montado

  const handleCreateMovimentacao = async (caixaId: string, data: any) => {
    try {
      await caixaService.createMovimentacao(caixaId, data);
      const reportResponse = await caixaService.getCaixaReport(caixaId);
      setReport(reportResponse);
    } catch (error) {
      console.error('Erro ao criar movimentação:', error);
    }
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-xl">Caixa da Loja:</h1>
          <StatusCaixaBadge getStatus={getStatus} />
        </div>
        {!status?.status ? (
          <OpenCaixaForm />
        ) : (
          <>
            <CaixaBalance status={status} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <MovimentacaoForm
                onCreateMovimentacao={handleCreateMovimentacao}
                status={status}
              ></MovimentacaoForm>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Movimentações</CardTitle>
                  <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <MovimentacoesTable status={status}/>
                </CardContent>
              </Card>
            </div>
            <CloseCaixaForm status={status} onCloseCaixa={status} />
          </>
        )}
      </div>
    </main>
  );
}

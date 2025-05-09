import { useState, useEffect, useCallback, useRef } from 'react';
import { useCaixaStore } from '@/stores/caixa-store';
import { MovimentacaoCaixa } from '@/types/caixa';
import { formatCurrency } from '@/utils/format';
import { useToast } from '@/components/ui/use-toast';

export type CaixaStatusType = 'none' | 'aberto' | 'fechado' | 'cancelado';

interface UseCaixaManagerReturn {
  // Estados
  caixaStatus: CaixaStatusType;
  isLoading: boolean;
  error: string | null;

  // Valores formatados
  saldoInicial: string;
  saldoAtual: string;
  totalEntradas: string;
  totalSaidas: string;
  dataAbertura: string | undefined;

  // Movimentações
  movimentacoes: MovimentacaoCaixa[];
  entradasHoje: MovimentacaoCaixa[];
  saidasHoje: MovimentacaoCaixa[];

  // Ações
  abrirCaixa: (valor: number, observacao?: string) => Promise<void>;
  fecharCaixa: (observacao?: string) => Promise<void>;
  registrarEntrada: (
    valor: number,
    descricao: string,
    formaPagamento?: string,
    dados?: any
  ) => Promise<void>;
  registrarSaida: (
    valor: number,
    descricao: string,
    formaPagamento?: string,
    dados?: any
  ) => Promise<void>;
  recarregarDados: () => Promise<void>;
  resetarEstado: () => void;
}

export function useCaixaManager(): UseCaixaManagerReturn {
  const {
    statusCaixa,
    caixaReport: relatorioCaixa,
    movimentacoes,
    isLoading: storeIsLoading,
    error: storeError,
    fetchStatus,
    openCaixa,
    closeCaixa,
    createMovimentacao,
    fetchMovimentacoes,
    fetchReport,
    setError: setStoreError,
  } = useCaixaStore();

  const { toast } = useToast();

  // Usa uma ref para controlar se já carregou os dados
  const dadosCarregados = useRef(false);

  // Estado local para armazenar os valores formatados
  const [saldoInicial, setSaldoInicial] = useState<string>('R$ 0,00');
  const [saldoAtual, setSaldoAtual] = useState<string>('R$ 0,00');
  const [totalEntradas, setTotalEntradas] = useState<string>('R$ 0,00');
  const [totalSaidas, setTotalSaidas] = useState<string>('R$ 0,00');
  const [caixaStatus, setCaixaStatus] = useState<CaixaStatusType>('none');
  const [dataAbertura, setDataAbertura] = useState<string | undefined>(
    undefined
  );

  // Estado local para isLoading e error
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filtra movimentações do dia atual
  const [entradasHoje, setEntradasHoje] = useState<MovimentacaoCaixa[]>([]);
  const [saidasHoje, setSaidasHoje] = useState<MovimentacaoCaixa[]>([]);

  // Funções alias com o mesmo nome que estávamos usando
  const verificarStatusCaixa = async () => {
    await fetchStatus();
    return statusCaixa;
  };

  const storageAbrirCaixa = async (valor: number, observacao?: string) => {
    await openCaixa(valor, observacao ? +observacao : 0);
  };

  const storageFecharCaixa = async (observacao?: string) => {
    if (!statusCaixa?.caixa?.id) {
      console.error('[useCaixaManager] Erro: ID do caixa não encontrado!', {
        statusCaixa,
      });
      throw new Error(
        'ID do caixa não encontrado. Não é possível fechar o caixa.'
      );
    }

    const caixaId = statusCaixa.caixa.id;

    // Extrair o saldo atual do statusCaixa ou calcular
    const saldoAtualVal = statusCaixa.saldoAtual
      ? Number(statusCaixa.saldoAtual.replace(/[^\d.,]/g, '').replace(',', '.'))
      : calcularSaldoAtual();

    // Converter saldoAtual para número se for string
    const saldoFinal =
      typeof saldoAtualVal === 'string'
        ? Number(saldoAtualVal.replace(/[^\d.,]/g, '').replace(',', '.'))
        : saldoAtualVal;

    console.log('[useCaixaManager] Fechando caixa:', {
      caixaId,
      saldoFinal,
      observacao,
    });

    await closeCaixa(caixaId, saldoFinal, observacao);
  };

  const criarEntrada = async (
    valor: number,
    descricao: string,
    formaPagamento?: string,
    dados?: any
  ) => {
    if (!statusCaixa?.caixa?.id) return;
    await createMovimentacao({
      caixa_id: statusCaixa.caixa.id,
      type: 'entrada',
      value: valor,
      description: descricao,
      payment_method: formaPagamento,
      local: 'loja',
    });
  };

  const criarSaida = async (
    valor: number,
    descricao: string,
    formaPagamento?: string,
    dados?: any
  ) => {
    if (!statusCaixa?.caixa?.id) return;
    await createMovimentacao({
      caixa_id: statusCaixa.caixa.id,
      type: 'saida',
      value: valor,
      description: descricao,
      payment_method: formaPagamento,
      local: 'loja',
    });
  };

  const obterMovimentacoes = async () => {
    if (statusCaixa?.caixa?.id) {
      // Passa o ID do caixa atual para buscar apenas as movimentações deste caixa
      await fetchMovimentacoes(statusCaixa.caixa.id);
    } else {
      await fetchMovimentacoes();
    }
  };

  const obterRelatorioCaixa = async (caixaId?: number) => {
    if (!caixaId && !statusCaixa?.caixa?.id) return;
    const id = caixaId || statusCaixa!.caixa!.id;
    await fetchReport(id);
  };

  const resetarEstado = () => {
    setStoreError(null);
  };

  // Calcular o saldo atual
  const calcularSaldoAtual = useCallback(() => {
    if (!statusCaixa?.caixa) return 'R$ 0,00';

    const inicial = Number(statusCaixa.caixa.saldo_inicial) || 0;

    const entrada = movimentacoes
      .filter((m) => m.type === 'entrada')
      .reduce((acc, m) => acc + Number(m.value), 0);

    const saida = movimentacoes
      .filter((m) => m.type === 'saida')
      .reduce((acc, m) => acc + Number(m.value), 0);

    return formatCurrency(inicial + entrada - saida);
  }, [statusCaixa, movimentacoes]);

  // Calcular totais de entradas e saídas
  const calcularTotais = useCallback(() => {
    const entrada = movimentacoes
      .filter((m) => m.type === 'entrada')
      .reduce((acc, m) => acc + Number(m.value), 0);

    const saida = movimentacoes
      .filter((m) => m.type === 'saida')
      .reduce((acc, m) => acc + Number(m.value), 0);

    setTotalEntradas(formatCurrency(entrada));
    setTotalSaidas(formatCurrency(saida));
  }, [movimentacoes]);

  // Filtrar movimentações de hoje
  const filtrarMovimentacoesHoje = useCallback(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const movHoje = movimentacoes.filter((m) => {
      const dataMovimentacao = new Date(m.created_at || '');
      return dataMovimentacao >= hoje;
    });

    setEntradasHoje(movHoje.filter((m) => m.type === 'entrada'));
    setSaidasHoje(movHoje.filter((m) => m.type === 'saida'));
  }, [movimentacoes]);

  // Função para recarregar todos os dados
  const recarregarDados = useCallback(async () => {
    console.log('[useCaixaManager] Iniciando carregamento de dados');
    if (isLoading || storeIsLoading) {
      console.log('[useCaixaManager] Carregamento já em andamento, ignorando');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('[useCaixaManager] Verificando status do caixa');
      const status = await verificarStatusCaixa();
      console.log('[useCaixaManager] Status do caixa recebido:', status);

      // Atualizar data de abertura
      if (status && status.caixa?.open_date) {
        console.log(
          '[useCaixaManager] Data de abertura encontrada:',
          status.caixa.open_date
        );
        setDataAbertura(status.caixa.open_date);
      } else {
        setDataAbertura(undefined);
      }

      // Só busca movimentações e relatório se o caixa estiver aberto
      if (status && status.status === 'aberto') {
        console.log('[useCaixaManager] Caixa aberto, buscando movimentações');
        await obterMovimentacoes();
        console.log('[useCaixaManager] Buscando relatório do caixa');
        await obterRelatorioCaixa();
      } else {
        console.log(
          '[useCaixaManager] Caixa não está aberto (status: ' +
            status?.status +
            '), não buscando dados adicionais'
        );
      }

      console.log('[useCaixaManager] Carregamento concluído com sucesso');
    } catch (err: any) {
      console.error('[useCaixaManager] Erro ao carregar dados:', err);
      const errorMessage = err.message || 'Erro ao carregar dados do caixa';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    verificarStatusCaixa,
    obterMovimentacoes,
    obterRelatorioCaixa,
    isLoading,
    storeIsLoading,
    toast,
  ]);

  // Carregar status inicial do caixa apenas uma vez
  useEffect(() => {
    if (!dadosCarregados.current) {
      console.log(
        '[useCaixaManager] Efeito inicial executado, carregando dados pela primeira vez'
      );
      dadosCarregados.current = true;
      recarregarDados();
    }

    // Limpeza ao desmontar
    return () => {
      console.log(
        '[useCaixaManager] Componente desmontado, resetando referência'
      );
      dadosCarregados.current = false;
    };
  }, []);

  // Atualizar status do caixa quando o statusCaixa mudar
  useEffect(() => {
    if (statusCaixa) {
      console.log('[useCaixaManager] Status do caixa atualizado:', statusCaixa);
      // Se status não estiver definido, use 'none'
      // Se for 'open' ou 'closed', use o status que veio da API
      const newStatus =
        statusCaixa.status === 'aberto' || statusCaixa.status === 'fechado'
          ? statusCaixa.status
          : 'none';

      console.log('[useCaixaManager] Novo status definido:', newStatus);
      setCaixaStatus(newStatus);

      // Atualizar a data de abertura aqui também
      if (statusCaixa.caixa?.open_date) {
        setDataAbertura(statusCaixa.caixa.open_date);
      }
    }
  }, [statusCaixa]);

  // Atualizar saldo inicial quando o statusCaixa.caixa mudar
  useEffect(() => {
    if (statusCaixa?.caixa) {
      setSaldoInicial(formatCurrency(Number(statusCaixa.caixa.saldo_inicial)));

      if (caixaStatus === 'aberto') {
        obterRelatorioCaixa(statusCaixa.caixa.id);
      }

      // Capturar a data de abertura do caixa também
      if (statusCaixa.caixa.open_date) {
        setDataAbertura(statusCaixa.caixa.open_date);
      }
    } else {
      setSaldoInicial('R$ 0,00');
    }
  }, [statusCaixa, obterRelatorioCaixa, caixaStatus]);

  // Atualizar saldo atual e totais quando as movimentações ou o caixa mudarem
  useEffect(() => {
    setSaldoAtual(calcularSaldoAtual());
    calcularTotais();
    filtrarMovimentacoesHoje();
  }, [
    movimentacoes,
    statusCaixa,
    calcularSaldoAtual,
    calcularTotais,
    filtrarMovimentacoesHoje,
  ]);

  // Função para abrir o caixa
  const abrirCaixa = async (valor: number, observacao?: string) => {
    await storageAbrirCaixa(valor, observacao);
    await recarregarDados();
  };

  // Função para fechar o caixa
  const fecharCaixa = async (observacao?: string) => {
    await storageFecharCaixa(observacao);
    await recarregarDados();
  };

  // Função para registrar entrada
  const registrarEntrada = async (
    valor: number,
    descricao: string,
    formaPagamento?: string,
    dados?: any
  ) => {
    await criarEntrada(valor, descricao, formaPagamento, dados);
    await recarregarDados();
  };

  // Função para registrar saída
  const registrarSaida = async (
    valor: number,
    descricao: string,
    formaPagamento?: string,
    dados?: any
  ) => {
    await criarSaida(valor, descricao, formaPagamento, dados);
    await recarregarDados();
  };

  return {
    caixaStatus,
    isLoading,
    error,
    saldoInicial,
    saldoAtual,
    totalEntradas,
    totalSaidas,
    dataAbertura,
    movimentacoes,
    entradasHoje,
    saidasHoje,
    abrirCaixa,
    fecharCaixa,
    registrarEntrada,
    registrarSaida,
    recarregarDados,
    resetarEstado,
  };
}

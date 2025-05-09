export type StatusCaixa = 'open' | 'closed';
export type TipoMovimentacao = 'entrada' | 'saida';
export type MetodoPagamento =
  | 'MONEY'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'pix'
  | 'CONDITIONAL'
  | string;
export type LocalMovimentacao = 'loja' | 'ecommerce';
export type StatusMovimentacao =
  | 'pending'
  | 'completed'
  | 'confirmed'
  | 'cancelled';

export interface Caixa {
  id: number;
  user_id: number;
  saldo_inicial: string;
  saldo_final?: string | null;
  observation?: string | null;
  open_date: string;
  close_date?: string | null;
  status: 'aberto' | 'fechado' | 'cancelado';
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface MovimentacaoCaixa {
  id: number;
  caixa_id: number;
  user_id: number;
  pedido_id?: number | null;
  type: 'entrada' | 'saida';
  value: string;
  description: string;
  payment_method?: string | null;
  local?: string | null;
  confirmed: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  pedido?: {
    id: number;
    codigo: string;
  } | null;
}

export interface MovimentacaoParams {
  caixa_id: number;
  pedido_id?: number;
  type: 'entrada' | 'saida';
  value: number;
  description: string;
  payment_method?: string;
  local?: string;
}

export interface CaixaReport {
  caixa: Caixa;
  saldoAtual: string;
  totalEntradas: string;
  totalSaidas: string;
  movimentacoes: MovimentacaoCaixa[];
  entradasPorMetodo: {
    metodo: string;
    total: string;
    percentual: number;
  }[];
  saidasPorMotivo: {
    motivo: string;
    total: string;
    percentual: number;
  }[];
}

export interface CaixaStatus {
  id?: string;
  status: 'aberto' | 'fechado' | 'cancelado';
  caixa?: Caixa;
  saldoAtual?: string;
  totalEntradas?: string;
  totalSaidas?: string;
  open_date?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CaixaStore {
  statusCaixa: CaixaStatus | null;
  caixaReport: CaixaReport | null;
  movimentacoes: MovimentacaoCaixa[];
  isLoading: boolean;
  error: string | null;

  // Métodos
  fetchStatus: () => Promise<void>;
  fetchMovimentacoes: (caixaId?: number) => Promise<void>;
  fetchReport: (caixaId: number) => Promise<void>;
  openCaixa: (
    saldoInicial: number,
    userId: number,
    observacao?: string
  ) => Promise<void>;
  closeCaixa: (
    caixaId: number,
    saldoFinal: number,
    observacao?: string
  ) => Promise<void>;
  createMovimentacao: (params: MovimentacaoParams) => Promise<void>;

  // Setters
  setStatusCaixa: (status: CaixaStatus | null) => void;
  setCaixaReport: (report: CaixaReport | null) => void;
  setMovimentacoes: (movimentacoes: MovimentacaoCaixa[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface RelatorioCaixa {
  saldo_inicial: number;
  saldo_final: number;
  total_entradas: number;
  total_saidas: number;
  por_forma_pagamento: Record<string, number>;
  status: StatusCaixa;
  open_date: string;
  close_date?: string;
  movimentacoes?: MovimentacaoCaixa[];
}

export interface AbrirCaixaRequest {
  saldo_inicial: number;
  observation?: string;
  user_id: number;
}

export interface FecharCaixaRequest {
  observation?: string;
}

export interface CriarMovimentacaoRequest {
  type: TipoMovimentacao;
  value: number;
  description: string;
  payment_method?: MetodoPagamento;
  additional_data?: any;
  local: LocalMovimentacao;
}

export interface StatusCaixaResponse {
  id?: number;
  saldo_inicial?: number;
  open_date?: string;
  status: 'open' | 'closed' | 'none';
  message?: string;
}

export interface IStatus {
  id: string;
  saldo_inicial: string;
  open_date: string;
  status: string;
}

export interface IMovimentacoes {
  id: string;
  caixa_id: string;
  user_id: string;
  type: string;
  value: number;
  description: string;
  payment_method: string;
  status: string;
  additional_data: null | string;
  pedido_id: string;
  created_at: string;
}

export interface IReports {
  saldo_inicial: number;
  saldo_final: number;
  total_entradas: number;
  total_saidas: number;
  por_forma_pagamento: any[];
  status: string;
  open_date: string;
  close_date: string;
}

export interface CaixaHistoricoItem extends Caixa {
  total_movimentacoes: number;
  total_entradas: number;
  total_saidas: number;
  saldo_calculado: number;
}

export interface CaixaHistoricoResponse {
  data: CaixaHistoricoItem[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface CaixaDetalhesResponse {
  caixa: Caixa & {
    movimentacoes: MovimentacaoCaixa[];
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
  report: RelatorioCaixa;
}

export interface HistoricoFilters {
  data_inicio?: string;
  data_fim?: string;
  user_id?: number;
  status?: StatusCaixa;
  page?: number;
  per_page?: number;
}

export interface ReportResponse {
  saldo_inicial: string | number;
  saldo_final: string | number;
  total_entradas: number;
  total_saidas: number;
  por_forma_pagamento: Record<string, number>;
  status: StatusCaixa;
  open_date: string;
  close_date?: string;
}

export interface ConsolidadoCaixasPorUsuario {
  usuario: {
    id: number;
    nome: string;
  };
  total_caixas: number;
  total_entradas: number;
  total_saidas: number;
  saldo: number;
}

export interface MetodoPagamentoConsolidado {
  metodo: string;
  valor: number;
}

export interface ConsolidadoCaixas {
  periodo: {
    inicio: string;
    fim: string;
  };
  totais: {
    caixas: number;
    caixas_abertos: number;
    caixas_fechados: number;
    saldo_inicial: number;
    saldo_final: number;
    total_entradas: number;
    total_saidas: number;
    saldo_liquido: number;
  };
  por_usuario: ConsolidadoCaixasPorUsuario[];
  entradas_por_metodo: MetodoPagamentoConsolidado[];
}

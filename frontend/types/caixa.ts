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
    created_at:string
  }
  

  export interface IReports {
    saldo_inicial: number
    saldo_final: number,
    total_entradas: number,
    total_saidas: number,
    por_forma_pagamento: any[],
    status: string,
    open_date: string
    close_date: string
}
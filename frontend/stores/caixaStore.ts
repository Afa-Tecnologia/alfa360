// import { create } from 'zustand'

// interface CaixaStatus {
//   isOpen: boolean
//   id: number | null
// }

// interface CaixaState {
//   status: CaixaStatus
//   report: any | null
//   pedidosPendentes: any[]
//   setStatus: (status: CaixaStatus) => void
//   setReport: (report: any | null) => void
//   setPedidosPendentes: (pedidos: any[]) => void
// }

// export const useCaixaStore = create<CaixaState>((set) => ({
//   status: {
//     isOpen: false,
//     id: null,
//   },
//   report: null,
//   pedidosPendentes: [],
//   setStatus: (status) => set({ status }),
//   setReport: (report) => set({ report }),
//   setPedidosPendentes: (pedidos) => set({ pedidosPendentes: pedidos }),
// }))

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define a interface para o status do caixa
interface CaixaStatus {
  isOpen: boolean;
  id: number | null;
}

// Define a interface para o estado da store
interface CaixaState {
  status: CaixaStatus;
  report: any | null;
  pedidosPendentes: any[];
  movimentacoes: any[];
  setStatus: (status: CaixaStatus) => void;
  setReport: (report: any | null) => void;
  setMovimentacoes: (report: any | null) => void;
  setPedidosPendentes: (pedidos: any[]) => void;
}

// Criação da store com persistência
export const useCaixaStore = create<CaixaState>()(
  persist(
    (set) => ({
      // Estado inicial
      status: {
        isOpen: false,
        id: null,
      },
      report: null,
      pedidosPendentes: [],
      movimentacoes: [],

      // Métodos para atualizar o estado
      setStatus: (status) =>
        set((state) => ({ status: { ...state.status, ...status } })),
      setReport: (report) => set({ report }),
      setMovimentacoes: (report) => set({ report }),
      setPedidosPendentes: (pedidos) => set({ pedidosPendentes: pedidos }),
    }),
    {
      name: 'caixa-store', // Nome da chave no localStorage
      partialize: (state) => ({
        status: state.status,
        report: state.report,
        pedidosPendentes: state.pedidosPendentes,
        movimentacoes: state.movimentacoes,
      }), // Escolhe quais partes do estado serão persistidas
    }
  )
);

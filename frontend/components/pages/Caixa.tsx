// 'use client';

// import React, { useEffect, useState } from 'react';
// import { CaixaStatus } from '@/components/caixa/CaixaStatus';
// import { OpenCaixaForm } from '@/components/caixa/OpenCaixaForm';
// import { CloseCaixaForm } from '@/components/caixa/CloseCaixaForm';
// import { MovimentacaoForm } from '@/components/caixa/MovimentacaoForm';
// import { CaixaReport } from '../caixa/CaixaReport';
// import { caixaService as api } from '@/utils/caixaService';
// import { useCaixaStore } from '@/stores/caixaStore';
// import MovimentacoesTable from '../caixa/MovimentacoesTable';
// import { IStatus } from '@/types/auth';
// import CardMin from '../card/Card-min';
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

// interface ICaixa {
//   status?: IStatus[];
//   children?: React.ReactElement;
// }

// export default function Caixa() {
//   const { setStatus, setReport, setPedidosPendentes, setMovimentacoes } =
//     useCaixaStore();
//   const [movimentacoes, _setMovimentacoes] = useState<any>([]);

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const [statusResponse, pedidosResponse, movimentacaoResponse] =
//           await Promise.all([
//             api.getCaixaStatus(),
//             api.getPedidosPendentes(),
//             api.getMovimentacoes(),
//           ]);

//         console.log('Status recebido da API:', statusResponse.data);

//         // Transforma o status retornado pela API em um formato esperado
//         const caixaStatus = {
//           isOpen: statusResponse.data.status === 'open',
//           id: statusResponse.data.id,
//         };

//         console.log(movimentacaoResponse);
//         setStatus(caixaStatus);
//         setPedidosPendentes(pedidosResponse.data);
//         setMovimentacoes(movimentacaoResponse);
//         _setMovimentacoes(movimentacaoResponse.data);
//         if (caixaStatus.isOpen) {
//           const reportResponse = await api.getCaixaReport(caixaStatus.id);
//           setReport(reportResponse.data);
//           console.log(reportResponse.data);
//         }
//       } catch (error) {
//         console.error('Erro ao buscar dados iniciais:', error);
//       }
//     };

//     fetchInitialData();
//   }, [setStatus, setPedidosPendentes, setReport, _setMovimentacoes]);

//   const handleOpenCaixa = async (
//     saldo_inicial: number,
//     observation?: string
//   ) => {
//     try {
//       const response = await api.openCaixa({ saldo_inicial, observation });
//       setStatus({ isOpen: true, id: response.data.id });
//     } catch (error) {
//       console.error('Erro ao abrir o caixa:', error);
//     }
//   };

//   const handleCloseCaixa = async (caixaId: number, observation?: string) => {
//     try {
//       await api.closeCaixa(caixaId, { observation });
//       setStatus({ isOpen: false, id: null });
//       setReport(null);
//     } catch (error) {
//       console.error('Erro ao fechar o caixa:', error);
//     }
//   };

//   const handleCreateMovimentacao = async (caixaId: number, data: any) => {
//     try {
//       await api.createMovimentacao(caixaId, data);
//       const reportResponse = await api.getCaixaReport(caixaId);
//       setReport(reportResponse.data);
//     } catch (error) {
//       console.error('Erro ao criar movimentação:', error);
//     }
//   };

//   const handleRegistrarPedido = async (caixaId: number, pedidoId: number) => {
//     try {
//       await api.registrarPedidoNoCaixa(caixaId, pedidoId);
//       const [pedidosResponse, reportResponse] = await Promise.all([
//         api.getPedidosPendentes(),
//         api.getCaixaReport(caixaId),
//       ]);
//       setPedidosPendentes(pedidosResponse.data);
//       setReport(reportResponse.data);
//     } catch (error) {
//       console.error('Erro ao registrar pedido:', error);
//     }
//   };

//   const { status } = useCaixaStore();

//   return (
//     <Card className='w-full '> 
//       <CardHeader>
//         <CardTitle className=" text-2xl">Caixa</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-6">
//           <div className="flex flex-col  lg:flex-row gap-4">
//             <div className=" flex flex-col lg:flex-row gap-4 ">
//               <CaixaStatus />
//               <CardMin
//                 title="Valor atual"
//                 value={1000}
//                 valueStyle=" text-green-600"
//               />
//               <CardMin
//                 title="Total de entradas"
//                 value={500}
//                 valueStyle=" text-green-600"
//               />
//               <CardMin
//                 title="Total de saídas"
//                 value={500}
//                 valueStyle=" text-red-600"
//               />
//             </div>
//           </div>
//           <Card>
//             <CardHeader>
//               <CardTitle>Movimentações</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <MovimentacoesTable movimentacoes={movimentacoes} />
//             </CardContent>
//           </Card>
//           {!status.isOpen && <OpenCaixaForm onOpenCaixa={handleOpenCaixa} />}

//           {status.isOpen && (
//             <div className=" flex flex-row gap-4">
//               <MovimentacaoForm
//                 onCreateMovimentacao={handleCreateMovimentacao}
//               />
//               {/* <PedidosList onRegistrarPedido={handleRegistrarPedido} /> */}
//               <CaixaReport />
//             </div>
//           )}
//         </div>

//         {status.isOpen && <CloseCaixaForm onCloseCaixa={handleCloseCaixa} />}
//       </CardContent>
//     </Card>
//   );
// }
"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowDownUp, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from 'react-toastify';


export default function Home() {
  const [currentBalance, setCurrentBalance] = useState(1000);
  const [totalIncome, setTotalIncome] = useState(500);
  const [totalExpenses, setTotalExpenses] = useState(500);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleTransaction = () => {
    if (!amount || !description || !paymentMethod) {
      toast.error("Please fill in all fields");
      return;
    }
    
    toast.success("Transaction recorded successfully!");
    // Reset form
    setAmount("");
    setDescription("");
    setPaymentMethod("");
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">Cash Register System</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {currentBalance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Cash Register ID: $2</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">R$ {totalIncome.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">R$ {totalExpenses.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>New Transaction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Select onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Transaction Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Input
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Select onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={handleTransaction}>
                Record Transaction
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center text-muted-foreground">
                  No transactions found
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Close Register</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Closing Notes" />
            <Button variant="destructive" className="w-full">
              Close Register
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
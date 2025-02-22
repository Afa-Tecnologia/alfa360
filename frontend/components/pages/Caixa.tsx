'use client';

import React, { useEffect, useState } from 'react';
import { CaixaStatus } from '@/components/caixa/CaixaStatus';
import { OpenCaixaForm } from '@/components/caixa/OpenCaixaForm';
import { CloseCaixaForm } from '@/components/caixa/CloseCaixaForm';
import { MovimentacaoForm } from '@/components/caixa/MovimentacaoForm';
import { CaixaReport } from '../caixa/CaixaReport';
import { caixaService as api } from '@/utils/caixaService';
import { useCaixaStore } from '@/stores/caixaStore';
import MovimentacoesTable from '../caixa/MovimentacoesTable';
import { IStatus } from '@/types/auth';
import CardMin from '../card/Card-min';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ICaixa {
  status?: IStatus[];
  children?: React.ReactElement;
}

export default function Caixa() {
  const { setStatus, setReport, setPedidosPendentes, setMovimentacoes } =
    useCaixaStore();
  const [movimentacoes, _setMovimentacoes] = useState<any>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [statusResponse, pedidosResponse, movimentacaoResponse] =
          await Promise.all([
            api.getCaixaStatus(),
            api.getPedidosPendentes(),
            api.getMovimentacoes(),
          ]);

        console.log('Status recebido da API:', statusResponse.data);

        // Transforma o status retornado pela API em um formato esperado
        const caixaStatus = {
          isOpen: statusResponse.data.status === 'open',
          id: statusResponse.data.id,
        };

        console.log(movimentacaoResponse);
        setStatus(caixaStatus);
        setPedidosPendentes(pedidosResponse.data);
        setMovimentacoes(movimentacaoResponse);
        _setMovimentacoes(movimentacaoResponse.data);
        if (caixaStatus.isOpen) {
          const reportResponse = await api.getCaixaReport(caixaStatus.id);
          setReport(reportResponse.data);
          console.log(reportResponse.data);
        }
      } catch (error) {
        console.error('Erro ao buscar dados iniciais:', error);
      }
    };

    fetchInitialData();
  }, [setStatus, setPedidosPendentes, setReport, _setMovimentacoes]);

  const handleOpenCaixa = async (
    saldo_inicial: number,
    observation?: string
  ) => {
    try {
      const response = await api.openCaixa({ saldo_inicial, observation });
      setStatus({ isOpen: true, id: response.data.id });
    } catch (error) {
      console.error('Erro ao abrir o caixa:', error);
    }
  };

  const handleCloseCaixa = async (caixaId: number, observation?: string) => {
    try {
      await api.closeCaixa(caixaId, { observation });
      setStatus({ isOpen: false, id: null });
      setReport(null);
    } catch (error) {
      console.error('Erro ao fechar o caixa:', error);
    }
  };

  const handleCreateMovimentacao = async (caixaId: number, data: any) => {
    try {
      await api.createMovimentacao(caixaId, data);
      const reportResponse = await api.getCaixaReport(caixaId);
      setReport(reportResponse.data);
    } catch (error) {
      console.error('Erro ao criar movimentação:', error);
    }
  };

  const handleRegistrarPedido = async (caixaId: number, pedidoId: number) => {
    try {
      await api.registrarPedidoNoCaixa(caixaId, pedidoId);
      const [pedidosResponse, reportResponse] = await Promise.all([
        api.getPedidosPendentes(),
        api.getCaixaReport(caixaId),
      ]);
      setPedidosPendentes(pedidosResponse.data);
      setReport(reportResponse.data);
    } catch (error) {
      console.error('Erro ao registrar pedido:', error);
    }
  };

  const { status } = useCaixaStore();

  return (
    <Card className='w-full '> 
      <CardHeader>
        <CardTitle className=" text-2xl">Caixa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col  lg:flex-row gap-4">
            <div className=" flex flex-col lg:flex-row gap-4 ">
              <CaixaStatus />
              <CardMin
                title="Valor atual"
                value={1000}
                valueStyle=" text-green-600"
              />
              <CardMin
                title="Total de entradas"
                value={500}
                valueStyle=" text-green-600"
              />
              <CardMin
                title="Total de saídas"
                value={500}
                valueStyle=" text-red-600"
              />
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Movimentações</CardTitle>
            </CardHeader>
            <CardContent>
              <MovimentacoesTable movimentacoes={movimentacoes} />
            </CardContent>
          </Card>
          {!status.isOpen && <OpenCaixaForm onOpenCaixa={handleOpenCaixa} />}

          {status.isOpen && (
            <div className=" flex flex-row gap-4">
              <MovimentacaoForm
                onCreateMovimentacao={handleCreateMovimentacao}
              />
              {/* <PedidosList onRegistrarPedido={handleRegistrarPedido} /> */}
              <CaixaReport />
            </div>
          )}
        </div>

        {status.isOpen && <CloseCaixaForm onCloseCaixa={handleCloseCaixa} />}
      </CardContent>
    </Card>
  );
}

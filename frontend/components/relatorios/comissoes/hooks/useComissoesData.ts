'use client';

import { Commission, CommissionSummary } from '@/types/reports';
import { useMemo } from 'react';

// Cores para os gráficos
export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function useComissoesData(
  commissionSummary: CommissionSummary,
  searchTerm: string = ''
) {
  // Calcular totais e valores para gráficos
  const data = useMemo(() => {
    // Calcular totais por status
    const comissoesPagas = commissionSummary.comissoes
      .filter((c) => c.status === 'pago')
      .reduce((total, c) => total + c.valor, 0);

    const comissoesPendentes = commissionSummary.comissoes
      .filter((c) => c.status === 'pendente')
      .reduce((total, c) => total + c.valor, 0);

    const totalComissoesPagas = commissionSummary.comissoes.filter(
      (c) => c.status === 'pago'
    ).length;

    const totalComissoesPendentes = commissionSummary.comissoes.filter(
      (c) => c.status === 'pendente'
    ).length;

    // Filtrar comissões pelo termo de pesquisa
    const filteredCommissions = commissionSummary.comissoes.filter(
      (comissao) =>
        comissao.pedido_id.toString().includes(searchTerm) ||
        (comissao.produto?.name || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    // Dados para gráfico de produtos mais vendidos
    const produtosVendidos = Array.from(
      new Set(commissionSummary.comissoes.map((c) => c.produto_id))
    )
      .map((produtoId) => {
        const comissoesDoProduto = commissionSummary.comissoes.filter(
          (c) => c.produto_id === produtoId
        );
        const nomeProduto =
          comissoesDoProduto[0]?.produto?.name || `Produto #${produtoId}`;
        const totalVendas = comissoesDoProduto.reduce(
          (total, comissao) => total + comissao.quantity,
          0
        );
        const totalComissao = comissoesDoProduto.reduce(
          (total, comissao) => total + comissao.valor,
          0
        );

        return {
          id: produtoId,
          name:
            nomeProduto.length > 20
              ? nomeProduto.substring(0, 20) + '...'
              : nomeProduto,
          vendas: totalVendas,
          comissao: totalComissao,
        };
      })
      .sort((a, b) => b.comissao - a.comissao)
      .slice(0, 5);

    // Dados para gráfico de pizza de status
    const statusPieData = [
      {
        name: 'Pagas',
        value: comissoesPagas,
        color: '#22c55e',
      },
      {
        name: 'Pendentes',
        value: comissoesPendentes,
        color: '#3b82f6',
      },
    ];

    return {
      comissoesPagas,
      comissoesPendentes,
      totalComissoesPagas,
      totalComissoesPendentes,
      filteredCommissions,
      produtosVendidos,
      statusPieData,
    };
  }, [commissionSummary, searchTerm]);

  return data;
}

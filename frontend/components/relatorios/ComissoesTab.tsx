'use client';

import { CommissionSummary } from '@/types/reports';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ComissoesTabProps {
  commissionSummary: CommissionSummary | null;
  loading: boolean;
  formatCurrency: (value: number) => string;
}

export function ComissoesTab({
  commissionSummary,
  loading,
  formatCurrency,
}: ComissoesTabProps) {
  if (loading) {
    return (
      <div className="text-center py-8">Carregando dados de comissões...</div>
    );
  }

  if (!commissionSummary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comissões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Selecione um vendedor para visualizar as informações de comissões
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Destaque para o Campeão do Mês */}
      <Card className="bg-yellow-100">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">Campeão do Mês</CardTitle>
          <span className="text-2xl">🏆</span>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold">
            Vendedor {commissionSummary.vendedor_id} -{' '}
            {formatCurrency(commissionSummary.comissao_total)}
          </p>
          <p className="text-sm text-gray-600">Maior comissão do mês</p>
        </CardContent>
      </Card>

      {/* Tabela de Comissões */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Pedido</th>
              <th className="py-2 px-4 border-b">Vendedor</th>
              <th className="py-2 px-4 border-b">Produto</th>
              <th className="py-2 px-4 border-b text-right">Valor</th>
              <th className="py-2 px-4 border-b text-right">Quantidade</th>
              <th className="py-2 px-4 border-b text-right">Percentual</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Data de Criação</th>
            </tr>
          </thead>
          <tbody>
            {commissionSummary.comissoes.map((comissao: any) => (
              <tr key={comissao.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{comissao.id}</td>
                <td className="py-2 px-4 border-b">#{comissao.pedido_id}</td>
                <td className="py-2 px-4 border-b">#{comissao.vendedor_id}</td>
                <td className="py-2 px-4 border-b">#{comissao.produto_id}</td>
                <td className="py-2 px-4 border-b text-right">
                  R$ {comissao.valor.toFixed(2)}
                </td>
                <td className="py-2 px-4 border-b text-right">
                  {comissao.quantity}
                </td>
                <td className="py-2 px-4 border-b text-right">
                  {comissao.percentual}%
                </td>
                <td className="py-2 px-4 border-b">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      comissao.status === 'pendente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {comissao.status}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">{comissao.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gráfico de Comissões */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Comissões</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={commissionSummary.comissoes}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vendedor_id" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="valor" name="Valor da Comissão" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

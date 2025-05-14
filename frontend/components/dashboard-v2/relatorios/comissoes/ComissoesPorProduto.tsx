'use client';

import { Commission } from '@/types/reports';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';

interface ComissoesPorProdutoProps {
  comissoes: Commission[];
  formatCurrency: (value: number) => string;
}

export function ComissoesPorProduto({
  comissoes,
  formatCurrency,
}: ComissoesPorProdutoProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar comissões pelo termo de pesquisa
  const filteredCommissions = comissoes.filter(
    (comissao) =>
      comissao.pedido_id.toString().includes(searchTerm) ||
      (comissao.produto?.name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comissões por Produto</CardTitle>
        <div className="flex items-center gap-2">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por produto ou pedido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredCommissions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma comissão encontrada com os termos de busca.
            </p>
          ) : (
            filteredCommissions.map((comissao) => (
              <Card key={`${comissao.pedido_id}-${comissao.produto_id}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {comissao.produto?.name ||
                          `Produto #${comissao.produto_id}`}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            comissao.status === 'pago' ? 'default' : 'secondary'
                          }
                        >
                          {comissao.status === 'pago' ? 'Pago' : 'Pendente'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Pedido #{comissao.pedido_id}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {formatCurrency(comissao.valor)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {comissao.quantity}{' '}
                        {comissao.quantity > 1 ? 'unidades' : 'unidade'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

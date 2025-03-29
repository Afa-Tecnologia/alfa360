'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MovimentacaoCaixa } from '@/types/caixa';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  Filter,
  Plus,
  RefreshCcw,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatDate } from '@/utils/format';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MovimentacoesPanelProps {
  movimentacoes: MovimentacaoCaixa[];
  onReload: () => void;
  onRegistrarEntrada: () => void;
  onRegistrarSaida: () => void;
}

/**
 * Componente para exibir as movimentações do caixa, com filtragem e pesquisa
 */
export function MovimentacoesPanel({
  movimentacoes,
  onReload,
  onRegistrarEntrada,
  onRegistrarSaida,
}: MovimentacoesPanelProps) {
  const [search, setSearch] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');
  const [ordenacao, setOrdenacao] = useState<string>('recentes');
  const [agrupar, setAgrupar] = useState<boolean>(false);

  // Funções de filtro e ordenação
  const movimentacoesFiltradas = useMemo(() => {
    let resultado = [...movimentacoes];

    // Aplicar filtro por tipo
    if (tipoFiltro !== 'todos') {
      resultado = resultado.filter((m) => m.type === tipoFiltro);
    }

    // Aplicar filtro por texto
    if (search) {
      const searchLower = search.toLowerCase();
      resultado = resultado.filter(
        (m) =>
          m.description.toLowerCase().includes(searchLower) ||
          (m.payment_method &&
            m.payment_method.toLowerCase().includes(searchLower))
      );
    }

    // Aplicar ordenação
    switch (ordenacao) {
      case 'recentes':
        resultado.sort(
          (a, b) =>
            new Date(b.created_at || '').getTime() -
            new Date(a.created_at || '').getTime()
        );
        break;
      case 'antigos':
        resultado.sort(
          (a, b) =>
            new Date(a.created_at || '').getTime() -
            new Date(b.created_at || '').getTime()
        );
        break;
      case 'valor-maior':
        resultado.sort((a, b) => Number(b.value) - Number(a.value));
        break;
      case 'valor-menor':
        resultado.sort((a, b) => Number(a.value) - Number(b.value));
        break;
    }

    return resultado;
  }, [movimentacoes, search, tipoFiltro, ordenacao]);

  // Função para agrupar movimentações por data
  const movimentacoesAgrupadas = useMemo(() => {
    if (!agrupar) return null;

    const grupos: Record<string, MovimentacaoCaixa[]> = {};

    movimentacoesFiltradas.forEach((mov) => {
      const dataStr = mov.created_at ? formatDate(mov.created_at) : 'Sem data';
      if (!grupos[dataStr]) {
        grupos[dataStr] = [];
      }
      grupos[dataStr].push(mov);
    });

    return Object.entries(grupos).sort((a, b) => {
      // Ordenar as datas em ordem decrescente
      if (a[0] === 'Sem data') return 1;
      if (b[0] === 'Sem data') return -1;
      return new Date(b[0]).getTime() - new Date(a[0]).getTime();
    });
  }, [movimentacoesFiltradas, agrupar]);

  // Tradução amigável para métodos de pagamento
  const traduzirMetodo = (metodo?: string) => {
    if (!metodo) return 'Não informado';

    const traducoes: Record<string, string> = {
      MONEY: 'Dinheiro',
      CREDIT_CARD: 'Cartão de Crédito',
      DEBIT_CARD: 'Cartão de Débito',
      PIX: 'PIX',
      TRANSFER: 'Transferência',
      CONDITIONAL: 'Condicional',
    };

    return traducoes[metodo] || metodo;
  };

  // Tradução amigável para locais
  const traduzirLocal = (local?: string) => {
    if (!local) return 'Não informado';

    const traducoes: Record<string, string> = {
      loja: 'Loja Física',
      ecommerce: 'E-commerce',
    };

    return traducoes[local] || local;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Movimentações do Caixa</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReload}
              className="flex items-center gap-1"
            >
              <RefreshCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Adicionar</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onRegistrarEntrada}>
                  <ArrowUpCircle className="h-4 w-4 mr-2 text-green-500" />
                  Registrar Entrada
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onRegistrarSaida}>
                  <ArrowDownCircle className="h-4 w-4 mr-2 text-red-500" />
                  Registrar Saída
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Barra de ferramentas */}
        <div className="px-4 py-2 border-t border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 w-full sm:w-[200px]"
              />
            </div>

            <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
              <SelectTrigger className="h-9 w-[130px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="entrada">Entradas</SelectItem>
                <SelectItem value="saida">Saídas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9">
                  <SlidersHorizontal className="h-4 w-4 mr-1" />
                  Opções
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-3" align="end">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="ordenacao">Ordenar por</Label>
                    <Select value={ordenacao} onValueChange={setOrdenacao}>
                      <SelectTrigger id="ordenacao" className="h-8 w-full">
                        <SelectValue placeholder="Ordenação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recentes">Mais recentes</SelectItem>
                        <SelectItem value="antigos">Mais antigos</SelectItem>
                        <SelectItem value="valor-maior">Maior valor</SelectItem>
                        <SelectItem value="valor-menor">Menor valor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="agrupar">Agrupar por data</Label>
                    <Button
                      variant={agrupar ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAgrupar(!agrupar)}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Conteúdo principal */}
        <ScrollArea className="max-h-[500px]">
          {movimentacoesFiltradas.length > 0 ? (
            agrupar ? (
              // Exibir movimentações agrupadas por data
              <div className="divide-y">
                {movimentacoesAgrupadas?.map(([data, movs]) => (
                  <div key={data}>
                    <div className="px-4 py-2 bg-gray-50 font-medium text-sm flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {data}
                    </div>
                    <Table>
                      <TableBody>
                        {movs.map((mov) => (
                          <TableRow key={mov.id}>
                            <TableCell className="py-2">
                              <div className="flex items-center gap-3">
                                {mov.type === 'entrada' ? (
                                  <ArrowUpCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                  <ArrowDownCircle className="h-5 w-5 text-red-500" />
                                )}
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm">
                                    {mov.description}
                                  </span>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Badge
                                      variant="outline"
                                      className="px-1 py-0 h-5 text-[10px]"
                                    >
                                      {traduzirMetodo(mov.payment_method || '')}
                                    </Badge>
                                    <Badge
                                      variant="secondary"
                                      className="px-1 py-0 h-5 text-[10px]"
                                    >
                                      {traduzirLocal(mov.local || '')}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right py-2">
                              <span
                                className={`font-semibold ${mov.type === 'entrada' ? 'text-green-600' : 'text-red-600'}`}
                              >
                                {mov.type === 'entrada' ? '+' : '-'}
                                {formatCurrency(+mov.value)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            ) : (
              // Exibir movimentações em tabela
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimentacoesFiltradas.map((mov) => (
                    <TableRow key={mov.id}>
                      <TableCell className="py-2">
                        <div className="flex items-center gap-2">
                          {mov.type === 'entrada' ? (
                            <ArrowUpCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDownCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span>{mov.description}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge variant="outline" className="font-normal">
                          {traduzirMetodo(mov.payment_method || '')}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 text-muted-foreground text-sm">
                        {mov.created_at ? formatDate(mov.created_at) : '-'}
                      </TableCell>
                      <TableCell className="text-right py-2">
                        <span
                          className={`font-semibold ${mov.type === 'entrada' ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {mov.type === 'entrada' ? '+' : '-'}
                          {formatCurrency(+mov.value)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )
          ) : (
            // Mensagem quando não há movimentações
            <div className="py-12 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Filter className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium">
                Nenhuma movimentação encontrada
              </h3>
              <p className="text-muted-foreground mt-1 mb-4">
                {search || tipoFiltro !== 'todos'
                  ? 'Tente ajustar os filtros para ver mais resultados.'
                  : 'Não há movimentações registradas no caixa atual.'}
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch('');
                    setTipoFiltro('todos');
                  }}
                >
                  Limpar filtros
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Registrar
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onRegistrarEntrada}>
                      <ArrowUpCircle className="h-4 w-4 mr-2 text-green-500" />
                      Registrar Entrada
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onRegistrarSaida}>
                      <ArrowDownCircle className="h-4 w-4 mr-2 text-red-500" />
                      Registrar Saída
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

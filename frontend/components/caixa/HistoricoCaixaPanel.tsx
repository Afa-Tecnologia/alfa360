'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, RefreshCcw, Eye, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { formatCurrency, formatDate, formatDateTime } from '@/utils/format';
import {
  CaixaHistoricoItem,
  CaixaHistoricoResponse,
  HistoricoFilters,
} from '@/types/caixa';
import { CaixaService } from '@/services/caixaService';
import { useRouter } from 'next/navigation';

export function HistoricoCaixaPanel() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [historico, setHistorico] = useState<CaixaHistoricoResponse | null>(
    null
  );
  const [filters, setFilters] = useState<HistoricoFilters>({
    page: 1,
    per_page: 10,
  });
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Carregar histórico
  const loadHistorico = async () => {
    try {
      setIsLoading(true);
      // Converter datas para formato ISO se estiverem definidas
      const dataInicio = startDate
        ? format(startDate, 'yyyy-MM-dd')
        : undefined;
      const dataFim = endDate ? format(endDate, 'yyyy-MM-dd') : undefined;

      const response = await CaixaService.getHistorico({
        ...filters,
        data_inicio: dataInicio,
        data_fim: dataFim,
      });

      setHistorico(response);
    } catch (error) {
      console.error('Erro ao carregar histórico de caixas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar histórico ao montar componente e quando filtros mudarem
  useEffect(() => {
    loadHistorico();
  }, [filters.page, filters.status]);

  // Aplicar filtros de data
  const aplicarFiltrosData = () => {
    // Redefine a página para 1 quando aplicar novos filtros
    setFilters({ ...filters, page: 1 });
    loadHistorico();
  };

  // Limpar filtros
  const limparFiltros = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setFilters({ page: 1, per_page: 10 });
    setSearch('');
    loadHistorico();
  };

  // Navegar para detalhes do caixa
  const verDetalhesCaixa = (caixaId: number) => {
    router.push(`/caixa/historico/${caixaId}`);
  };

  // Abrir relatório do caixa
  const abrirRelatorioCaixa = (caixaId: number) => {
    window.open(`/caixa/${caixaId}/report`, '_blank');
  };

  // Renderizar badge de status
  const renderStatusBadge = (status: string) => {
    if (status === 'aberto') {
      return <Badge className="bg-green-500">Aberto</Badge>;
    }
    return <Badge variant="secondary">Fechado</Badge>;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Histórico de Caixas</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadHistorico}
              disabled={isLoading}
            >
              <RefreshCcw className="h-4 w-4 mr-1" />
              Atualizar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 flex gap-2">
            <div className="relative w-full">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por operador..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value as 'open' | 'closed' })
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Abertos</SelectItem>
                <SelectItem value="closed">Fechados</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[160px] justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  {startDate ? format(startDate, 'dd/MM/yyyy') : 'Data inicial'}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[160px] justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  {endDate ? format(endDate, 'dd/MM/yyyy') : 'Data final'}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
            <Button variant="secondary" onClick={aplicarFiltrosData}>
              Aplicar
            </Button>
            <Button variant="ghost" onClick={limparFiltros}>
              Limpar
            </Button>
          </div>
        </div>

        {/* Tabela de histórico */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Operador</TableHead>
                <TableHead>Abertura</TableHead>
                <TableHead>Fechamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Saldo Inicial</TableHead>
                <TableHead>Saldo Final</TableHead>
                <TableHead>Movimentações</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historico?.data && historico.data.length > 0 ? (
                historico.data.map((caixa) => (
                  <TableRow key={caixa.id}>
                    <TableCell>{caixa.id}</TableCell>
                    <TableCell>{caixa.user?.name || 'N/A'}</TableCell>
                    <TableCell>{formatDateTime(caixa.open_date)}</TableCell>
                    <TableCell>
                      {caixa.close_date
                        ? formatDateTime(caixa.close_date)
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{renderStatusBadge(caixa.status)}</TableCell>
                    <TableCell>
                      {formatCurrency(Number(caixa.saldo_inicial))}
                    </TableCell>
                    <TableCell>
                      {caixa.saldo_final
                        ? formatCurrency(Number(caixa.saldo_final))
                        : formatCurrency(Number(caixa.saldo_calculado))}
                    </TableCell>
                    <TableCell>{caixa.total_movimentacoes}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => verDetalhesCaixa(caixa.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => abrirRelatorioCaixa(caixa.id)}
                          title="Gerar relatório"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6">
                    {isLoading
                      ? 'Carregando...'
                      : 'Nenhum registro de caixa encontrado.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginação */}
        {historico?.meta && historico.meta.last_page > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (filters.page && filters.page > 1) {
                      setFilters({ ...filters, page: filters.page - 1 });
                    }
                  }}
                  className={
                    filters.page === 1 ? 'cursor-not-allowed opacity-50' : ''
                  }
                />
              </PaginationItem>

              {Array.from({ length: historico.meta.last_page }).map(
                (_, index) => {
                  const pageNumber = index + 1;
                  const currentPage = filters.page || 1;

                  // Mostrar apenas páginas próximas da atual
                  if (
                    pageNumber === 1 ||
                    pageNumber === historico.meta.last_page ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          isActive={pageNumber === currentPage}
                          onClick={() =>
                            setFilters({ ...filters, page: pageNumber })
                          }
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  // Mostrar elipses para indicar páginas omitidas
                  if (
                    (pageNumber === currentPage - 2 && pageNumber > 1) ||
                    (pageNumber === currentPage + 2 &&
                      pageNumber < historico.meta.last_page)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return null;
                }
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    if (
                      filters.page &&
                      filters.page < historico.meta.last_page
                    ) {
                      setFilters({ ...filters, page: filters.page + 1 });
                    }
                  }}
                  className={
                    filters.page === historico.meta.last_page
                      ? 'cursor-not-allowed opacity-50'
                      : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
}

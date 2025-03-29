'use client';

import { useState, useEffect } from 'react';
import { CaixaService } from '@/services/caixaService';
import { Caixa } from '@/types/caixa';
import { formatDate, formatCurrency } from '@/utils/format';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  Eye,
  FileText,
  Loader2,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { DateRange } from 'react-day-picker';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

interface HistoricoCaixasProps {
  onSelect: (caixaId: number) => void;
}

export function HistoricoCaixas({ onSelect }: HistoricoCaixasProps) {
  const [historico, setHistorico] = useState<Caixa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Carregar dados do histórico
  useEffect(() => {
    loadHistorico();
  }, [currentPage, dateRange]);

  // Função para carregar o histórico com filtros
  const loadHistorico = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const filtros: Record<string, any> = {};

      // Aplicar filtro de data se existir
      if (dateRange?.from) {
        filtros.start_date = dateRange.from.toISOString().split('T')[0];

        if (dateRange.to) {
          filtros.end_date = dateRange.to.toISOString().split('T')[0];
        }
      }

      // Aplicar filtro de busca
      if (search.trim()) {
        filtros.search = search.trim();
      }

      const resposta = await CaixaService.getHistorico({
        ...filtros,
        page: currentPage,
      });

      setHistorico(resposta.data);
      setTotalItems(resposta.meta.total);
      setTotalPages(Math.ceil(resposta.meta.total / 10)); // Assumindo 10 itens por página
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      setError('Não foi possível carregar o histórico de caixas.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para lidar com a busca
  const handleSearch = () => {
    setCurrentPage(1); // Reset para a primeira página ao pesquisar
    loadHistorico();
  };

  // Função para lidar com reset de filtros
  const handleResetFilters = () => {
    setSearch('');
    setDateRange(undefined);
    setCurrentPage(1);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Mostrar todas as páginas se forem poucas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas ao redor da atual
      if (currentPage <= 3) {
        // Primeiras páginas
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Últimas páginas
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Páginas do meio
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              isActive={currentPage > 1}
              aria-disabled={currentPage === 1}
              className={
                currentPage === 1 ? 'pointer-events-none opacity-50' : ''
              }
            />
          </PaginationItem>

          {pages.map((page, index) =>
            page === 'ellipsis' ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={`page-${page}`}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => setCurrentPage(page as number)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              isActive={currentPage < totalPages}
              aria-disabled={currentPage === totalPages}
              className={
                currentPage === totalPages
                  ? 'pointer-events-none opacity-50'
                  : ''
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  if (isLoading && historico.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Caixas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-[250px]" />
              <Skeleton className="h-10 w-[120px]" />
            </div>
            <Skeleton className="h-[400px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle>Histórico de Caixas</CardTitle>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-8 h-9 w-full sm:w-[200px]"
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Filtros</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4" align="end">
                <div className="space-y-3">
                  <h3 className="font-medium text-sm">Filtrar por data</h3>
                  <DatePickerWithRange
                    date={dateRange}
                    setDate={setDateRange}
                  />

                  <div className="flex justify-between mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResetFilters}
                    >
                      Limpar
                    </Button>
                    <Button size="sm" onClick={() => loadHistorico()}>
                      Aplicar
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {error ? (
          <div className="p-6 text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <Button onClick={loadHistorico}>Tentar novamente</Button>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Operador</TableHead>
                    <TableHead>Saldo Inicial</TableHead>
                    <TableHead>Saldo Final</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historico.length > 0 ? (
                    historico.map((caixa) => (
                      <TableRow key={caixa.id}>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {formatDate(caixa.open_date)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {caixa.close_date
                                ? `Fechado: ${formatDate(caixa.close_date)}`
                                : 'Em aberto'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {caixa.user?.name || 'Não informado'}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(+caixa.saldo_inicial)}
                        </TableCell>
                        <TableCell>
                          {caixa.saldo_final
                            ? formatCurrency(+caixa.saldo_final)
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              caixa.status === 'open' ? 'default' : 'secondary'
                            }
                          >
                            {caixa.status === 'open' ? 'Aberto' : 'Fechado'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onSelect(caixa.id)}
                              title="Visualizar detalhes"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                window.open(
                                  `/caixa/${caixa.id}/report`,
                                  '_blank'
                                )
                              }
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
                      <TableCell colSpan={6} className="h-24 text-center">
                        {isLoading ? (
                          <div className="flex justify-center items-center">
                            <Loader2 className="h-6 w-6 text-muted-foreground animate-spin mr-2" />
                            <span>Carregando histórico...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
                            <p className="text-muted-foreground mb-1">
                              Nenhum registro encontrado
                            </p>
                            {(search || dateRange) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleResetFilters}
                              >
                                Limpar filtros
                              </Button>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>

            <div className="py-2 px-4">
              {renderPagination()}

              {totalItems > 0 && (
                <div className="text-xs text-muted-foreground text-center mt-2">
                  Mostrando {Math.min((currentPage - 1) * 10 + 1, totalItems)} a{' '}
                  {Math.min(currentPage * 10, totalItems)} de {totalItems}{' '}
                  registros
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

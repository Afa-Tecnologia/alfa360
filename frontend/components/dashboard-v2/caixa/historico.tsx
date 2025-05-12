'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CaixaService } from '@/services/caixaService';
import { CaixaHistoricoItem, HistoricoFilters } from '@/types/caixa';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, ArrowUpDown, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

interface HistoricoCaixasProps {
  onSelect: (caixaId: number) => void;
}

export function HistoricoCaixas({ onSelect }: HistoricoCaixasProps) {
  const [caixas, setCaixas] = useState<CaixaHistoricoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<HistoricoFilters>({
    page: 1,
    per_page: 10,
  });
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined);
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'date' | 'value'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchCaixas();
  }, [currentPage, filters]);

  const fetchCaixas = async () => {
    try {
      setIsLoading(true);
      const response = await CaixaService.getHistorico({
        ...filters,
        page: currentPage,
        data_inicio: dataInicio ? format(dataInicio, 'yyyy-MM-dd') : undefined,
        data_fim: dataFim ? format(dataFim, 'yyyy-MM-dd') : undefined,
      });

      setCaixas(response.data);
      setTotalPages(response.meta.last_page);
    } catch (error) {
      console.error('Erro ao buscar histórico de caixas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchCaixas();
  };

  const handleClearFilters = () => {
    setDataInicio(undefined);
    setDataFim(undefined);
    setFilters({
      page: 1,
      per_page: 10,
    });
    setCurrentPage(1);
  };

  const handleSort = (field: 'date' | 'value') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }

    // Sort the caixas array
    const sortedCaixas = [...caixas].sort((a, b) => {
      if (field === 'date') {
        const dateA = new Date(a.open_date).getTime();
        const dateB = new Date(b.open_date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === 'asc'
          ? a.saldo_calculado - b.saldo_calculado
          : b.saldo_calculado - a.saldo_calculado;
      }
    });

    setCaixas(sortedCaixas);
  };

  const formatarData = (dataString: string) => {
    return format(new Date(dataString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };

  // Renderizar estado de carregamento
  if (isLoading && caixas.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[200px]" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-10 w-[300px] mx-auto" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Caixas</CardTitle>
          <CardDescription>
            Consulte o histórico de abertura e fechamento de caixas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div className="flex flex-wrap gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[240px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataInicio ? (
                      format(dataInicio, 'dd/MM/yyyy')
                    ) : (
                      <span>Selecione a data inicial</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    locale={ptBR}
                    mode="single"
                    selected={dataInicio}
                    onSelect={setDataInicio}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[240px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataFim ? (
                      format(dataFim, 'dd/MM/yyyy')
                    ) : (
                      <span>Selecione a data final</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    locale={ptBR}
                    mode="single"
                    selected={dataFim}
                    onSelect={setDataFim}
                    initialFocus
                    disabled={(date) =>
                      dataInicio ? date < dataInicio : false
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleFilter}>Filtrar</Button>
              <Button variant="outline" onClick={handleClearFilters}>
                Limpar
              </Button>
            </div>
          </div>

          {/* Tabela */}
          {caixas.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              Nenhum caixa encontrado com os filtros aplicados
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Operador</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="p-0 h-auto font-medium"
                        onClick={() => handleSort('date')}
                      >
                        Data
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="p-0 h-auto font-medium"
                        onClick={() => handleSort('value')}
                      >
                        Saldo
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Movimentações</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {caixas.map((caixa) => (
                    <TableRow key={caixa.id}>
                      <TableCell className="font-medium">#{caixa.id}</TableCell>
                      <TableCell>
                        {caixa.user?.name || 'Não identificado'}
                      </TableCell>
                      <TableCell>{formatarData(caixa.open_date)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            caixa.status === 'aberto'
                              ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400'
                              : caixa.status === 'fechado'
                                ? 'bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400'
                                : 'bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400'
                          )}
                        >
                          {caixa.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(caixa.saldo_calculado)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {caixa.total_movimentacoes}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSelect(caixa.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        handlePageChange(currentPage - 1);
                      }
                    }}
                    className={cn(
                      currentPage === 1 && 'pointer-events-none opacity-50'
                    )}
                  />
                </PaginationItem>

                {[...Array(totalPages)]
                  .map((_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, i, array) => (
                    <PaginationItem key={page}>
                      {i > 0 && array[i - 1] !== page - 1 ? (
                        <PaginationEllipsis />
                      ) : null}
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) {
                        handlePageChange(currentPage + 1);
                      }
                    }}
                    className={cn(
                      currentPage === totalPages &&
                        'pointer-events-none opacity-50'
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

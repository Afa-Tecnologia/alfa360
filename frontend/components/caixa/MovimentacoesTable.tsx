'use client';

import { useState, useEffect } from 'react';
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
import { format, parse } from 'date-fns';
import { IMovimentacoes, IStatus } from '@/types/caixa';
import { caixaService } from '@/utils/caixaService';

interface IMovimentacoesTable{
  status:IStatus
}
export default function MovimentacoesTable({status}:IMovimentacoesTable) {
  const [movimentacoes, setMovimentacoes] = useState<IMovimentacoes[]>([]);
  const [filteredData, setFilteredData] = useState<IMovimentacoes[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Buscar movimentações na API
  const fetchMovimentacoes = async () => {
    try {
      const response = await caixaService.getMovimentacoesById(status.id);
      setMovimentacoes(response);
      setFilteredData(response); // Atualiza os dados filtrados com os dados recebidos
    } catch (error) {
      console.error('Erro ao buscar movimentações:', error);
    }
  };

  useEffect(() => {
    fetchMovimentacoes();
  }, []);

  // Filtro por intervalo de datas
  const handleFilter = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filtered = movimentacoes.filter((row) => {
      const rowDate = parse(row.created_at, 'dd-MM-yyyy HH:mm:ss', new Date());
      return rowDate >= start && rowDate <= end;
    });

    setFilteredData(filtered);
    setCurrentPage(1); // Resetar para a primeira página ao filtrar
  };

 // Paginação segura
const paginatedData = (filteredData || []).slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage
);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Data inicial"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="Data final"
        />
        <Button onClick={handleFilter}>Filtrar</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>R$ {parseFloat(row.value.toString()).toFixed(2)}</TableCell>
                <TableCell>{format(parse(row.created_at, 'dd-MM-yyyy HH:mm:ss', new Date()), 'dd/MM/yyyy HH:mm')}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Nenhuma movimentação encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}

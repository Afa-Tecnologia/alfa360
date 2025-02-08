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
import { format } from 'date-fns';
import { useCaixaStore } from '@/stores/caixaStore';
import { Console } from 'console';

interface IMovimentacoesTable {
  movimentacoes: any[];
}

// Dados simulados para teste
// const mockData = [
//   { id: 1, tipo: "Entrada", valor: 100, data: "2025-01-20" },
//   { id: 2, tipo: "Saída", valor: 50, data: "2025-01-19" },
//   { id: 3, tipo: "Entrada", valor: 200, data: "2025-01-18" },
//   { id: 4, tipo: "Saída", valor: 80, data: "2025-01-17" },
//   // Adicione mais registros conforme necessário
// ]

export default function MovimentacoesTable(props: IMovimentacoesTable) {
  // const { movimentacoes } = useCaixaStore()

  const movimentacoes = props.movimentacoes;
  const [data, setData] = useState(movimentacoes);
  const [filteredData, setFilteredData] = useState(movimentacoes);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filtro por intervalo de data
  const handleFilter = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const filtered = movimentacoes.filter((row) => {
      const rowDate = new Date(row.created_at);
      return rowDate >= start && rowDate <= end;
    });

    setFilteredData(filtered);
    setCurrentPage(1); // Resetar para a primeira página ao filtrar
  };

  // Dados paginados
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

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
            <TableHead>Tipo de Movimentação</TableHead>
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
                <TableCell>{row.payment_method}</TableCell>
                {/* <TableCell>R$ {row.value.toFixed(2)}</TableCell> */}
                <TableCell>
                  {format(new Date(row.data), 'dd-MM-yyyy')}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
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
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}

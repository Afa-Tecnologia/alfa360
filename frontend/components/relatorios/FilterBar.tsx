'use client';

import { DatePicker } from '@/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SalesReportFilters } from '@/types/reports';
import { ptBR } from 'date-fns/locale';

interface FilterBarProps {
  startDate: Date;
  setStartDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
  selectedVendorId: string;
  setSelectedVendorId: (id: string) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
}

export function FilterBar({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedVendorId,
  setSelectedVendorId,
  selectedCategoryId,
  setSelectedCategoryId,
}: FilterBarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data Inicial
        </label>
        <DatePicker date={startDate} setDate={setStartDate} locale={ptBR} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data Final
        </label>
        <DatePicker date={endDate} setDate={setEndDate} locale={ptBR} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vendedor
        </label>
        <Select value={selectedVendorId} onValueChange={setSelectedVendorId}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os vendedores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os vendedores</SelectItem>
            {/* Adicionar os vendedores dinamicamente aqui */}
            <SelectItem value="1">Vendedor 1</SelectItem>
            <SelectItem value="2">Vendedor 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoria
        </label>
        <Select
          value={selectedCategoryId}
          onValueChange={setSelectedCategoryId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as categorias</SelectItem>
            {/* Adicionar as categorias dinamicamente aqui */}
            <SelectItem value="1">Categoria 1</SelectItem>
            <SelectItem value="2">Categoria 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

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
import { useEffect, useState } from 'react';
import { categoryService } from '@/lib/services/CategoryService';
import { userService, User } from '@/lib/services/UserService';

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
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [vendors, setVendors] = useState<User[]>([]);
  const [loading, setLoading] = useState({
    categories: true,
    vendors: true,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      } finally {
        setLoading((prev) => ({ ...prev, categories: false }));
      }
    };

    const fetchVendors = async () => {
      try {
        const vendorsData = await userService.getVendedores();
        setVendors(vendorsData);
      } catch (error) {
        console.error('Erro ao carregar vendedores:', error);
      } finally {
        setLoading((prev) => ({ ...prev, vendors: false }));
      }
    };

    fetchCategories();
    fetchVendors();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data Inicial
        </label>
        <DatePicker
          date={startDate}
          onDateChange={(date) => date && setStartDate(date)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data Final
        </label>
        <DatePicker
          date={endDate}
          onDateChange={(date) => date && setEndDate(date)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vendedor
        </label>
        <Select
          value={selectedVendorId}
          onValueChange={(value) => {
            console.log('Vendedor selecionado:', value);
            setSelectedVendorId(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os vendedores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os vendedores</SelectItem>
            {loading.vendors ? (
              <SelectItem value="carregando" disabled>
                Carregando vendedores...
              </SelectItem>
            ) : (
              vendors.map((vendor) => (
                <SelectItem key={vendor.id} value={vendor.id.toString()}>
                  {vendor.name}
                </SelectItem>
              ))
            )}
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
            {loading.categories ? (
              <SelectItem value="carregando" disabled>
                Carregando categorias...
              </SelectItem>
            ) : (
              categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

import { Filter, Search, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { TableViewSkeleton } from './ProductTableSkeleton';

interface ProductFiltersV2Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string | number;
  onCategoryChange: (categoryId: string | number) => void;
  categories: { id: number; name: string }[];
  onClearFilters: () => void;
  onBarcodeSearch?: (result: string) => void;
  setIsKeyDown?: (value: boolean) => void;
  isSearching?: boolean;
}

export function ProductFiltersV2({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  onClearFilters,
  onBarcodeSearch,
  setIsKeyDown,
  isSearching = false,
}: ProductFiltersV2Props) {
  const hasActiveFilters = searchTerm || selectedCategory !== 'all';

  return (
    <div className="space-y-4">
      {/* Barra de busca */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos por nome, marca, código..."
            value={searchTerm}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setIsKeyDown?.(true);
            }}
            className="pl-8"
          />
          {isSearching && (
            <div className="absolute right-2.5 top-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>

      {/* Filtros de categoria */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtros:</span>
        </div>

        <Select
          value={String(selectedCategory)}
          onValueChange={(value) => {
            onCategoryChange(value === 'all' ? 'all' : Number(value));
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecionar categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Indicador de filtros ativos */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          {searchTerm && (
            <Badge variant="secondary" className="text-xs">
              Busca: "{searchTerm}"
            </Badge>
          )}
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Categoria:{' '}
              {categories.find((c) => c.id === selectedCategory)?.name}
            </Badge>
          )}
        </div>
      )}

      {/* Skeleton local durante busca */}
      {isSearching && (
        <TableViewSkeleton />
      )}
    </div>
  );
}

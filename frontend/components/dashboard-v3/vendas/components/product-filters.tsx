import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProductFiltersProps {
  categories: { id: number; name: string }[];
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

export function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
}: ProductFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filtros:</span>
      </div>

      <ScrollArea className="w-full">
        <div className="flex items-center gap-2 pb-1">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            className="h-8 whitespace-nowrap"
            onClick={() => onCategoryChange(null)}
          >
            Todas categorias
          </Button>

          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              className="h-8 whitespace-nowrap"
              onClick={() => onCategoryChange(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </ScrollArea>

      {selectedCategory !== null && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-muted-foreground"
          onClick={() => onCategoryChange(null)}
        >
          Limpar
        </Button>
      )}
    </div>
  );
}

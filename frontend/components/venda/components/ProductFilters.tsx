'use client';

import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface ProductFiltersProps {
  categories: any[];
  selectedCategory: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

export default function ProductFilters({
  categories,
  selectedCategory,
  onSelectCategory,
}: ProductFiltersProps) {
  return (
    <div className="p-3 border-b">
      <div className="flex items-center gap-2 mb-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Filtrar por categoria:</span>
      </div>
      <div className="flex overflow-x-auto space-x-2 pb-2">
        <Button
          variant={!selectedCategory ? 'default' : 'outline'}
          size="sm"
          className="whitespace-nowrap"
          onClick={() => onSelectCategory(null)}
        >
          Todos os produtos
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            className="whitespace-nowrap"
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

'use client';

import { Layers } from 'lucide-react';

export function CategoryHeader() {
  return (
    <div className="flex items-center gap-3">
      <Layers className="h-8 w-8 text-primary" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Categorias</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie as categorias de produtos da sua loja.
        </p>
      </div>
    </div>
  );
}

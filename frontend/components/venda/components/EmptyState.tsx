'use client';

import { Search } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = 'Nenhum produto encontrado',
  description = 'Tente ajustar o termo de busca ou a categoria selecionada',
  icon = <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center h-full p-4">
      {icon}
      <p className="text-muted-foreground text-lg">{title}</p>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

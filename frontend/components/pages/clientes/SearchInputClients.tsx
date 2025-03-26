import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export function SearchInput({ searchTerm, setSearchTerm }: SearchInputProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar por nome..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}

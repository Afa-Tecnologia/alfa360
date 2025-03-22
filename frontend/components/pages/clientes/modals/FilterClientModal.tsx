import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FilterDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  filterOptions: { cpf: string; email: string };
  setFilterOptions: (options: { cpf: string; email: string }) => void;
  applyFilters: () => void;
}

export function FilterDialog({ isOpen, setIsOpen, filterOptions, setFilterOptions, applyFilters }: FilterDialogProps) {
  
  // Função para limpar filtros dentro do componente
  const clearFilters = () => {
    setFilterOptions({ cpf: '', email: '' });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
          <DialogDescription>Filtre os clientes por critérios específicos.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="filter-cpf">CPF</Label>
            <Input
              id="filter-cpf"
              placeholder="Filtrar por CPF"
              value={filterOptions.cpf}
              onChange={(e) => setFilterOptions({ ...filterOptions, cpf: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-email">Email</Label>
            <Input
              id="filter-email"
              placeholder="Filtrar por email"
              value={filterOptions.email}
              onChange={(e) => setFilterOptions({ ...filterOptions, email: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={clearFilters}>
            Limpar Filtros
          </Button>
          <Button onClick={applyFilters}>Aplicar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

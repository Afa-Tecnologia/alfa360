import React, { useState } from 'react';
import { useProdutoSearch } from '../hooks/useProdutoSearch';
import { EtiquetaProduto } from '../types/etiqueta.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';

interface ProdutoSelectorProps {
  onSelect: (produtos: EtiquetaProduto[]) => void;
}

export const ProdutoSelector: React.FC<ProdutoSelectorProps> = ({
  onSelect,
}) => {
  const { produtos, loading, buscarProdutos } = useProdutoSearch();
  const [busca, setBusca] = useState('');
  const [selecionados, setSelecionados] = useState<EtiquetaProduto[]>([]);
  const { toast } = useToast();

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await buscarProdutos(busca);
      if (produtos.length === 0) {
        toast({
          title: 'Nenhum produto encontrado',
          description: 'Tente outro termo de busca.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Erro ao buscar produtos',
        description: 'Verifique sua conexão ou tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleSelecionar = (produto: EtiquetaProduto) => {
    let novos;
    if (selecionados.some((p) => p.id === produto.id)) {
      novos = selecionados.filter((p) => p.id !== produto.id);
      toast({
        title: 'Produto removido',
        description: produto.name,
      });
    } else {
      novos = [...selecionados, produto];
      toast({
        title: 'Produto selecionado',
        description: produto.name,
      });
    }
    setSelecionados(novos);
    onSelect(novos);
  };

  return (
    <div className="mb-4 w-full max-w-2xl">
      <form
        onSubmit={handleBuscar}
        className="flex gap-2 items-center flex-wrap"
      >
        <Input
          type="text"
          placeholder="Buscar produto por nome ou código"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-64"
        />
        <Button type="submit">Buscar</Button>
        {loading && <Spinner />}
      </form>
      <ul className="mt-2 space-y-1">
        {produtos.map((produto) => (
          <li key={produto.id}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selecionados.some((p) => p.id === produto.id)}
                onChange={() => handleSelecionar(produto)}
                className="accent-primary"
                aria-label={`Selecionar produto ${produto.name}`}
              />
              <span>
                {produto.name}{' '}
                <span className="text-xs text-muted-foreground">
                  ({produto.code})
                </span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

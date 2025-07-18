import React, { useState } from 'react';
import { EtiquetaProduto, EtiquetaVariante } from '../types/etiqueta.types';
import { useToast } from '@/hooks/use-toast';

interface VariantesSelectorProps {
  produtos: EtiquetaProduto[];
  onSelect: (variantes: EtiquetaVariante[]) => void;
}

export const VariantesSelector: React.FC<VariantesSelectorProps> = ({
  produtos,
  onSelect,
}) => {
  const [selecionadas, setSelecionadas] = useState<EtiquetaVariante[]>([]);
  const { toast } = useToast();

  const handleSelecionar = (variante: EtiquetaVariante) => {
    let novas;
    if (selecionadas.some((v) => v.id === variante.id)) {
      novas = selecionadas.filter((v) => v.id !== variante.id);
      toast({
        title: 'Variante removida',
        description: variante.name,
      });
    } else {
      novas = [...selecionadas, variante];
      toast({
        title: 'Variante selecionada',
        description: variante.name,
      });
    }
    setSelecionadas(novas);
    onSelect(novas);
  };

  return (
    <div className="mb-4 w-full max-w-2xl">
      {produtos.map((produto) => (
        <div key={produto.id} className="mb-2">
          <div className="font-semibold mb-1">{produto.name}</div>
          <ul className="flex flex-wrap gap-2">
            {produto.variants.map((variante) => (
              <li key={variante.id}>
                <label className="flex items-center gap-2 cursor-pointer border rounded px-2 py-1 bg-muted">
                  <input
                    type="checkbox"
                    checked={selecionadas.some((v) => v.id === variante.id)}
                    onChange={() => handleSelecionar(variante)}
                    className="accent-primary"
                    aria-label={`Selecionar variante ${variante.name}`}
                  />
                  <span>
                    {variante.name}{' '}
                    <span className="text-xs text-muted-foreground">
                      (Estoque: {variante.quantity})
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

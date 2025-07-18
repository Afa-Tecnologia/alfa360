import React from 'react';
import { EtiquetaVariante } from '../types/etiqueta.types';
import { useToast } from '@/hooks/use-toast';

interface QuantidadeControllerProps {
  variantes: EtiquetaVariante[];
  quantidades: Record<number, number>;
  onChange: (quantidades: Record<number, number>) => void;
}

export const QuantidadeController: React.FC<QuantidadeControllerProps> = ({
  variantes,
  quantidades,
  onChange,
}) => {
  const { toast } = useToast();

  const handleChange = (id: number, value: number) => {
    if (value < 0) value = 0;
    const variante = variantes.find((v) => v.id === id);
    if (variante && value > variante.quantity) {
      value = variante.quantity;
      toast({
        title: 'Quantidade excede o estoque',
        description: `Máximo permitido: ${variante.quantity}`,
        variant: 'destructive',
      });
    }
    onChange({ ...quantidades, [id]: value });
  };

  return (
    <div className="overflow-x-auto mb-4 w-full max-w-2xl">
      <table className="min-w-[400px] border rounded-md bg-background">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">Variante</th>
            <th className="p-2 text-left">Estoque</th>
            <th className="p-2 text-left">Qtd. Etiquetas</th>
          </tr>
        </thead>
        <tbody>
          {variantes.map((variante) => (
            <tr key={variante.id} className="border-t">
              <td className="p-2">{variante.name}</td>
              <td className="p-2">{variante.quantity}</td>
              <td className="p-2">
                <input
                  type="number"
                  min={0}
                  max={variante.quantity}
                  value={quantidades[variante.id] ?? variante.quantity}
                  onChange={(e) =>
                    handleChange(variante.id, Number(e.target.value))
                  }
                  className="w-20 border rounded px-2 py-1"
                  aria-label={`Quantidade de etiquetas para ${variante.name}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

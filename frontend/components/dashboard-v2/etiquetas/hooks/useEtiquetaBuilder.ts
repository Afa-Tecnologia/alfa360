import { useState } from 'react';
import { EtiquetaProduto, EtiquetaVariante } from '../types/etiqueta.types';

export function useEtiquetaBuilder() {
  const [produtosSelecionados, setProdutosSelecionados] = useState<
    EtiquetaProduto[]
  >([]);
  const [variantesSelecionadas, setVariantesSelecionadas] = useState<
    EtiquetaVariante[]
  >([]);
  const [quantidades, setQuantidades] = useState<Record<number, number>>({});

  const atualizarProdutos = (produtos: EtiquetaProduto[]) => {
    setProdutosSelecionados(produtos);
    // Limpa variantes e quantidades se produtos mudarem
    setVariantesSelecionadas([]);
    setQuantidades({});
  };

  const atualizarVariantes = (variantes: EtiquetaVariante[]) => {
    setVariantesSelecionadas(variantes);
    // Atualiza quantidades padrão para cada variante
    const novasQuantidades: Record<number, number> = {};
    variantes.forEach((v) => {
      novasQuantidades[v.id] = v.quantity;
    });
    setQuantidades(novasQuantidades);
  };

  const atualizarQuantidades = (qtds: Record<number, number>) => {
    setQuantidades(qtds);
  };

  return {
    produtosSelecionados,
    atualizarProdutos,
    variantesSelecionadas,
    atualizarVariantes,
    quantidades,
    atualizarQuantidades,
  };
}

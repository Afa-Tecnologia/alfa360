import { useState } from 'react';
import {
  EtiquetaProduto,
  ProdutoSearchResponse,
} from '../types/etiqueta.types';
import etiquetasService from '@/services/etiquetas/etiquetasService';

interface UseProdutoSearchResult {
  produtos: EtiquetaProduto[];
  loading: boolean;
  buscarProdutos: (
    query: string,
    page?: number,
    per_page?: number
  ) => Promise<void>;
}

export function useProdutoSearch(): UseProdutoSearchResult {
  const [produtos, setProdutos] = useState<EtiquetaProduto[]>([]);
  const [loading, setLoading] = useState(false);

  const buscarProdutos = async (query: string, page = 1, per_page = 10) => {
    setLoading(true);
    try {
      const response: ProdutoSearchResponse =
        await etiquetasService.getProducts(page, per_page, query);
      setProdutos(response.data);
    } catch (e) {
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  return { produtos, loading, buscarProdutos };
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductServiceEstoque } from '@/services/products/productEstoqueService';
import { ResponseProducts, ProductEstoque } from '@/types/product';

export function usePagination() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductEstoque[]>([]);
  const [paginationData, setPaginationData] = useState<ResponseProducts>({
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  const currentPage = Number(searchParams.get('page') || '1');
  const perPage = Number(searchParams.get('perPage') || '10');
  const categoria_id = searchParams.get('categoria_id') || 'all';

  const productService = new ProductServiceEstoque();

  const fetchProducts = async (
    page: number,
    perPage: number,
    categoria_id?: string
  ) => {
    setIsLoading(true);
    try {
      const response = await productService.getProducts(
        page,
        perPage,
        undefined,
        categoria_id
      );

      // A API retorna diretamente o objeto de paginação
      // response.data contém os produtos
      setProducts(response.data || []);
      setPaginationData(response);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number, newPerPage?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    if (newPerPage !== undefined) {
      params.set('perPage', String(newPerPage));
    } else {
      params.set('perPage', String(perPage));
    }

    router.push(`?${params.toString()}`);
  };

  const handlePerPageChange = (newPerPage: number) => {
    handlePageChange(1, newPerPage);
  };

  const handleCategoryChange = (newCategoriaId: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newCategoriaId === 'all') {
      params.delete('categoria_id');
    } else {
      params.set('categoria_id', String(newCategoriaId));
    }
    params.set('page', '1'); // Volta para primeira página
    router.push(`?${params.toString()}`);
  };

  // Buscar produtos quando os parâmetros mudarem
  useEffect(() => {
    fetchProducts(currentPage, perPage, categoria_id);
  }, [currentPage, perPage, categoria_id]);

  return {
    products,
    paginationData,
    isLoading,
    currentPage,
    perPage,
    categoria_id,
    handlePageChange,
    handlePerPageChange,
    handleCategoryChange,
    fetchProducts,
  };
}

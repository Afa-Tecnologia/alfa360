'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ProductEstoque, ProductFilters } from '@/types/product';
import { ProductServiceEstoque } from '@/services/products/productEstoqueService';

export function useProductFilters(
  setIsKeyDown: (value: boolean) => void,
  products: ProductEstoque[],
  onProductsChange?: (products: ProductEstoque[]) => void
) {
  const [filters, setFilters] = useState<ProductFilters>({
    searchTerm: '',
    filterCategory: 'all',
    sortOrder: 'asc',
    sortField: 'name',
  });

  const [searchResults, setSearchResults] = useState<ProductEstoque[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const productService = new ProductServiceEstoque();

  // Função para buscar produtos na API
  const searchProductsInAPI = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await productService.getProducts(1, 100, searchTerm);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce para busca na API
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.searchTerm) {
        searchProductsInAPI(filters.searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 500); // 500ms de debounce

    return () => clearTimeout(timeoutId);
  }, [filters.searchTerm, searchProductsInAPI]);

  // Determina quais produtos usar (busca na API ou produtos locais)
  const productsToFilter = useMemo(() => {
    return filters.searchTerm ? searchResults : products;
  }, [filters.searchTerm, searchResults, products]);

  // Filtra e ordena os produtos
  const filteredProducts = useMemo(() => {
    let result = [...productsToFilter];

    // Ordenação
    result.sort((a, b) => {
      const fieldA = a[filters.sortField];
      const fieldB = b[filters.sortField];

      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return filters.sortOrder === 'asc'
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      } else {
        const numA = Number(fieldA) || 0;
        const numB = Number(fieldB) || 0;
        return filters.sortOrder === 'asc' ? numA - numB : numB - numA;
      }
    });

    return result;
  }, [productsToFilter, filters]);

  const updateSearchTerm = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm }));
    setIsKeyDown(true);

    // Remove o loading após um delay maior para busca na API
    setTimeout(() => setIsKeyDown(false), 800);
  };

  const updateCategory = (filterCategory: string | number) => {
    setFilters((prev) => {
      const newFilters = { ...prev, filterCategory: String(filterCategory) };
      return newFilters;
    });
    setIsKeyDown(true);
    setTimeout(() => setIsKeyDown(false), 300);
  };

  const updateSort = (field: keyof ProductEstoque) => {
    setFilters((prev) => ({
      ...prev,
      sortField: field,
      sortOrder:
        prev.sortField === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      filterCategory: 'all',
      sortOrder: 'asc',
      sortField: 'name',
    });
    setSearchResults([]);
  };

  return {
    filters,
    filteredProducts,
    isSearching,
    updateSearchTerm,
    updateCategory,
    updateSort,
    clearFilters,
  };
}

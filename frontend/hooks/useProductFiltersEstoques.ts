'use client';

import { useState, useEffect } from 'react';
import type { ProductEstoque, ProductFilters } from '@/types/product';
import { ProductFilter } from '@/utils/productUtils';
import { set } from 'date-fns';
import { useProductModalsEstoque } from '@/hooks/useProductModalsEstoque';

export function useProductFilters(
  setIsKeyDown: (value: boolean) => void,
  products: ProductEstoque[]
) {
  const [filters, setFilters] = useState<ProductFilters>({
    searchTerm: '',
    filterCategory: 'all',
    sortOrder: 'asc',
    sortField: 'name',
  });

  const [filteredProducts, setFilteredProducts] = useState<ProductEstoque[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ProductEstoque[]>(products || []);

  useEffect(() => {
    if (filters.searchTerm == '') {
      setResult(products);
    }
    const fetchFilteredProducts = async () => {
      setLoading(true);
      setResult(
        await ProductFilter.filterProductsFromAPI(
          filters.searchTerm,
          filters.filterCategory,
          filters.sortField,
          filters.sortOrder
        )
      );

      setFilteredProducts(result);
      setLoading(false);
      setIsKeyDown(false);
    };

    fetchFilteredProducts();
  }, [filters]);

  const updateSearchTerm = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm }));
  };

  const updateCategory = (filterCategory: string) => {
    setFilters((prev) => ({ ...prev, filterCategory }));
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
  };

  return {
    filters,
    filteredProducts,
    loading,
    updateSearchTerm,
    updateCategory,
    updateSort,
    clearFilters,
  };
}

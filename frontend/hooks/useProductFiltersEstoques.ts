"use client"

import { useState, useMemo } from "react"
import type { ProductEstoque,  ProductFilters } from "@/types/product"
import { ProductFilter } from "@/utils/productUtils"

export function useProductFilters(products: ProductEstoque[]) {
  const [filters, setFilters] = useState<ProductFilters>({
    searchTerm: "",
    filterCategory: "all",
    sortOrder: "asc",
    sortField: "name",
  })

  const filteredProducts = useMemo(() => {
    return ProductFilter.filterProducts(
      products,
      filters.searchTerm,
      filters.filterCategory,
      filters.sortField,
      filters.sortOrder,
    )
  }, [products, filters])

  const updateSearchTerm = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm }))
  }

  const updateCategory = (filterCategory: string) => {
    setFilters((prev) => ({ ...prev, filterCategory }))
  }

  const updateSort = (field: keyof ProductEstoque) => {
    setFilters((prev) => ({
      ...prev,
      sortField: field,
      sortOrder: prev.sortField === field && prev.sortOrder === "asc" ? "desc" : "asc",
    }))
  }

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      filterCategory: "all",
      sortOrder: "asc",
      sortField: "name",
    })
  }

  return {
    filters,
    filteredProducts,
    updateSearchTerm,
    updateCategory,
    updateSort,
    clearFilters,
  }
}

"use client"

import { Search, FileDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarcodeScanner } from "@/components/Reusable/BarcodeScanner"
import type { Category } from "@/types/product"
import { set } from "date-fns"
import { useProducts } from "@/hooks/useProductsEstoque"
import { se } from "date-fns/locale"

interface ProductFiltersProps {
  searchTerm: string
  filterCategory: string
  categories: Category[]
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onBarcodeSearch: (result: string) => void
  setIsKeyDown: (value: boolean) => void
}

export function ProductFilters({
  searchTerm,
  filterCategory,
  categories,
  onSearchChange,
  onCategoryChange,
  onBarcodeSearch,
  setIsKeyDown
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar produtos..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => {
            onSearchChange(e.target.value)
          }}
          onKeyDown={(e) => setIsKeyDown(true)}
        />
      </div>
      <div className="w-full sm:w-[180px]">
        <Select value={filterCategory} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <BarcodeScanner onScan={onBarcodeSearch} buttonSize="sm" buttonLabel="Escanear" />
      <Button variant="outline" className="w-full sm:w-auto">
        <FileDown className="mr-2 h-4 w-4" />
        Exportar
      </Button>
    </div>
  )
}

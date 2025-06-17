"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductPageHeaderProps {
  onAddProduct: () => void
}

export function ProductPageHeader({ onAddProduct }: ProductPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Estoque</h2>
        <p className="text-muted-foreground">Gerencie seus produtos e controle seu estoque</p>
      </div>
      <Button onClick={onAddProduct}>
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Produto
      </Button>
    </div>
  )
}

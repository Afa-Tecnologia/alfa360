"use client"

import { ArrowDownUp, Edit, MoreVertical, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Product {
  id: number | string
  name: string
  brand: string
  quantity: number | string
  selling_price: number
}

interface ProductTableProps {
  products: Product[]
  sortField: string
  sortOrder: "asc" | "desc"
  onSort: (field: string) => void
  onViewDetails: (product: Product) => void
  onEditProduct: (product: Product) => void
  onDeleteProduct: (productId: number) => void
  formatCurrency: (value: number) => string
}

export function ProductTable({
  products,
  sortField,
  sortOrder,
  onSort,
  onViewDetails,
  onEditProduct,
  onDeleteProduct,
  formatCurrency,
}: ProductTableProps) {
  return (
    <div className="border rounded-md">
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer min-w-[200px]" onClick={() => onSort("name")}>
                <div className="flex items-center">
                  Produto
                  {sortField === "name" && (
                    <ArrowDownUp className={`ml-1 h-3 w-3 ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer min-w-[150px]" onClick={() => onSort("brand")}>
                <div className="flex items-center">
                  Marca
                  {sortField === "brand" && (
                    <ArrowDownUp className={`ml-1 h-3 w-3 ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer min-w-[100px]" onClick={() => onSort("quantity")}>
                <div className="flex items-center">
                  Estoque
                  {sortField === "quantity" && (
                    <ArrowDownUp className={`ml-1 h-3 w-3 ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer min-w-[120px]" onClick={() => onSort("selling_price")}>
                <div className="flex items-center">
                  Preço
                  {sortField === "selling_price" && (
                    <ArrowDownUp className={`ml-1 h-3 w-3 ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right min-w-[80px] w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
                onClick={() => onViewDetails(product)}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell className="font-medium min-w-[200px]">
                  <span className="truncate block">{product.name}</span>
                </TableCell>
                <TableCell className="min-w-[150px]">
                  <span className="truncate block">{product.brand}</span>
                </TableCell>
                <TableCell className="min-w-[100px]">
                  <span
                    className={
                      Number(product.quantity) === 0
                        ? "text-red-500 font-medium"
                        : Number(product.quantity) < 5
                          ? "text-orange-500 font-medium"
                          : ""
                    }
                  >
                    {product.quantity}
                  </span>
                </TableCell>
                <TableCell className="min-w-[120px]">{formatCurrency(product.selling_price)}</TableCell>
                <TableCell className="text-right min-w-[80px] w-[80px]">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onEditProduct(product)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteProduct(product.id as number)
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, Edit, Trash2, MoreVertical, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function ProductsTable() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)

  // Normalmente, buscaríamos esses dados do backend
  const produtos = [
    {
      id: "BLS-001",
      nome: "Blusa de Seda",
      imagem: "https://res.cloudinary.com/delwujvnn/image/upload/v1741727764/miohghq0nvw9sds1uk41.jpg",
      categoria: "Roupas",
      preco: 189.9,
      estoque: 37,
      status: "Ativo",
      variantes: 3,
    },
    {
      id: "CLC-002",
      nome: "Calça Alfaiataria",
      imagem: "/placeholder.svg?height=800&width=600",
      categoria: "Roupas",
      preco: 259.9,
      estoque: 24,
      status: "Ativo",
      variantes: 3,
    },
    {
      id: "VST-003",
      nome: "Vestido Midi Plissado",
      imagem: "/placeholder.svg?height=800&width=600",
      categoria: "Roupas",
      preco: 329.9,
      estoque: 17,
      status: "Ativo",
      variantes: 3,
    },
    {
      id: "BLZ-004",
      nome: "Blazer Estruturado",
      imagem: "/placeholder.svg?height=800&width=600",
      categoria: "Roupas",
      preco: 399.9,
      estoque: 19,
      status: "Ativo",
      variantes: 3,
    },
    {
      id: "LNC-005",
      nome: "Lenço de Seda",
      imagem: "/placeholder.svg?height=800&width=600",
      categoria: "Acessórios",
      preco: 129.9,
      estoque: 30,
      status: "Ativo",
      variantes: 3,
    },
    {
      id: "BLS-006",
      nome: "Bolsa Tote de Couro",
      imagem: "/placeholder.svg?height=800&width=600",
      categoria: "Acessórios",
      preco: 459.9,
      estoque: 16,
      status: "Ativo",
      variantes: 3,
    },
    {
      id: "SND-007",
      nome: "Sandália de Salto",
      imagem: "/placeholder.svg?height=800&width=600",
      categoria: "Calçados",
      preco: 199.9,
      estoque: 0,
      status: "Esgotado",
      variantes: 5,
    },
  ]

  const toggleSelectAll = () => {
    if (selectedProducts.length === produtos.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(produtos.map((produto) => produto.id))
    }
  }

  const toggleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const handleDeleteProduct = (productId: string) => {
    setProductToDelete(productId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    console.log(`Deletando produto ${productToDelete}`)
    // Aqui você faria uma chamada para a API para deletar o produto
    setDeleteDialogOpen(false)
    setProductToDelete(null)
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedProducts.length === produtos.length && produtos.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Selecionar todos"
                />
              </TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Variantes</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {produtos.map((produto) => (
              <TableRow key={produto.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(produto.id)}
                    onCheckedChange={() => toggleSelectProduct(produto.id)}
                    aria-label={`Selecionar ${produto.nome}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-md">
                      <Image
                        src={produto.imagem || "/placeholder.svg"}
                        alt={produto.nome}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{produto.nome}</p>
                      <p className="text-xs text-muted-foreground">#{produto.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{produto.categoria}</TableCell>
                <TableCell>R$ {produto.preco.toFixed(2)}</TableCell>
                <TableCell>
                  {produto.estoque === 0 ? (
                    <span className="text-red-500">Esgotado</span>
                  ) : produto.estoque < 10 ? (
                    <span className="text-orange-500">{produto.estoque}</span>
                  ) : (
                    <span>{produto.estoque}</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={produto.status === "Ativo" ? "default" : "secondary"}>{produto.status}</Badge>
                </TableCell>
                <TableCell>{produto.variantes}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Link href={`/admin/produtos/${produto.id}`}>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalhes
                        </DropdownMenuItem>
                      </Link>
                      <Link href={`/admin/produtos/${produto.id}/editar`}>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteProduct(produto.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Produto</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-4">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedProducts.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {selectedProducts.length} {selectedProducts.length === 1 ? "produto selecionado" : "produtos selecionados"}
          </p>
          <Button variant="outline" size="sm" onClick={() => setSelectedProducts([])}>
            Limpar seleção
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir selecionados
          </Button>
        </div>
      )}
    </div>
  )
}


"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Edit } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function InventoryTable() {
  const { toast } = useToast()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [newStock, setNewStock] = useState("")

  // Normalmente, buscaríamos esses dados do backend
  const produtos = [
    {
      id: "BLS-001",
      nome: "Blusa de Seda",
      variante: "AZUL - P",
      estoque: 15,
      estoqueMinimo: 5,
      status: "Em estoque",
    },
    {
      id: "BLS-001",
      nome: "Blusa de Seda",
      variante: "AZUL - M",
      estoque: 12,
      estoqueMinimo: 5,
      status: "Em estoque",
    },
    {
      id: "BLS-001",
      nome: "Blusa de Seda",
      variante: "PRETO - P",
      estoque: 8,
      estoqueMinimo: 5,
      status: "Estoque baixo",
    },
    {
      id: "CLC-002",
      nome: "Calça Alfaiataria",
      variante: "PRETO - 38",
      estoque: 6,
      estoqueMinimo: 5,
      status: "Estoque baixo",
    },
    {
      id: "CLC-002",
      nome: "Calça Alfaiataria",
      variante: "PRETO - 40",
      estoque: 10,
      estoqueMinimo: 5,
      status: "Em estoque",
    },
    {
      id: "CLC-002",
      nome: "Calça Alfaiataria",
      variante: "BEGE - 38",
      estoque: 4,
      estoqueMinimo: 5,
      status: "Estoque baixo",
    },
    {
      id: "VST-003",
      nome: "Vestido Midi Plissado",
      variante: "VERDE - P",
      estoque: 3,
      estoqueMinimo: 5,
      status: "Estoque baixo",
    },
    {
      id: "VST-003",
      nome: "Vestido Midi Plissado",
      variante: "VERDE - M",
      estoque: 7,
      estoqueMinimo: 5,
      status: "Em estoque",
    },
    {
      id: "VST-003",
      nome: "Vestido Midi Plissado",
      variante: "ROSA - P",
      estoque: 0,
      estoqueMinimo: 5,
      status: "Esgotado",
    },
    {
      id: "BLZ-004",
      nome: "Blazer Estruturado",
      variante: "PRETO - P",
      estoque: 0,
      estoqueMinimo: 5,
      status: "Esgotado",
    },
  ]

  const handleEditStock = (produto: any) => {
    setSelectedProduct(produto)
    setNewStock(produto.estoque.toString())
    setEditDialogOpen(true)
  }

  const handleSaveStock = () => {
    console.log(`Atualizando estoque do produto ${selectedProduct.id} - ${selectedProduct.variante} para ${newStock}`)

    toast({
      title: "Estoque atualizado",
      description: `O estoque de ${selectedProduct.nome} (${selectedProduct.variante}) foi atualizado para ${newStock} unidades.`,
    })

    setEditDialogOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Em estoque":
        return <Badge className="bg-green-500">Em estoque</Badge>
      case "Estoque baixo":
        return <Badge className="bg-yellow-500">Estoque baixo</Badge>
      case "Esgotado":
        return <Badge className="bg-red-500">Esgotado</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Variante</TableHead>
              <TableHead className="text-right">Estoque Atual</TableHead>
              <TableHead className="text-right">Estoque Mínimo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {produtos.map((produto, index) => (
              <TableRow key={`${produto.id}-${produto.variante}-${index}`}>
                <TableCell>{produto.id}</TableCell>
                <TableCell>{produto.nome}</TableCell>
                <TableCell>{produto.variante}</TableCell>
                <TableCell className="text-right font-medium">
                  {produto.estoque === 0 ? (
                    <span className="text-red-500">0</span>
                  ) : produto.estoque < produto.estoqueMinimo ? (
                    <span className="text-yellow-500">{produto.estoque}</span>
                  ) : (
                    <span>{produto.estoque}</span>
                  )}
                </TableCell>
                <TableCell className="text-right">{produto.estoqueMinimo}</TableCell>
                <TableCell>{getStatusBadge(produto.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEditStock(produto)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Estoque</DialogTitle>
            <DialogDescription>Atualize a quantidade em estoque do produto.</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Produto</p>
                <p>
                  {selectedProduct.nome} ({selectedProduct.variante})
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Estoque Atual</p>
                <p>{selectedProduct.estoque} unidades</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="newStock" className="text-sm font-medium">
                  Novo Estoque
                </label>
                <Input
                  id="newStock"
                  type="number"
                  min="0"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveStock}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


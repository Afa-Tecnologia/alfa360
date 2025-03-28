"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import { useCartStore } from "@/stores/cart-store"
import FinalizeSaleModal from "./FinalizeSaleModal"


export default function CartSidebar() {
  const { items, removeItem, updateQuantity, total, discount , setDiscount, totalWithDiscount} = useCartStore()
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [desconto, setDesconto] = useState<number>(0)

  const handleIncreaseQuantity = (productId: number) => {
    const item = items.find((item) => item.product.id === productId)
    if (item) {
      updateQuantity(productId, item.quantity + 1)
    }
  }

  const handleDecreaseQuantity = (productId: number) => {
    const item = items.find((item) => item.product.id === productId)
    if (item && item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1)
    } else if (item) {
      removeItem(productId)
    }
  }

  const handleRemoveFromCart = (productId: number) => {
    removeItem(productId)
  }

  const handleFinalizeSale = () => {
    if (items.length === 0) {
      alert("Adicione produtos ao carrinho antes de finalizar a venda.")
      return
    }
    setIsPaymentDialogOpen(true)
  }

  const totalComDesconto = totalWithDiscount()
// console.log("PEDIDOS COM VARIANTS: ", items)
  return (
    <div className="bg-muted/40 rounded-lg p-4 flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <ShoppingCart className="mr-2 h-5 w-5" /> Carrinho
      </h2>

      <div className="flex-1 overflow-y-auto mb-4">
        {items.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Carrinho vazio</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="text-right">Qtd</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.product.id}>
                  <TableCell className="font-medium">{item.product.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleDecreaseQuantity(item.product.id)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleIncreaseQuantity(item.product.id)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {(item.product.sellingPrice * item.quantity).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleRemoveFromCart(item.product.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="border-t pt-4 space-y-4">
        <div className="flex justify-between text-lg items-center font-bold">
          <p className="text-sm text-center">Desconto:</p>
          <span>
            <Input
              id="desconto"
              value={discount}
  onChange={(e) => setDiscount(Number(e.target.value))}
              placeholder="Valor do desconto"
              className="items-end"
            />
          </span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>
            {totalComDesconto.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>
        <Button className="w-full" size="lg" onClick={handleFinalizeSale} disabled={items.length === 0}>
          Finalizar Venda
        </Button>
      </div>

      {/* Modal finalizar Venda */}
      <FinalizeSaleModal
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        reqPedidos={{
          desconto: discount,
          total: totalComDesconto,
          produtos: items,
        }}
      />
    </div>
  )
}


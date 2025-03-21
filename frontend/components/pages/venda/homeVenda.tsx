"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import { useProductStore } from "@/stores/product-store"
import { useCartStore } from "@/stores/cart-store"
import { useSaleStore } from "@/stores/sale-store"
import GetProducts from "@/services/products/getProducts"
import GetCategorys from "@/services/products/getCategorys"

interface Product {
  id: number
  name: string
  description: string
  purchase_price: string
  selling_price: string
  quantity: number
  type: string
  image: string | null
  brand: string
  code: string
  categoria_id: number
  created_at: string
  updated_at: string
  variants: any[]
}

// Métodos de pagamento mockados
const paymentMethods = {
  dinheiro: "Dinheiro",
  cartao_credito: "Cartão de Crédito",
  cartao_debito: "Cartão de Débito",
  pix: "PIX",
} as const

type PaymentMethod = keyof typeof paymentMethods

export default function VendasPage() {
  const { products, setProducts } = useProductStore()
  // const [products, setProducts] = useState<Product[]>([])
  const { items, addItem, removeItem, updateQuantity, clearCart, total } = useCartStore()
  const { addSale } = useSaleStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("dinheiro")
  const [customerName, setCustomerName] = useState("")
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false)
  const [receiptData, setReceiptData] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        
         const categoriesData = await GetCategorys()
         setCategories(categoriesData)
        const data = await GetProducts()

        const formattedData: Product[] = data.map((product: Product) => ({
          ...product,
          purchasePrice: product.purchase_price,
          sellingPrice: product.selling_price,
          stock: product.quantity,
          category: product.categoria_id,
        }))

        setProducts(formattedData)

      } catch (error) {
        console.error("Erro ao buscar produtos:", error)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    // Filtro por termo de busca
    const matchesSearch =
      product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro por categoria
    const matchesCategory = selectedCategory ? product.category_id === selectedCategory : true

    return matchesSearch && matchesCategory
  })

  const handleAddToCart = (productId: number) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      addItem(product, 1)
    }
  }

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

  const handleCompleteSale = () => {
    const saleItems = items.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.purchasePrice,
      total: item.product.sellingPrice * item.quantity,
    }))

    const sale = {
      items: saleItems,
      total: total(),
      paymentMethod,
      customerName: customerName || "Cliente não identificado",
    }

    addSale(sale)
    setReceiptData({
      ...sale,
      date: new Date(),
    })
    setIsPaymentDialogOpen(false)
    setIsReceiptDialogOpen(true)
    clearCart()
  }

  const handleCloseReceipt = () => {
    setIsReceiptDialogOpen(false)
    setReceiptData(null)
    setPaymentMethod("dinheiro")
    setCustomerName("")
  }

  return (
    <div className="p-6 h-full">
      <h1 className="text-3xl font-bold mb-6">Vendas</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center space-x-2 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 pl-8"
            />
          </div>
          <div className="flex overflow-x-auto space-x-2 pb-2">
            <Button
              variant={searchTerm === "" && !selectedCategory ? "default" : "outline"}
              className="whitespace-nowrap"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory(null)
              }}
            >
              Todos
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className="whitespace-nowrap"
                onClick={() => {
                  setSelectedCategory(category.id)
                  setSearchTerm("")
                }}
              >
                {category.name}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto h-[calc(100vh-280px)] pr-2">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="flex flex-col justify-between max-h-[300px] ">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{product.brand}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{`${product.sellingPrice} R$`}</p>
                  <p className="text-sm text-muted-foreground">Estoque: {product.quantity} unidades</p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(product.id)}
                    disabled={product.quantity <= 0}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> Adicionar
                  </Button>
                </CardFooter>
              </Card>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">Nenhum produto encontrado</p>
              </div>
            )}
          </div>
        </div>

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
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>
                {total().toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
            <Button className="w-full" size="lg" onClick={handleFinalizeSale} disabled={items.length === 0}>
              Finalizar Venda
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Finalizar Venda</DialogTitle>
            <DialogDescription>Selecione o método de pagamento e informe o cliente.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer" className="text-right">
                Cliente
              </Label>
              <Input
                id="customer"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nome do cliente (opcional)"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment" className="text-right">
                Pagamento
              </Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o método de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                  <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4 text-right text-lg font-bold">
                Total:{" "}
                {total().toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleCompleteSale}>
              Concluir Venda
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Comprovante de Venda</DialogTitle>
            <DialogDescription>Venda realizada com sucesso!</DialogDescription>
          </DialogHeader>
          {receiptData && (
            <div className="py-4 space-y-4">
              <div className="border-b pb-2">
                <p className="font-bold">PDV System</p>
                <p className="text-sm text-muted-foreground">{receiptData.date.toLocaleString("pt-BR")}</p>
                <p className="text-sm">Cliente: {receiptData.customerName}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Itens:</p>
                {receiptData.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.productName}
                    </span>
                    <span>
                      {item.total.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span>
                  {receiptData.total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
              <div className="text-sm">
                <p className="text-sm text-muted-foreground">Método de Pagamento</p>
                <p className="font-medium">
                  {paymentMethods[receiptData.paymentMethod as PaymentMethod] || "Desconhecido"}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" onClick={handleCloseReceipt}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


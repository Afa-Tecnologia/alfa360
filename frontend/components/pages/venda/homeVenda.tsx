"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import { useProductStore } from "@/stores/product-store"
import GetPedidos from "@/services/pedidos/GetPedidos"
import ProductService from "@/services/products/ProductServices"
import Link from "next/link"
import Image from "next/image"
import OrdersSales from "@/services/pedidos/SalesOrders"


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
  sellingPrice?: number
  category_id?: number
}

export default function VendasPage() {
  const { products, setProducts } = useProductStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
      await OrdersSales.getPedidos()
        const categoriesData = await ProductService.getCategorys()
        setCategories(categoriesData)
        const data = await ProductService.getProducts()

        const formattedData: Product[] = data.map((product: Product) => ({
          ...product,
          purchasePrice: product.purchase_price,
          sellingPrice: Number.parseFloat(product.selling_price),
          stock: product.quantity,
          category: product.categoria_id,
          category_id: product.categoria_id,
        }))

        setProducts(formattedData)
      } catch (error) {
        console.error("Erro ao buscar produtos:", error)
      }
    }

    fetchProducts()
  }, [setProducts])
  const filteredProducts = products.filter((product) => {
    // Filtro por termo de busca
    const matchesSearch =
      product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.brand?.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro por categoria
    const matchesCategory = selectedCategory ? product.category_id === selectedCategory : true

    return matchesSearch && matchesCategory
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-100px)] p-4">
      <div className="md:col-span-2 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Catálogo de Produtos</h1>
          
        </div>

        {/* Busca de produtos */}
        <div className="flex items-center space-x-2 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 pl-10"
          />
        </div>

        {/* Categorias */}
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

        {/* Grid de produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto  pr-2">
          {filteredProducts.map((product) => (
            <div key={product.id}>
            
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <div className="relative h-40 bg-gray-100">
                  <Image
                    src={product.image || "/placeholder.svg?height=200&width=300"}
                    alt={product.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader className="pb-2 pt-3">
                  <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-1">{product.brand}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-xl font-bold">
                    {typeof product.sellingPrice === "number"
                      ? product.sellingPrice.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                      : `R$ ${product.sellingPrice}`}
                  </p>
                  <p className="text-sm text-muted-foreground">Estoque: {product.quantity} unidades</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant='default'  className="w-full ">
                  <Link href={`/dashboard/vendas/${product.id}`} key={product.id} >
                    Ver detalhes
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">Nenhum produto encontrado</p>
            </div>
          )}
        </div>
      </div> 
    </div>
  )
}


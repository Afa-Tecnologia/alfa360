"use client"

import { useState, useEffect } from "react"
import { Package, Search, Plus, FileDown, ListMinus, GalleryVerticalEnd, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductStatsCard } from "@/components/dashboard-v2/estoque/product-stats-card"
import { ProductFormDialog } from "@/components/dashboard-v2/estoque/product-form-dialog"
import { ProductDetailsDialog } from "@/components/dashboard-v2/estoque/product-details-dialog"
import type { Product } from "@/stores/productStore"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/app/api/api"
import { BarcodeScanner } from "@/components/Reusable/BarcodeScanner"
import { DeleteConfirmDialog } from "@/components/dashboard-v2/estoque/delete-confirm-dialog"
import { ProductCards } from "@/components/dashboard-v2/estoque/ProductEstoqueCards"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductTable } from "@/components/dashboard-v2/estoque/ProductEstoqueTable"
import { ProductTableSkeleton } from "@/components/dashboard-v2/estoque/ProductTableSkeleton"
import { BulkDeleteConfirmDialog } from "@/components/dashboard-v2/estoque/BulkDeleteConfirmDialog"

// Tipo local para garantir compatibilidade
interface LocalProduct {
  id: number | string
  name: string
  brand: string
  quantity: number | string
  selling_price: number
  purchase_price?: number
  categoria_id?: number
  code?: string
}

export default function EstoquePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [sortField, setSortField] = useState<keyof Product>("name")

  // Dialogs state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
 // Bulk delete state
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([])
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)

  const { toast } = useToast()

  // Função para converter Product para LocalProduct
  const convertToLocalProduct = (product: Product): LocalProduct => ({
    id: product.id || 0,
    name: product.name || "",
    brand: product.brand || "",
    quantity: product.quantity || 0,
    selling_price: Number(product.selling_price || 0),
    purchase_price: Number(product.purchase_price || 0),
    categoria_id: Number(product.categoria_id), 
    code: product.code,
  })

  // Fetch products data
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const response = await api.get("/produtos")
        setProducts(response.data)
        setFilteredProducts(response.data)
      } catch (error) {
        console.error("Error fetching products:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os produtos",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await api.get("/categorias")
        setCategories(response.data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchProducts()
    fetchCategories()
  }, [toast])

  // Filter products based on search term and category
  useEffect(() => {
    let result = [...products]

    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.code?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterCategory && filterCategory !== "all") {
      result = result.filter((product) => product.categoria_id?.toString() === filterCategory)
    }

    // Apply sorting
    result = result.sort((a, b) => {
      const fieldA = a[sortField]
      const fieldB = b[sortField]

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortOrder === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA)
      } else {
        const numA = Number(fieldA) || 0
        const numB = Number(fieldB) || 0
        return sortOrder === "asc" ? numA - numB : numB - numA
      }
    })

    setFilteredProducts(result)
  }, [searchTerm, filterCategory, products, sortOrder, sortField])

  // Calculate statistics
  const getStats = () => {
    const totalProducts = products.length
    const totalValue = products.reduce(
      (acc, product) => acc + (Number(product.purchase_price) || 0) * (Number(product.quantity) || 0),
      0,
    )
    const lowStock = products.filter((product) => Number(product.quantity) < 5).length
    const outOfStock = products.filter((product) => Number(product.quantity) === 0).length

    return { totalProducts, totalValue, lowStock, outOfStock }
  }

  const stats = getStats()

  // Handle product actions
  const handleViewDetails = (product: LocalProduct) => {
    // Encontrar o produto original para manter compatibilidade
    const originalProduct = products.find((p) => p.id === product.id)
    if (originalProduct) {
      setSelectedProduct(originalProduct)
      setIsDetailsOpen(true)
    }
  }

  const handleEditProduct = (product: LocalProduct) => {
    const originalProduct = products.find((p) => p.id === product.id)
    if (originalProduct) {
      setSelectedProduct(originalProduct)
      setIsFormOpen(true)
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    try {
      setIsDeleting(true)
      await api.delete(`/produtos/${productId}`)
      setProducts(products.filter((p) => p.id !== productId))
      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso",
      })
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setProductToDelete(null)
    }
  }
  const handleBulkDeleteConfirm = (productIds: (number | string)[]) => {
    setBulkDeleteIds(productIds)
    setIsBulkDeleteDialogOpen(true)
  }
const handleBulkDelete = async () => {
    try {
      setIsBulkDeleting(true)
      await Promise.all(bulkDeleteIds.map((id) => api.delete(`/produtos/${id}`)))

      setProducts(products.filter((p) => !bulkDeleteIds.includes(p.id || 0)))
      toast({
        title: "Sucesso",
        description: `${bulkDeleteIds.length} produtos excluídos com sucesso`,
      })
      setIsBulkDeleteDialogOpen(false)
      setBulkDeleteIds([])
    } catch (error) {
      console.error("Error bulk deleting products:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir os produtos selecionados",
        variant: "destructive",
      })
    } finally {
      setIsBulkDeleting(false)
    }
  }

  const handleCreateSuccess = () => {
    api
      .get("/produtos")
      .then((response) => {
        setProducts(response.data)
      })
      .catch((error) => {
        console.error("Error refreshing products:", error)
      })
  }

  // Handle sorting
  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  // Format currency
  const formatCurrency = (value: number | string) => {
    const numericValue = typeof value === "string" ? Number.parseFloat(value) : value
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue || 0)
  }

  const handleBarcodeSearchScan = (result: string) => {
    if (result) {
      setSearchTerm(result)
    }
  }

  const handleFormOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        setSelectedProduct(null)
      }, 300)
    }
    setIsFormOpen(open)
  }

  const handleDetailsOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        setSelectedProduct(null)
      }, 300)
    }
    setIsDetailsOpen(open)
  }

  // Converter produtos para o formato esperado pelos componentes
  const localProducts: LocalProduct[] = filteredProducts.map(convertToLocalProduct)
  if (isLoading) {
    return <ProductTableSkeleton />
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Estoque</h2>
          <p className="text-muted-foreground">Gerencie seus produtos e controle seu estoque</p>
        </div>
        <Button
          onClick={() => {
            setSelectedProduct(null)
            setIsFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Produto
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ProductStatsCard
          title="Total de Produtos"
          value={stats.totalProducts}
          description="Produtos cadastrados"
          icon={<Package className="h-4 w-4" />}
          variant="default"
        />
        <ProductStatsCard
          title="Valor em Estoque"
          value={formatCurrency(stats.totalValue)}
          description="Investimento total"
          icon={<Package className="h-4 w-4" />}
          variant="blue"
        />
        <ProductStatsCard
          title="Estoque Baixo"
          value={stats.lowStock}
          description="Menos de 5 unidades"
          icon={<Package className="h-4 w-4" />}
          variant="warning"
        />
        <ProductStatsCard
          title="Sem Estoque"
          value={stats.outOfStock}
          description="Produtos esgotados"
          icon={<Package className="h-4 w-4" />}
          variant="danger"
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Produtos em Estoque</CardTitle>
          <CardDescription>Visualize e gerencie todos os produtos do seu inventário</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar produtos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-[180px]">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
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
            <BarcodeScanner onScan={handleBarcodeSearchScan} buttonSize="sm" buttonLabel="Escanear" />
            <Button variant="outline" className="w-full sm:w-auto">
              <FileDown className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>

          { localProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Nenhum produto encontrado</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Não foi possível encontrar produtos com os filtros selecionados.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setFilterCategory("all")
                }}
              >
                Limpar filtros
              </Button>
            </div>
          ) : (
            <>
              {/* Mobile View - Apenas Cards */}
              <div className="block md:hidden">
                 <ProductCards
                  products={localProducts}
                  loading={isLoading}
                  onViewDetails={handleViewDetails}
                  onEditProduct={handleEditProduct}
                  onDeleteProduct={(id) => {
                    setProductToDelete(Number(id))
                    setIsDeleteDialogOpen(true)
                  }}
                  onBulkDelete={handleBulkDelete} 
                  onBulkDeleteConfirm={handleBulkDeleteConfirm} 
                  formatCurrency={formatCurrency}
                />
              </div>

              {/* Desktop View - Tabs com Tabela e Cards */}
              <div className="hidden md:block">
                <Tabs defaultValue="table" className="w-full">
                  <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
                    <TabsTrigger
                      value="table"
                      className="data-[state=active]:after:bg-primary relative rounded-none py-2 px-4 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      <ListMinus className="h-4 w-4 mr-2" />
                      
                    </TabsTrigger>
                    <TabsTrigger
                      value="cards"
                      className="data-[state=active]:after:bg-primary relative rounded-none py-2 px-4 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      <LayoutGrid className="h-4 w-4" />
                      
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="table" className="mt-6">
                      <ProductCards
                  products={localProducts}
                  loading={isLoading}
                  onViewDetails={handleViewDetails}
                  onEditProduct={handleEditProduct}
                  onDeleteProduct={(id) => {
                    setProductToDelete(Number(id))
                    setIsDeleteDialogOpen(true)
                  }}
                  onBulkDelete={handleBulkDelete}
                  onBulkDeleteConfirm={handleBulkDeleteConfirm}
                  formatCurrency={formatCurrency}
                />
                  </TabsContent>

                  <TabsContent value="cards" className="mt-6">
                    <ProductCards
                      products={localProducts}
                      loading={isLoading}
                      onViewDetails={handleViewDetails}
                      onEditProduct={handleEditProduct}
                      onDeleteProduct={(id) => {
                        setProductToDelete(Number(id))
                        setIsDeleteDialogOpen(true)
                      }}
                      onBulkDelete={handleBulkDelete}
                      formatCurrency={formatCurrency}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Product Form Dialog */}
      <ProductFormDialog
        open={isFormOpen}
        onOpenChange={handleFormOpenChange}
        product={selectedProduct || undefined}
        onSuccess={handleCreateSuccess}
      />

      {/* Product Details Dialog */}
      <ProductDetailsDialog product={selectedProduct} isOpen={isDetailsOpen} onOpenChange={handleDetailsOpenChange} />

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open)
          if (!open && !isDeleting) {
            setProductToDelete(null)
          }
        }}
        onConfirm={() => {
          if (productToDelete) {
            handleDeleteProduct(productToDelete)
          }
        }}
        productName={products.find((p) => p.id === productToDelete)?.name}
        isDeleting={isDeleting}
      />



       {/* Bulk Delete Confirm Dialog */}
      <BulkDeleteConfirmDialog
        open={isBulkDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsBulkDeleteDialogOpen(open)
          if (!open && !isBulkDeleting) {
            setBulkDeleteIds([])
          }
        }}
        onConfirm={handleBulkDelete}
        selectedCount={bulkDeleteIds.length}
        productNames={products
          .filter((p) => bulkDeleteIds.includes(p.id || 0))
          .map((p) => p.name || "")
          .filter(Boolean)}
        isDeleting={isBulkDeleting}
      />
    </div>
  )
}

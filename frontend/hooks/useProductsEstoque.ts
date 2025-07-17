"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import type {  Category, ProductEstoque } from "@/types/product"
import type { IProductService } from "@/services/products/productEstoqueService"


export function useProducts(productService: IProductService) {
  const [products, setProducts] = useState<ProductEstoque[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await productService.getProducts()
      setProducts(response.data)
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
      const data = await productService.getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const deleteProduct = async (id: number | string) => {
    try {
      await productService.deleteProduct(id)
      setProducts(products.filter((p) => p.id !== id))
      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso",
      })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto",
        variant: "destructive",
      })
      throw error
    }
  }

  const deleteProducts = async (ids: (number | string)[]) => {
    try {
      await productService.deleteProducts(ids)
      setProducts(products.filter((p) => !ids.includes(p.id || 0)))
      toast({
        title: "Sucesso",
        description: `${ids.length} produtos excluídos com sucesso`,
      })
    } catch (error) {
      console.error("Error bulk deleting products:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir os produtos selecionados",
        variant: "destructive",
      })
      throw error
    }
  }

  const refreshProducts = async () => {
    await fetchProducts()
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  return {
    products,
    categories,
    isLoading,
    deleteProduct,
    deleteProducts,
    refreshProducts,
  }
}

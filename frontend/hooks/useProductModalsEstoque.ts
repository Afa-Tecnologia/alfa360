"use client"


import { ProductEstoque } from "@/types/product"
import { useState } from "react"


export function useProductModalsEstoque() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductEstoque | null>(null)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)
  const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [isSpecificProduct, setIsSpecificProduct] = useState(false)
  const [isKeyDown, setIsKeyDown] = useState(false)

  const openForm = (product?: ProductEstoque) => {
    setSelectedProduct(product || null)
    setIsFormOpen(true)
  }

  const openSpecificProduct = (product: ProductEstoque) => {
    setSelectedProduct(product)
    setIsSpecificProduct(true)
  }

  const closeSpecificProduct = () => {
    setIsSpecificProduct(false)
    setTimeout(() => setSelectedProduct(null), 300)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setTimeout(() => setSelectedProduct(null), 300)
  }

  const openDetails = (product: ProductEstoque) => {
    setSelectedProduct(product)
    setIsDetailsOpen(true)
  }

  const closeDetails = () => {
    setIsDetailsOpen(false)
    setTimeout(() => setSelectedProduct(null), 300)
  }

  const openDeleteDialog = (productId: number) => {
    setProductToDelete(productId)
    setIsDeleteDialogOpen(true)
  }


  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    if (!isDeleting) {
      setProductToDelete(null)
    }
  }

  const openBulkDeleteDialog = (ids: (number | string)[]) => {
    setBulkDeleteIds(ids)
    setIsBulkDeleteDialogOpen(true)
  }

  const closeBulkDeleteDialog = () => {
    setIsBulkDeleteDialogOpen(false)
    if (!isBulkDeleting) {
      setBulkDeleteIds([])
    }
  }

  return {
    // States
    isFormOpen,
    isDetailsOpen,
    isDeleteDialogOpen,
    isBulkDeleteDialogOpen,
    selectedProduct,
    productToDelete,
    bulkDeleteIds,
    isDeleting,
    isBulkDeleting,
    isSpecificProduct,
    isKeyDown,
    // Actions
    openForm,
    closeForm,
    openDetails,
    closeDetails,
    openDeleteDialog,
    closeDeleteDialog,
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    setIsDeleting,
    setIsBulkDeleting,
    openSpecificProduct,
    setIsSpecificProduct,
    closeSpecificProduct,
    setIsKeyDown
  }
}

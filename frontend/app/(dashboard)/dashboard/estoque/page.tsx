'use client';

import { Package, ListMinus, LayoutGrid } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Services and utilities
import { ProductCalculator, CurrencyFormatter } from '@/utils/productUtils';

// Hooks
import { useProducts } from '@/hooks/useProductsEstoque';
import { useProductFilters } from '@/hooks/useProductFiltersEstoques';
import { useProductModalsEstoque } from '@/hooks/useProductModalsEstoque';

import { ProductStatsCard } from '@/components/dashboard-v2/estoque/product-stats-card';
import { ProductCards } from '@/components/dashboard-v2/estoque/ProductEstoqueCards';
import { ProductFormDialog } from '@/components/dashboard-v2/estoque/product-form-dialog';
import { ProductDetailsDialog } from '@/components/dashboard-v2/estoque/product-details-dialog';
import { DeleteConfirmDialog } from '@/components/dashboard-v2/estoque/delete-confirm-dialog';
import { BulkDeleteConfirmDialog } from '@/components/dashboard-v2/estoque/BulkDeleteConfirmDialog';
import { ProductTableSkeleton } from '@/components/dashboard-v2/estoque/ProductTableSkeleton';

import { ProductServiceEstoque } from '@/services/products/productEstoqueService';
import { ProductFilters } from '@/components/dashboard-v2/estoque/ProductFilters';
import { ProductPageHeader } from '@/components/dashboard-v2/estoque/ProductPageHeader';
import { ProductTable } from '@/components/dashboard-v2/estoque/ProductEstoqueTable';
import { Product } from '@/types/product';

// Dependency injection - seguindo DIP
const productService = new ProductServiceEstoque();

export default function EstoquePage() {
  // Custom hooks para separar responsabilidades
  const {
    products,
    categories,
    isLoading,
    deleteProduct,
    deleteProducts,
    refreshProducts,
  } = useProducts(productService);

  const {
    filters,
    filteredProducts,
    updateSearchTerm,
    updateCategory,
    updateSort,
    clearFilters,
  } = useProductFilters(products);

  const {
    isFormOpen,
    isDetailsOpen,
    isDeleteDialogOpen,
    isBulkDeleteDialogOpen,
    selectedProduct,
    productToDelete,
    bulkDeleteIds,
    isDeleting,
    isBulkDeleting,
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
  } = useProductModalsEstoque();

  // Cálculos usando utility class
  const stats = ProductCalculator.calculateStats(products);
  const localProducts = filteredProducts.map(
    ProductCalculator.convertToLocalProduct
  );

  // Event handlers
  const handleViewDetails = (product: any) => {
    const originalProduct = products.find((p) => p.id === product.id);
    if (originalProduct) {
      openDetails(originalProduct);
    }
  };

  const handleEditProduct = (product: any) => {
    const originalProduct = products.find((p) => p.id === product.id);
    if (originalProduct) {
      openForm(originalProduct);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      await deleteProduct(productToDelete);
      closeDeleteDialog();
    } catch (error) {
      // Error já tratado no hook
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      setIsBulkDeleting(true);
      await deleteProducts(bulkDeleteIds);
      closeBulkDeleteDialog();
    } catch (error) {
      // Error já tratado no hook
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleBarcodeSearch = (result: string) => {
    if (result) {
      updateSearchTerm(result);
    }
  };

  if (isLoading) {
    return <ProductTableSkeleton />;
  }

  return (
    <div className="space-y-6">
      <ProductPageHeader onAddProduct={() => openForm()} />

      {/* Stats Cards */}
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
          value={CurrencyFormatter.format(stats.totalValue)}
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
          <CardDescription>
            Visualize e gerencie todos os produtos do seu inventário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductFilters
            searchTerm={filters.searchTerm}
            filterCategory={filters.filterCategory}
            categories={categories}
            onSearchChange={updateSearchTerm}
            onCategoryChange={updateCategory}
            onBarcodeSearch={handleBarcodeSearch}
          />

          {localProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Nenhum produto encontrado</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Não foi possível encontrar produtos com os filtros selecionados.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Limpar filtros
              </Button>
            </div>
          ) : (
            <>
              {/* Mobile View */}
              <div className="block md:hidden">
                <ProductCards
                  products={localProducts}
                  loading={false}
                  onViewDetails={handleViewDetails}
                  onEditProduct={handleEditProduct}
                  onDeleteProduct={(id) => openDeleteDialog(Number(id))}
                  onBulkDeleteConfirm={openBulkDeleteDialog}
                  formatCurrency={CurrencyFormatter.format}
                />
              </div>

              {/* Desktop View */}
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
                      <LayoutGrid className="h-4 w-4 mr-2" />
                   
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="table" className="mt-6">
                    <ProductTable
                      products={localProducts}
                      sortField={filters.sortField as string}
                      sortOrder={filters.sortOrder}
                      onSort={updateSort}
                      onViewDetails={handleViewDetails}
                      onEditProduct={handleEditProduct}
                      onDeleteProduct={(id) => openDeleteDialog(Number(id))}
                      formatCurrency={CurrencyFormatter.format}
                    />
                  </TabsContent>

                  <TabsContent value="cards" className="mt-6">
                    <ProductCards
                      products={localProducts}
                      loading={false}
                      onViewDetails={handleViewDetails}
                      onEditProduct={handleEditProduct}
                      onDeleteProduct={(id) => openDeleteDialog(Number(id))}
                      onBulkDeleteConfirm={openBulkDeleteDialog}
                      formatCurrency={CurrencyFormatter.format}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ProductFormDialog
        open={isFormOpen}
        onOpenChange={closeForm}
        product={selectedProduct || undefined}
        onSuccess={refreshProducts}
      />

      <ProductDetailsDialog
        product={selectedProduct}
        isOpen={isDetailsOpen}
        onOpenChange={closeDetails}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={closeDeleteDialog}
        onConfirm={handleDeleteProduct}
        productName={products.find((p) => p.id === productToDelete)?.name}
        isDeleting={isDeleting}
      />

      <BulkDeleteConfirmDialog
        open={isBulkDeleteDialogOpen}
        onOpenChange={closeBulkDeleteDialog}
        onConfirm={handleBulkDelete}
        selectedCount={bulkDeleteIds.length}
        productNames={products
          .filter((p) => bulkDeleteIds.includes(p.id || 0))
          .map((p) => p.name || '')
          .filter(Boolean)}
        isDeleting={isBulkDeleting}
      />
    </div>
  );
}

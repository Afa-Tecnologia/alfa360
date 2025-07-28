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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
// Hooks
import { useProducts } from '@/hooks/useProductsEstoque';
import { useProductFilters } from '@/hooks/useProductFiltersEstoques';
import { useProductModalsEstoque } from '@/hooks/useProductModalsEstoque';
import { usePagination } from '@/hooks/usePagination';

import { ProductStatsCard } from '@/components/dashboard-v2/estoque/product-stats-card';
import { ProductCards } from '@/components/dashboard-v2/estoque/ProductEstoqueCards';
import { ProductFormDialog } from '@/components/dashboard-v2/estoque/product-form-dialog';
import { ProductDetailsDialog } from '@/components/dashboard-v2/estoque/product-details-dialog';
import { DeleteConfirmDialog } from '@/components/dashboard-v2/estoque/delete-confirm-dialog';
import { BulkDeleteConfirmDialog } from '@/components/dashboard-v2/estoque/BulkDeleteConfirmDialog';
import {
  ProductTableSkeleton,
  TableViewSkeleton,
} from '@/components/dashboard-v2/estoque/ProductTableSkeleton';

import { ProductServiceEstoque } from '@/services/products/productEstoqueService';
import { ProductFiltersV2 } from '@/components/dashboard-v2/estoque/ProductFiltersV2';
import { ProductPageHeader } from '@/components/dashboard-v2/estoque/ProductPageHeader';
import { ProductEstoqueTableV2 } from '@/components/dashboard-v2/estoque/ProductEstoqueTableV2';
import { ResponseAtributos, ResponseProducts } from '@/types/product';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

import { gerarNotificacao } from '@/utils/toast';

// Dependency injection - seguindo DIP
const productService = new ProductServiceEstoque();

interface EstoquePageProps {
  responseProducts: ResponseProducts;
  categories: any[];
  tiposDeProdutos: any[];
  atributosVariante: ResponseAtributos[];
  page: string | number;
  perPage: string | number;
}

export default function EstoquePage(props: EstoquePageProps) {
  // Hook de paginação dinâmica
  const {
    products,
    paginationData,
    isLoading: paginationLoading,
    currentPage,
    perPage,
    categoria_id,
    handlePageChange,
    handlePerPageChange,
    handleCategoryChange,
  } = usePagination();

  // Custom hooks para separar responsabilidades
  const [categories, setCategories] = useState<any[]>(props.categories || []);
  const [tiposDeProdutos, setTiposDeProdutos] = useState<any[]>(
    props.tiposDeProdutos || []
  );
  const [atributosVariante, setAtributosVariante] = useState<
    ResponseAtributos[]
  >(props.atributosVariante || []);

  const {
    isLoading: deleteLoading,
    deleteProduct,
    deleteProducts,
    refreshProducts,
    setIsLoading,
  } = useProducts(productService);

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
    isSpecificProduct,
    isKeyDown,
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
    setIsKeyDown,
  } = useProductModalsEstoque();

  const {
    filters,
    filteredProducts,
    isSearching,
    updateSearchTerm,
    updateCategory,
    updateSort,
    clearFilters,
  } = useProductFilters(setIsKeyDown, products);

  // Cálculos usando utility class
  const stats = ProductCalculator.calculateStats(products);
  const localProducts = filteredProducts.map(
    ProductCalculator.convertToLocalProduct
  );

  // Event handlers
  const handleViewDetails = (product: any) => {
    // Procura diretamente nos produtos filtrados (que podem ser da busca ou da página)
    const originalProduct = filteredProducts.find((p) => p.id === product.id);

    if (originalProduct) {
      openDetails(originalProduct);
    } else {
      // Fallback: tenta encontrar nos produtos da página
      const fallbackProduct = products.find((p) => p.id === product.id);
      if (fallbackProduct) {
        openDetails(fallbackProduct);
      }
    }
  };

  const handleEditProduct = (product: any) => {
    // Procura diretamente nos produtos filtrados (que podem ser da busca ou da página)
    const originalProduct = filteredProducts.find((p) => p.id === product.id);

    if (originalProduct) {
      openForm(originalProduct);
    } else {
      // Fallback: tenta encontrar nos produtos da página
      const fallbackProduct = products.find((p) => p.id === product.id);
      if (fallbackProduct) {
        openForm(fallbackProduct);
      }
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      await deleteProduct(productToDelete);
      closeDeleteDialog();
      gerarNotificacao('success', 'Produto deletado com sucesso');
      // Recarrega os dados da página atual
      handlePageChange(currentPage, perPage);
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
      // Recarrega os dados da página atual
      handlePageChange(currentPage, perPage);
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

  // Função para obter nome da categoria
  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : 'N/A';
  };

  // Loading state combinado - apenas para operações que recarregam a página
  const isLoading = paginationLoading || deleteLoading;

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
          <ProductFiltersV2
            searchTerm={filters.searchTerm}
            onSearchChange={updateSearchTerm}
            selectedCategory={categoria_id}
            onCategoryChange={handleCategoryChange}
            categories={categories}
            onClearFilters={clearFilters}
            onBarcodeSearch={handleBarcodeSearch}
            setIsKeyDown={setIsKeyDown}
            isSearching={isSearching}
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
                    {isKeyDown && <TableViewSkeleton />}
                    <ProductEstoqueTableV2
                      products={localProducts}
                      isLoading={isKeyDown}
                      sortField={filters.sortField as string}
                      sortOrder={filters.sortOrder}
                      onSort={updateSort}
                      onViewDetails={handleViewDetails}
                      onEditProduct={handleEditProduct}
                      onDeleteProduct={(id) => openDeleteDialog(Number(id))}
                      formatCurrency={CurrencyFormatter.format}
                      getCategoryName={getCategoryName}
                    />
                    <Pagination className="mt-6 flex justify-end">
                      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Select: Itens por página */}
                        <div className="flex items-center gap-2 justify-start">
                          <Label
                            htmlFor="perPageSelect"
                            className="text-sm text-muted-foreground"
                          >
                            Itens por página:
                          </Label>
                          <Select
                            value={perPage.toString()}
                            onValueChange={(value) =>
                              handlePerPageChange(Number(value))
                            }
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Itens por página" />
                            </SelectTrigger>
                            <SelectContent>
                              {[10, 25, 50, 100].map((option) => (
                                <SelectItem
                                  key={option}
                                  value={option.toString()}
                                >
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Paginação normal */}
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  const prev =
                                    Number(paginationData.current_page) - 1;
                                  if (prev >= 1) handlePageChange(prev);
                                }}
                              />
                            </PaginationItem>

                            {Array.from(
                              {
                                length: Number(paginationData.last_page),
                              },
                              (_, i) => {
                                const pageNumber = i + 1;
                                const isActive =
                                  pageNumber ===
                                  Number(paginationData.current_page);
                                return (
                                  <PaginationItem key={pageNumber}>
                                    <PaginationLink
                                      href="#"
                                      isActive={isActive}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handlePageChange(pageNumber);
                                      }}
                                    >
                                      {pageNumber}
                                    </PaginationLink>
                                  </PaginationItem>
                                );
                              }
                            )}

                            <PaginationItem>
                              <PaginationNext
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  const next =
                                    Number(paginationData.current_page) + 1;
                                  if (
                                    next <= Number(paginationData.last_page)
                                  ) {
                                    handlePageChange(next);
                                  }
                                }}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    </Pagination>
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
        categories={categories}
        tiposDeProdutos={tiposDeProdutos}
        atributosVariante={atributosVariante}
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

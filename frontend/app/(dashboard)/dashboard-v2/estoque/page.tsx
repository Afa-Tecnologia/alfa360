'use client';

import { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Plus,
  FileDown,
  ArrowDownUp,
  Barcode,
  MoreVertical,
  Edit,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProductStatsCard } from '@/components/dashboard-v2/estoque/product-stats-card';
import { ProductFormDialog } from '@/components/dashboard-v2/estoque/product-form-dialog';
import { ProductDetailsDialog } from '@/components/dashboard-v2/estoque/product-details-dialog';
import { Product, useProductStore } from '@/stores/productStore';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/app/api/api';
import { BarcodeScanner } from '@/components/Reusable/BarcodeScanner';
import { DeleteConfirmDialog } from '@/components/dashboard-v2/estoque/delete-confirm-dialog';

export default function EstoquePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState<keyof Product>('name');

  // Dialogs state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // Estado para o diálogo de confirmação de exclusão
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { toast } = useToast();

  // Fetch products data
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/produtos');
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os produtos',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get('/categorias');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [toast]);

  // Filter products based on search term and category
  useEffect(() => {
    let result = [...products];

    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory && filterCategory !== 'all') {
      result = result.filter(
        (product) => product.categoria_id.toString() === filterCategory
      );
    }

    // Apply sorting
    result = result.sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];

      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortOrder === 'asc'
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      } else {
        const numA = Number(fieldA) || 0;
        const numB = Number(fieldB) || 0;
        return sortOrder === 'asc' ? numA - numB : numB - numA;
      }
    });

    setFilteredProducts(result);
  }, [searchTerm, filterCategory, products, sortOrder, sortField]);

  // Calculate statistics
  const getStats = () => {
    const totalProducts = products.length;
    const totalValue = products.reduce(
      (acc, product) =>
        acc + Number(product.purchase_price) * Number(product.quantity),
      0
    );
    const lowStock = products.filter(
      (product) => Number(product.quantity) < 5
    ).length;
    const outOfStock = products.filter(
      (product) => Number(product.quantity) === 0
    ).length;

    return { totalProducts, totalValue, lowStock, outOfStock };
  };

  const stats = getStats();

  // Handle product actions
  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      setIsDeleting(true);
      await api.delete(`/produtos/${productId}`);
      setProducts(products.filter((p) => p.id !== productId));
      toast({
        title: 'Sucesso',
        description: 'Produto excluído com sucesso',
      });
      // Fechar o diálogo de confirmação após a exclusão
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o produto',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  const handleCreateSuccess = () => {
    // Refresh products after creation
    api
      .get('/produtos')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error refreshing products:', error);
      });
  };

  // Handle sorting
  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Format currency
  const formatCurrency = (value: number | string) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numericValue);
  };

  // Função para lidar com o escaneamento de código de barras para pesquisa
  const handleBarcodeSearchScan = (result: string) => {
    if (result) {
      setSearchTerm(result);
    }
  };

  // Função para lidar com a abertura/fechamento do diálogo de formulário
  const handleFormOpenChange = (open: boolean) => {
    // Se estiver fechando o diálogo
    if (!open) {
      // Limpamos o produto selecionado após um pequeno delay
      // para evitar problemas de estado durante a animação de fechamento
      setTimeout(() => {
        setSelectedProduct(null);
      }, 300);
    }

    setIsFormOpen(open);
  };

  // Função para lidar com a abertura/fechamento do diálogo de detalhes
  const handleDetailsOpenChange = (open: boolean) => {
    // Se estiver fechando o diálogo
    if (!open) {
      // Limpamos o produto selecionado após um pequeno delay
      setTimeout(() => {
        setSelectedProduct(null);
      }, 300);
    }

    setIsDetailsOpen(open);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Estoque</h2>
          <p className="text-muted-foreground">
            Gerencie seus produtos e controle seu estoque
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedProduct(null);
            setIsFormOpen(true);
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
          <CardDescription>
            Visualize e gerencie todos os produtos do seu inventário
          </CardDescription>
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
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <BarcodeScanner
              onScan={handleBarcodeSearchScan}
              buttonSize="sm"
              buttonLabel="Escanear"
            />
            <Button variant="outline" className="w-full sm:w-auto">
              <FileDown className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <p>Carregando produtos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Nenhum produto encontrado</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Não foi possível encontrar produtos com os filtros selecionados.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('all');
                }}
              >
                Limpar filtros
              </Button>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Produto
                        {sortField === 'name' && (
                          <ArrowDownUp
                            className={`ml-1 h-3 w-3 ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('brand')}
                    >
                      <div className="flex items-center">
                        Marca
                        {sortField === 'brand' && (
                          <ArrowDownUp
                            className={`ml-1 h-3 w-3 ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('quantity')}
                    >
                      <div className="flex items-center">
                        Estoque
                        {sortField === 'quantity' && (
                          <ArrowDownUp
                            className={`ml-1 h-3 w-3 ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('selling_price')}
                    >
                      <div className="flex items-center">
                        Preço
                        {sortField === 'selling_price' && (
                          <ArrowDownUp
                            className={`ml-1 h-3 w-3 ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      onClick={() => handleViewDetails(product)}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>
                        <span
                          className={
                            Number(product.quantity) === 0
                              ? 'text-red-500 font-medium'
                              : Number(product.quantity) < 5
                                ? 'text-orange-500 font-medium'
                                : ''
                          }
                        >
                          {product.quantity}
                        </span>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(product.selling_price)}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditProduct(product);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setProductToDelete(product.id as number);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
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
      <ProductDetailsDialog
        product={selectedProduct}
        isOpen={isDetailsOpen}
        onOpenChange={handleDetailsOpenChange}
      />

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open && !isDeleting) {
            setProductToDelete(null);
          }
        }}
        onConfirm={() => {
          if (productToDelete) {
            handleDeleteProduct(productToDelete);
          }
        }}
        productName={products.find((p) => p.id === productToDelete)?.name}
        isDeleting={isDeleting}
      />
    </div>
  );
}

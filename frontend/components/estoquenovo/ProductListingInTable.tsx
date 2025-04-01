'use client';
import { useEffect, useState } from 'react';
import { Product, useProductStore } from '@/stores/productStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Trash2, PencilIcon, Search, Package } from 'lucide-react';
import CreateProductForm from './ProductCreateForm';
import EditProductForm from './ProductEditForm';
import { gerarNotificacao } from '@/utils/toast';
import { api } from '@/app/api/api';
import NoData from '../Semdados/NoData';
import { ProductsTable } from '../admin/products-table';
import EmptyStockTable from './EmptyStockTable';

export default function ProductListingInTable() {
  const {
    products,
    setProducts,
    product,
    deleteProduct,
    setCurrentProduct,
    setPurchasePrice,
    setSelectedCategoria,
    setSellingPrice,
    setTipoProduto,
  } = useProductStore();

  const { openForm, closeForm, setIsOpenCreate, setIsOpenEdit } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Filter products based on search term
  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.brand.toLowerCase().includes(searchLower) ||
      product.type.toLowerCase().includes(searchLower) ||
      product.variants.some(
        (variant) =>
          variant.name.toLowerCase().includes(searchLower) ||
          variant.color.toLowerCase().includes(searchLower) ||
          variant.size.toLowerCase().includes(searchLower)
      )
    );
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortConfig.direction === 'asc'
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearDataProduct = () => {
    setCurrentProduct({
      id: '',
      name: '',
      description: '',
      purchase_price: 0,
      selling_price: 0,
      quantity: 0,
      brand: '',
      type: '',
      variants: [],
      categoria_id: 0,
    });
  };

  const handleSort = (key: keyof Product) => {
    setSortConfig((current) => ({
      key,
      direction:
        current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleNewProductForm = (product: Product) => {
    clearDataProduct();
    setIsOpenCreate(true);
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    openForm(product.id);
  };

  const handleDeleteProduct = async (id: number | string) => {
    try {
      await api.delete(`/produtos/${id}`);
      deleteProduct(id);
      gerarNotificacao('success', 'Produto excluído com sucesso');
    } catch (e) {
      gerarNotificacao('error', 'Erro ao deletar produto');
    }
  };

  const fetchProdutos = async () => {
    try {
      const response = await api.get('/produtos');
      setProducts(response?.data);
    } catch (e) {
      gerarNotificacao('error', 'Erro ao buscar produtos');
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, descrição, marca ou variante..."
            className="w-full pl-10"
          />
        </div>
        <Button onClick={() => handleNewProductForm(product)}>
          + Novo Produto
        </Button>
      </div>

      {paginatedProducts.length === 0 ? (
        <EmptyStockTable />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  onClick={() => handleSort('name')}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    Nome
                    <span className="text-gray-400">↕</span>
                  </div>
                </TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead
                  onClick={() => handleSort('purchase_price')}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    Preço de Compra
                    <span className="text-gray-400">↕</span>
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort('selling_price')}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    Preço de Venda
                    <span className="text-gray-400">↕</span>
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort('quantity')}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    Quantidade
                    <span className="text-gray-400">↕</span>
                  </div>
                </TableHead>
                <TableHead>Variantes</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {product.description}
                  </TableCell>
                  <TableCell>
                    R$ {Number(product.purchase_price).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    R$ {Number(product.selling_price).toFixed(2)}
                  </TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span>{product.variants.length}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditProduct(product)}
                              className="hover:bg-blue-50"
                            >
                              <PencilIcon className="h-4 w-4 text-blue-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar Produto</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDeleteProduct(product.id || 0)
                              }
                              className="hover:bg-red-50"
                            >
                              <Trash2 className="h-4 text-red-500 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Excluir Produto</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <p className="text-muted-foreground text-sm">
            Mostrando {paginatedProducts.length} de {filteredProducts.length}{' '}
            produtos
          </p>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Itens por página" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 por página</SelectItem>
              <SelectItem value="20">20 por página</SelectItem>
              <SelectItem value="50">50 por página</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Anterior
          </Button>
          <div className="text-sm">
            Página {currentPage} de {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Próxima
          </Button>
        </div>
      </div>

      <CreateProductForm fetchProducts={fetchProdutos} />
      <EditProductForm />
    </div>
  );
}

'use client';

import {
  ArrowDownUp,
  Edit,
  MoreVertical,
  Trash2,
  Package,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProductEstoque } from '@/types/product';
import Image from 'next/image';

interface Product {
  id: number | string;
  name: string;
  brand: string;
  quantity: number | string;
  selling_price: number;
  purchase_price?: number;
  description?: string;
  code?: string;
  categoria_id?: number;
}

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: keyof ProductEstoque) => void;
  onViewDetails: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
  formatCurrency: (value: number) => string;
  getCategoryName?: (categoryId: number) => string;
}

export function ProductEstoqueTableV2({
  products,
  isLoading,
  sortField,
  sortOrder,
  onSort,
  onViewDetails,
  onEditProduct,
  onDeleteProduct,
  formatCurrency,
  getCategoryName,
}: ProductTableProps) {
  // Formatação de preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead className="hidden md:table-cell">Categoria</TableHead>
              <TableHead>Preço de Venda</TableHead>
              <TableHead>Preço de Compra</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer min-w-[200px]"
              onClick={() => onSort('name')}
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
            <TableHead className="hidden md:table-cell">Categoria</TableHead>
            <TableHead
              className="cursor-pointer min-w-[120px]"
              onClick={() => onSort('selling_price')}
            >
              <div className="flex items-center">
                Preço de Venda
                {sortField === 'selling_price' && (
                  <ArrowDownUp
                    className={`ml-1 h-3 w-3 ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                  />
                )}
              </div>
            </TableHead>
            {/* <TableHead
              className="cursor-pointer min-w-[120px]"
              onClick={() => onSort('purchase_price')}
            >
              <div className="flex items-center">
                Preço de Compra
                {sortField === 'purchase_price' && (
                  <ArrowDownUp
                    className={`ml-1 h-3 w-3 ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                  />
                )}
              </div>
            </TableHead> */}
            <TableHead
              className="cursor-pointer min-w-[100px]"
              onClick={() => onSort('quantity')}
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
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onViewDetails(product)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-muted relative overflow-hidden flex-shrink-0">
                    <div className="flex items-center justify-center h-full">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {product.brand || 'Sem marca'}
                    </div>
                    {product.code && (
                      <div className="text-xs text-muted-foreground">
                        Código: {product.code}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {getCategoryName
                  ? getCategoryName(product.categoria_id || 0)
                  : 'N/A'}
              </TableCell>
              <TableCell>{formatCurrency(product.selling_price)}</TableCell>
              {/* <TableCell>
                {formatCurrency(product.purchase_price || 0)}
              </TableCell> */}
              <TableCell>
                <div className="flex items-center">
                  {Number(product.quantity) <= 0 ? (
                    <Badge variant="destructive">Sem estoque</Badge>
                  ) : Number(product.quantity) < 5 ? (
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-600 border-amber-200"
                    >
                      {product.quantity} unid.
                    </Badge>
                  ) : (
                    <span>{product.quantity}</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(product);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditProduct(product);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProduct(product.id as number);
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
  );
}

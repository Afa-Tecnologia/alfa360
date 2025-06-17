'use client';

import { useState } from 'react';
import {
  Package,
  Tag,
  DollarSign,
  Edit,
  Trash2,
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Product {
  id: number | string;
  name: string;
  brand: string;
  quantity: number | string;
  selling_price: number;
  // Adicione outros campos conforme necessário
}
interface ProductCardsProps {
  products: Product[];
  loading: boolean;
  onViewDetails: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
  onBulkDelete?: (productIds: (number | string)[]) => void;
  onBulkDeleteConfirm?: (productIds: (number | string)[]) => void;
  formatCurrency: (value: number) => string;
}

export function ProductCards({
  products,
  loading,
  onViewDetails,
  onEditProduct,
  onDeleteProduct,
  onBulkDelete,
  onBulkDeleteConfirm,
  formatCurrency,
}: ProductCardsProps) {
  const [selectedIds, setSelectedIds] = useState<(number | string)[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id: number | string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      // Se tem onBulkDeleteConfirm, usa o modal
      if (onBulkDeleteConfirm) {
        onBulkDeleteConfirm(selectedIds);
      }
      // Senão usa o método direto (compatibilidade)
      else if (onBulkDelete) {
        onBulkDelete(selectedIds);
        setSelectedIds([]);
      }
    }
  };

  const getStockStatus = (quantity: number | string) => {
    const qty = Number(quantity);
    if (qty === 0) {
      return {
        label: 'Sem estoque',
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        icon: <AlertTriangle className="h-3 w-3" />,
      };
    } else if (qty < 5) {
      return {
        label: 'Estoque baixo',
        color:
          'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        icon: <AlertTriangle className="h-3 w-3" />,
      };
    } else {
      return {
        label: 'Em estoque',
        color:
          'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
        icon: <CheckCircle className="h-3 w-3" />,
      };
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Header com controles */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-36" />
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="w-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header com controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          {products.length > 0 && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={
                  selectedIds.length === products.length && products.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium">
                Selecionar todos
              </label>
            </div>
          )}

          {selectedIds.length > 0 && onBulkDelete && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Não há produtos cadastrados no momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((product) => {
            const stockStatus = getStockStatus(product.quantity);

            return (
              <Card
                key={product.id}
                className={`w-full transition-all duration-200  ${
                  selectedIds.includes(product.id)
                    ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950'
                    : 'hover:shadow-md'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between ">
                    <div className="flex items-center gap-3 flex-1">
                      <Checkbox
                        checked={selectedIds.includes(product.id)}
                        onCheckedChange={(checked) =>
                          handleSelectItem(product.id, checked as boolean)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex flex-col">
                        <CardTitle className="pb-2 font-semibold flex items-center gap-2 overflow-hidden">
                          <Package className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                          <span className="truncate sm:max-w-[10rem] lg:max-w-none sm:block lg:whitespace-normal">
                            {product.name}
                          </span>
                        </CardTitle>

                        <div className="flex gap-3">
                          <p className="text-sm text-gray-500 truncate mt-1">
                            {product.brand}
                          </p>
                          <Badge className={stockStatus.color}>
                            <div className="flex items-center gap-1">
                              {stockStatus.icon}
                              <span className="text-[10px]">
                                {stockStatus.label}
                              </span>
                            </div>
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Tag className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500">Estoque</p>
                        <p
                          className={`font-medium ${
                            Number(product.quantity) === 0
                              ? 'text-red-500'
                              : Number(product.quantity) < 5
                                ? 'text-orange-500'
                                : 'text-gray-900 dark:text-gray-100'
                          }`}
                        >
                          {product.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500">Preço</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(product.selling_price)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2  pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(product);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="text-xs">Detalhes</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditProduct(product);
                      }}
                    >
                      <Edit className="h-3 w-3 " />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProduct(product.id as number);
                      }}
                    >
                      <Trash2 className=" h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

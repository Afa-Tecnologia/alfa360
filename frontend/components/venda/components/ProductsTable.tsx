'use client';

import { Product } from '@/types/sales';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import Image from 'next/image';

interface ProductsTableProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  formatPrice: (price: number) => string;
  getCategoryName: (categoryId: number) => string;
}

export default function ProductsTable({
  products,
  onProductSelect,
  onQuickAddToCart,
  formatPrice,
  getCategoryName,
}: ProductsTableProps) {
  return (
    <Table>
      <TableHeader className="sticky top-0 bg-background">
        <TableRow>
          <TableHead className="w-12">Imagem</TableHead>
          <TableHead>Produto</TableHead>
          <TableHead>Código</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead className="text-right">Preço</TableHead>
          <TableHead className="text-center">Estoque</TableHead>
          <TableHead className="text-right lg:hidden">Ação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow
            key={product.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onProductSelect(product)}
          >
            <TableCell className="p-2">
              <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted">
                {product?.variants[0]?.images[0] ? (
                  <Image
                    src={product?.variants[0]?.images[0]}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="object-cover"
                    unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  <Image
                    src="/placeholder.svg"
                    alt="Produto sem imagem"
                    width={40}
                    height={40}
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.brand}</p>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {product.code}
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="font-normal">
                {getCategoryName(product.category_id)}
              </Badge>
            </TableCell>
            <TableCell className="text-right font-medium text-primary">
              {formatPrice(product.sellingPrice)}
            </TableCell>
            <TableCell className="text-center">
              <span
                className={`text-sm ${product.quantity <= 5 ? 'text-destructive' : 'text-muted-foreground'}`}
              >
                {product.quantity}
              </span>
            </TableCell>
            <TableCell className="text-right lg:hidden">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAddToCart(product);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

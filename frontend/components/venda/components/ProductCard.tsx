'use client';

import { Product } from '@/types/sales';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
  onProductSelect: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  formatPrice: (price: number) => string;
  getCategoryName: (categoryId: number) => string;
}

export default function ProductCard({
  product,
  onProductSelect,
  onQuickAddToCart,
  formatPrice,
  getCategoryName,
}: ProductCardProps) {
  return (
    <Card
      className="overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onProductSelect(product)}
    >
      <div className="relative aspect-square w-full bg-muted">
        {product?.variants[0]?.images[0] ? (
          <Image
            src={product?.variants[0]?.images[0]}
            alt={product.name}
            fill
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
            fill
            className="object-cover"
            unoptimized
          />
        )}
      </div>

      <CardContent className="flex-grow p-3">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <Badge variant="outline" className="font-normal text-xs">
              {getCategoryName(product.category_id)}
            </Badge>
            <span
              className={`text-xs font-medium ${
                product.quantity <= 5
                  ? 'text-destructive'
                  : 'text-muted-foreground'
              }`}
            >
              Estoque: {product.quantity}
            </span>
          </div>

          <h3 className="font-semibold line-clamp-2 text-sm">{product.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {product.brand} | Cód: {product.code}
          </p>
          <p className="font-medium text-primary text-base mt-auto">
            {formatPrice(product.sellingPrice)}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={(e) => {
            e.stopPropagation();
            onQuickAddToCart(product);
          }}
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
}

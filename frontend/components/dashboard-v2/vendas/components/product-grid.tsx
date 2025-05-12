import { ShoppingCart, Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/sales';
import Image from 'next/image';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onProductSelect: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
}

export function ProductGrid({
  products,
  isLoading,
  onProductSelect,
  onQuickAddToCart,
}: ProductGridProps) {
  // Formatação de preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="group relative border rounded-lg overflow-hidden bg-card transition-all hover:shadow-md"
          onClick={() => onProductSelect(product)}
        >
          {/* Imagem do produto */}
          <div className="aspect-square relative bg-muted">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Package className="h-16 w-16 text-muted-foreground" />
              </div>
            )}

            {/* Badge de estoque */}
            {product.stock <= 0 ? (
              <Badge variant="destructive" className="absolute top-2 right-2">
                Sem estoque
              </Badge>
            ) : product.stock < 5 ? (
              <Badge
                variant="outline"
                className="absolute top-2 right-2 bg-amber-50 text-amber-600 border-amber-200"
              >
                Estoque baixo
              </Badge>
            ) : null}
          </div>

          <div className="p-3">
            <h3 className="font-medium line-clamp-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {product.brand || 'Sem marca'}
            </p>

            <div className="flex items-center justify-between mt-2">
              <p className="font-bold">{formatPrice(product.sellingPrice)}</p>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickAddToCart(product);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {product.variants && product.variants.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground">
                  {product.variants.length}{' '}
                  {product.variants.length === 1 ? 'variante' : 'variantes'}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

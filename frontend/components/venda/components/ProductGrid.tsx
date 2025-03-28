'use client';

import { Product } from '@/types/sales';
import ProductCard from './ProductCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  formatPrice: (price: number) => string;
  getCategoryName: (categoryId: number) => string;
}

export default function ProductGrid({
  products,
  onProductSelect,
  onQuickAddToCart,
  formatPrice,
  getCategoryName,
}: ProductGridProps) {
  return (
    <ScrollArea className="h-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 p-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onProductSelect={onProductSelect}
            onQuickAddToCart={onQuickAddToCart}
            formatPrice={formatPrice}
            getCategoryName={getCategoryName}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

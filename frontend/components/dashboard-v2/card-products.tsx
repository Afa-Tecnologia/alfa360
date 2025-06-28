'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import ProductService from '@/services/products/ProductServices';
import { formatCurrency } from '@/utils/formatters';
import { TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

interface Product {
  id: number;
  name: string;
  quantity: number;
  selling_price: number;
}

export default function CardProdutosPopulares() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await ProductService.getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        setError('Erro ao buscar produtos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const sortedProducts = products
    .filter((p) => p.quantity > 0)
    .sort((a, b) => b.quantity - a.quantity) // ordena por mais "vendidos"/estoque
    .slice(0, 4); // top 4 produtos
  const MetricsLoading = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
  if (isLoading) return <MetricsLoading />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Produtos Populares</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>
          Produtos com mais estoque (base para vendas)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px] pr-2">
          <div className="space-y-4">
            {sortedProducts?.map((produto) => (
              <div
                key={produto.id}
                className="flex justify-between items-center pb-3 border-b"
              >
                <div>
                  <p className="font-medium">{produto.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {produto.quantity} unidades disponíveis
                  </p>
                </div>
                <div className="font-semibold">
                  {formatCurrency(produto.selling_price)}
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
